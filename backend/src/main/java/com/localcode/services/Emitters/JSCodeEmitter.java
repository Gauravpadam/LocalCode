package com.localcode.services.Emitters;
import org.springframework.stereotype.Component;
import com.localcode.services.DataType;
import com.localcode.services.MethodSignature;
import com.localcode.services.Param;
import com.localcode.services.JSTailCodeGenerationUtils;

@Component("JSCodeEmitter")
public class JSCodeEmitter implements CodeEmitter {

    private final JSTailCodeGenerationUtils jsTailCodeGenerationUtils;

    public JSCodeEmitter(JSTailCodeGenerationUtils jsTailCodeGenerationUtils) {
        this.jsTailCodeGenerationUtils = jsTailCodeGenerationUtils;
    }

    @Override
    public String generateHeadCode() {
        return jsTailCodeGenerationUtils.commonImports();
    }

    private String generateInputParsing(DataType dataType) {
        return switch (dataType) {
            case INT -> "parseInt(input.trim())";
            case LONG -> "BigInt(input.trim())";
            case DOUBLE, FLOAT -> "parseFloat(input.trim())";
            case BOOLEAN -> "input.trim() === 'true'";
            case CHAR -> "input.trim().charAt(0)";
            case STRING -> "input.trim()";
            
            case ARRAY_INT, LIST_INT -> 
                "input.trim().slice(1, -1).split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n))";
            
            case ARRAY_LONG, LIST_LONG -> 
                "input.trim().slice(1, -1).split(',').map(s => BigInt(s.trim())).filter(n => n !== undefined)";
            
            case ARRAY_DOUBLE, LIST_DOUBLE -> 
                "input.trim().slice(1, -1).split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n))";
            
            case ARRAY_STRING, LIST_STRING -> 
                "input.trim().slice(1, -1).split(',').map(s => s.trim().replace(/^\"|\"$/g, ''))";
            
            case MATRIX_INT -> 
                "(() => { const tmp = input.trim().slice(1, -1); " +
                "const result = []; " +
                "if (tmp) { const rows = tmp.split(/\\],\\s*\\[/); " +
                "for (let r of rows) { r = r.replace(/^\\[|\\]$/g, ''); " +
                "const row = []; " +
                "for (let v of r.split(',')) if (v.trim()) row.push(parseInt(v.trim())); " +
                "result.push(row); } } return result; })()";
            
            case MATRIX_LONG -> 
                "(() => { const tmp = input.trim().slice(1, -1); " +
                "const result = []; " +
                "if (tmp) { const rows = tmp.split(/\\],\\s*\\[/); " +
                "for (let r of rows) { r = r.replace(/^\\[|\\]$/g, ''); " +
                "const row = []; " +
                "for (let v of r.split(',')) if (v.trim()) row.push(BigInt(v.trim())); " +
                "result.push(row); } } return result; })()";
            
            case MATRIX_STRING -> 
                "(() => { const tmp = input.trim().slice(1, -1); " +
                "const result = []; " +
                "if (tmp) { const rows = tmp.split(/\\],\\s*\\[/); " +
                "for (let r of rows) { r = r.replace(/^\\[|\\]$/g, ''); " +
                "const row = []; " +
                "for (let v of r.split(',')) row.push(v.trim().replace(/^\"|\"$/g, '')); " +
                "result.push(row); } } return result; })()";
            
            default -> "input.trim()";
        };
    }

    private String generateParamParsing(Param param, int index) {
        StringBuilder code = new StringBuilder();
        code.append(String.format("const input%d = readline();\n", index));
        
        DataType dt = jsTailCodeGenerationUtils.dataTypeResolver(param.type);
        String parseExpr = generateInputParsing(dt).replace("input", "input" + index);
        
        code.append(String.format("const %s = %s;\n", param.name, parseExpr));
        return code.toString();
    }

    private String generateMethodCall(MethodSignature signature) {
        StringBuilder code = new StringBuilder();
        
        code.append(String.format("const result = %s(", signature.methodName));
        for (int i = 0; i < signature.params.size(); i++) {
            code.append(signature.params.get(i).name);
            if (i < signature.params.size() - 1) code.append(", ");
        }
        code.append(");\n");
        code.append("console.log(result);\n");
        
        return code.toString();
    }

    @Override
    public String generateTailCode(String methodToCall) {
        MethodSignature signature = jsTailCodeGenerationUtils.parseStarterCode(methodToCall);

        StringBuilder out = new StringBuilder();
        out.append("function main() {\n");

        // Read and parse each parameter
        for (int i = 0; i < signature.params.size(); i++) {
            out.append("    ");
            out.append(generateParamParsing(signature.params.get(i), i));
        }

        out.append("\n    ");
        
        // Call method and handle output
        String methodCall = generateMethodCall(signature);
        for (String line : methodCall.split("\n")) {
            if (!line.isEmpty()) out.append("    ").append(line).append("\n");
        }

        out.append("}\n\n");
        out.append("main();\n");

        return out.toString();
    }
}
