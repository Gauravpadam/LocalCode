package com.localcode.services;

import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.api.command.CreateContainerResponse;
import com.github.dockerjava.api.command.ExecCreateCmdResponse;
import com.github.dockerjava.api.command.InspectContainerResponse;
import com.github.dockerjava.api.model.*;
import com.github.dockerjava.core.DefaultDockerClientConfig;
import com.github.dockerjava.core.DockerClientConfig;
import com.github.dockerjava.core.DockerClientImpl;
import com.github.dockerjava.core.command.ExecStartResultCallback;
import com.github.dockerjava.httpclient5.ApacheDockerHttpClient;
import com.github.dockerjava.transport.DockerHttpClient;
import com.localcode.config.DockerSecurityConfig;
import com.localcode.config.ResourceLimits;
import com.localcode.dto.ExecutionRequest;
import com.localcode.dto.ExecutionResult;
import com.localcode.dto.ExecutionStatus;
import com.localcode.dto.ResourceMetrics;
import com.localcode.exception.ExecutionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.util.Arrays;
import java.util.concurrent.*;

/**
 * Service for executing code in isolated Docker containers.
 */

// TODO: Handle cases where input is empty. - DONE

@Service
public class CodeExecutorService {
    
    private static final Logger logger = LoggerFactory.getLogger(CodeExecutorService.class);
    
    private final DockerClient dockerClient;
    private final ResourceLimits resourceLimits;
    private final DockerSecurityConfig securityConfig;

    private final CodeHarness codeHarness;
    
    public CodeExecutorService(ResourceLimits resourceLimits, DockerSecurityConfig securityConfig, CodeHarness codeHarness) {
        this.resourceLimits = resourceLimits;
        this.securityConfig = securityConfig;
        this.codeHarness = codeHarness;
        
        try {
            DockerClientConfig config = DefaultDockerClientConfig.createDefaultConfigBuilder()
                .withDockerHost("unix:///var/run/docker.sock")
                .withDockerTlsVerify(false)
                .withApiVersion("1.41")
                .build();

            DockerHttpClient httpClient = new ApacheDockerHttpClient.Builder()
                .dockerHost(config.getDockerHost())
                .sslConfig(null)
                .maxConnections(100)
                .connectionTimeout(Duration.ofSeconds(30))
                .responseTimeout(Duration.ofSeconds(45))
                .build();

            this.dockerClient = DockerClientImpl.getInstance(config, httpClient);
            
            // Test connection by pinging Docker daemon
            dockerClient.pingCmd().exec();
            logger.info("CodeExecutorService initialized - Docker daemon is reachable at: {}", config.getDockerHost());
            
            // List available images for debugging
            dockerClient.listImagesCmd().exec().forEach(image -> 
                logger.debug("Available image: {}", Arrays.toString(image.getRepoTags()))
            );
        } catch (Exception e) {
            logger.error("Failed to initialize Docker client: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to initialize Docker client: " + e.getMessage(), e);
        }
    }
    
    /**
     * Execute code in a Docker container with resource limits.
     *
     * @param request the execution request
     * @return execution result with output and metrics
     */
    public ExecutionResult runInContainer(ExecutionRequest request) {
        String containerId = null;
        long startTime = System.currentTimeMillis();
        
        try {
            // Validate request
            validateRequest(request);

            logger.info("Request validated!");
            
            // Get image name based on language
            String imageName = getImageName(request.getLanguage());

            logger.info("Image selected!");
            
            // Create container with security and resource limits
            containerId = createContainer(imageName, request);

            logger.info("Container created!");
            
            // Start container
            dockerClient.startContainerCmd(containerId).exec();
            logger.info("Started container: {}", containerId);
            
            // Write code and input to container
            writeCodeToContainer(containerId, request);
            
            // Execute code with timeout
            ExecutionResult result = executeCodeInContainer(containerId, request, startTime);
            
            return result;
            
        } catch (TimeoutException e) {
            logger.warn("Execution timeout for container: {}", containerId);
            long runtime = System.currentTimeMillis() - startTime;
            return new ExecutionResult(
                ExecutionStatus.TLE,
                "",
                "Time limit exceeded",
                new ResourceMetrics(runtime, 0L)
            );
        } catch (Exception e) {
            logger.error("Error executing code in container: {}", containerId, e);
            long runtime = System.currentTimeMillis() - startTime;
            return new ExecutionResult(
                ExecutionStatus.RUNTIME_ERROR,
                "",
                "Execution error: " + e.getMessage(),
                new ResourceMetrics(runtime, 0L)
            );
        } finally {
            // Cleanup container
            if (containerId != null) {
                cleanupContainer(containerId);
            }
        }
    }
    
    /**
     * Create a Docker container with security and resource limits.
     */
    private String createContainer(String imageName, ExecutionRequest request) {
        logger.info("Creating container with image: {}", imageName);
        
        // First, check if image exists
        try {
            dockerClient.inspectImageCmd(imageName).exec();
            logger.info("Image {} found", imageName);
        } catch (Exception e) {
            logger.error("Image {} not found: {}", imageName, e.getMessage());
            throw new ExecutionException("Image not found: " + imageName + ". Please build the runtime images first.", "container_creation");
        }
        
        // Create secure host config using security configuration
        HostConfig hostConfig = securityConfig.createSecureHostConfig(request.getMemoryLimitMb());
        logger.info("Secure hostconfig created with memory limit: {}MB", request.getMemoryLimitMb());
        
        // Validate security settings
        if (!securityConfig.validateSecuritySettings(hostConfig)) {
            throw new ExecutionException("Invalid security configuration for container", "container_creation");
        }
        logger.info("Security settings validated");
        
        try {
            // Create container
            CreateContainerResponse container = dockerClient.createContainerCmd(imageName)
                .withHostConfig(hostConfig)
                .withAttachStdout(true)
                .withAttachStderr(true)
                .withTty(false)
                .withCmd("sleep", String.valueOf(securityConfig.getMaxContainerLifetime()))
                .exec();
            
            logger.info("Created secure container: {} with image: {}", container.getId(), imageName);
            return container.getId();
        } catch (Exception e) {
            logger.error("Failed to create container with image {}: {}", imageName, e.getMessage(), e);
            throw new ExecutionException("Failed to create container: " + e.getMessage(), "container_creation");
        }
    }
    
    /**
     * Write code and input files to container.
     */
    private void writeCodeToContainer(String containerId, ExecutionRequest request) throws IOException {
        String language = request.getLanguage().toLowerCase();
        String fileName;
        StringBuilder code = new StringBuilder();

        String harness = codeHarness.generate(request);
        logger.info(harness);
        code.append(harness); // Harness
        code.append(request.getCode()); // Code

        
        // Determine file name based on language, (Reeks)
        switch (language) {
            case "java":
                // Extract class name from code
                fileName = extractJavaClassName(code.toString());
                break;
            case "python":
                fileName = "solution.py";
                break;
            case "javascript":
                fileName = "solution.js";
                break;
            default:
                throw new IllegalArgumentException("Unsupported language: " + language);
        }
        
        // Create temp directory for code
        Path tempDir = Files.createTempDirectory("code-exec-");
        File codeFile = new File(tempDir.toFile(), fileName);
        
        try (FileWriter writer = new FileWriter(codeFile)) {
            writer.write(code.toString());
        }
        
        // Copy code file to container
        dockerClient.copyArchiveToContainerCmd(containerId)
            .withHostResource(codeFile.getAbsolutePath())
            .withRemotePath("/tmp/code/")
            .exec();
        
        // Write input file if provided
        if (request.getInput() != null) {
            // Let empty pass. We handle it in scanner
            File inputFile = new File(tempDir.toFile(), "input.txt");
            try (FileWriter writer = new FileWriter(inputFile)) {
                writer.write(request.getInput());
            }
            
            dockerClient.copyArchiveToContainerCmd(containerId)
                .withHostResource(inputFile.getAbsolutePath())
                .withRemotePath("/tmp/code/")
                .exec();
        }
        
        // Cleanup temp directory
        Files.walk(tempDir)
            .map(Path::toFile)
            .forEach(File::delete);
        Files.deleteIfExists(tempDir);
        
        logger.debug("Wrote code file {} to container: {}", fileName, containerId);
    }
    
    /**
     * Execute code in container and capture output.
     */
    private ExecutionResult executeCodeInContainer(String containerId, ExecutionRequest request, long startTime) 
            throws InterruptedException, ExecutionException, TimeoutException {
        
        String language = request.getLanguage().toLowerCase();
        String[] command = buildExecutionCommand(language, request.getCode());
        
        // Create exec instance
        ExecCreateCmdResponse execCreateCmdResponse = dockerClient.execCreateCmd(containerId)
            .withCmd(command)
            .withAttachStdout(true)
            .withAttachStderr(true)
            .withWorkingDir("/tmp/code")
            .exec();
        
        // Execute with timeout
        ByteArrayOutputStream stdout = new ByteArrayOutputStream();
        ByteArrayOutputStream stderr = new ByteArrayOutputStream();
        
        ExecStartResultCallback callback = new ExecStartResultCallback(stdout, stderr);
        
        dockerClient.execStartCmd(execCreateCmdResponse.getId())
            .exec(callback);
        
        // Wait for execution with timeout
        int timeoutSeconds = (request.getTimeLimitMs() / 1000) + 5;  // Add 5 seconds buffer
        boolean completed = callback.awaitCompletion(timeoutSeconds, TimeUnit.SECONDS);
        
        long runtime = System.currentTimeMillis() - startTime;
        
        if (!completed) {
            throw new TimeoutException("Execution timed out");
        }
        
        // Get exit code
        Integer exitCode = dockerClient.inspectExecCmd(execCreateCmdResponse.getId())
            .exec()
            .getExitCodeLong()
            .intValue();
        
        // Collect metrics
        ResourceMetrics metrics = collectMetrics(containerId, runtime);
        
        // Check if execution exceeded time limit
        if (metrics.getRuntimeMs() > request.getTimeLimitMs()) {
            return new ExecutionResult(
                ExecutionStatus.TLE,
                stdout.toString(),
                "Time limit exceeded",
                metrics
            );
        }
        
        // Check if execution exceeded memory limit
        long memoryLimitKb = request.getMemoryLimitMb() * 1024L;
        if (metrics.getMemoryKb() > memoryLimitKb) {
            return new ExecutionResult(
                ExecutionStatus.MLE,
                stdout.toString(),
                "Memory limit exceeded",
                metrics
            );
        }
        
        // Determine status based on exit code
        ExecutionStatus status;
        String errorMessage = null;
        String stderrOutput = stderr.toString();
        
        if (exitCode == 0) {
            status = ExecutionStatus.SUCCESS;
        } else {
            // Check if it's a compilation error or runtime error
            if (isCompilationError(language, stderrOutput)) {
                status = ExecutionStatus.COMPILATION_ERROR;
                errorMessage = stderrOutput;
            } else {
                status = ExecutionStatus.RUNTIME_ERROR;
                errorMessage = stderrOutput;
            }
        }
        
        return new ExecutionResult(
            status,
            stdout.toString(),
            errorMessage,
            metrics
        );
    }
    
    /**
     * Build execution command based on language.
     */
    private String[] buildExecutionCommand(String language, String code) {
        switch (language.toLowerCase()) {
            case "java":
                String className = extractJavaClassName(code);
                return new String[]{"sh", "-c", 
                    "javac " + className + " && java " + className.replace(".java", "") + " < input.txt"};
            case "python":
                return new String[]{"sh", "-c", "python3 solution.py < input.txt"};
            case "javascript":
                return new String[]{"sh", "-c", "node solution.js < input.txt"};
            default:
                throw new IllegalArgumentException("Unsupported language: " + language);
        }
    }
    
    /**
     * Extract Java class name from code.
     */
    private String extractJavaClassName(String code) {
        // Simple regex to extract public class name
        String[] lines = code.split("\n");
        for (String line : lines) {
            if (line.trim().startsWith("public class ")) {
                String className = line.trim()
                    .replace("public class ", "")
                    .split("\\s+")[0]
                    .replace("{", "")
                    .trim();
                return className + ".java";
            }
        }
        return "Solution.java";  // Default
    }
    
    /**
     * Check if error is a compilation error.
     */
    private boolean isCompilationError(String language, String stderr) {
        if (stderr == null || stderr.isEmpty()) {
            return false;
        }
        
        switch (language.toLowerCase()) {
            case "java":
                return stderr.contains("error:") && !stderr.contains("Exception");
            case "python":
                return stderr.contains("SyntaxError") || stderr.contains("IndentationError");
            case "javascript":
                return stderr.contains("SyntaxError") && !stderr.contains("ReferenceError");
            default:
                return false;
        }
    }
    
    /**
     * Collect resource metrics from container.
     */
    private ResourceMetrics collectMetrics(String containerId, long runtimeMs) {
        try {
            // Get memory usage from container inspection
            Long memoryUsage = 0L;
            
            // Try to get memory stats using a callback
            try {
                InspectContainerResponse containerInfo = dockerClient.inspectContainerCmd(containerId).exec();
                
                // Use a simple approach - get stats with callback
                final Long[] memoryHolder = {0L};
                CountDownLatch latch = new CountDownLatch(1);
                
                dockerClient.statsCmd(containerId)
                    .withNoStream(true)
                    .exec(new com.github.dockerjava.api.async.ResultCallback.Adapter<Statistics>() {
                        @Override
                        public void onNext(Statistics stats) {
                            if (stats != null && stats.getMemoryStats() != null) {
                                Long usage = stats.getMemoryStats().getUsage();
                                if (usage != null) {
                                    memoryHolder[0] = usage / 1024;  // Convert to KB
                                }
                            }
                            latch.countDown();
                        }
                        
                        @Override
                        public void onError(Throwable throwable) {
                            latch.countDown();
                        }
                    });
                
                // Wait for stats with timeout
                latch.await(2, TimeUnit.SECONDS);
                memoryUsage = memoryHolder[0];
                
            } catch (Exception e) {
                logger.warn("Could not collect memory stats for container: {}", containerId);
            }
            
            return new ResourceMetrics(runtimeMs, memoryUsage);
            
        } catch (Exception e) {
            logger.warn("Error collecting metrics for container: {}", containerId, e);
            return new ResourceMetrics(runtimeMs, 0L);
        }
    }
    
    /**
     * Cleanup container after execution.
     */
    public void cleanupContainer(String containerId) {
        try {
            // Stop container
            dockerClient.stopContainerCmd(containerId)
                .withTimeout(5)
                .exec();
            
            // Remove container
            dockerClient.removeContainerCmd(containerId)
                .withForce(true)
                .exec();
            
            logger.info("Cleaned up container: {}", containerId);
        } catch (Exception e) {
            logger.error("Error cleaning up container: {}", containerId, e);
        }
    }
    
    /**
     * Get Docker image name for language.
     */
    private String getImageName(String language) {
        switch (language.toLowerCase()) {
            case "java":
                return "localcode-java:latest";
            case "python":
                return "localcode-python:latest";
            case "javascript":
                return "localcode-javascript:latest";
            default:
                throw new IllegalArgumentException("Unsupported language: " + language);
        }
    }
    
    /**
     * Validate execution request.
     */
    private void validateRequest(ExecutionRequest request) {
        if (request.getCode() == null || request.getCode().isEmpty()) {
            throw new IllegalArgumentException("Code cannot be empty");
        }
        
        if (request.getLanguage() == null || request.getLanguage().isEmpty()) {
            throw new IllegalArgumentException("Language cannot be empty");
        }
        
        // Validate code size
        int codeSizeKb = request.getCode().getBytes().length / 1024;
        if (codeSizeKb > resourceLimits.getMaxCodeSizeKb()) {
            throw new IllegalArgumentException("Code size exceeds maximum limit of " + 
                resourceLimits.getMaxCodeSizeKb() + " KB");
        }
        
        // Validate input size
        if (request.getInput() != null) {
            int inputSizeKb = request.getInput().getBytes().length / 1024;
            if (inputSizeKb > resourceLimits.getMaxTestCaseSizeKb()) {
                throw new IllegalArgumentException("Input size exceeds maximum limit of " + 
                    resourceLimits.getMaxTestCaseSizeKb() + " KB");
            }
        }
        
        // Set default limits if not provided
        if (request.getTimeLimitMs() == null) {
            request.setTimeLimitMs(resourceLimits.getDefaultTimeLimitMs());
        }
        
        if (request.getMemoryLimitMb() == null) {
            request.setMemoryLimitMb(resourceLimits.getDefaultMemoryLimitMb());
        }
    }
}
