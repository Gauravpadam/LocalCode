package com.localcode.services;

public interface TailCodeGenerationUtils {

    DataType dataTypeResolver(String dataType);
    ReturnType returnTypeResolver(String returnType);
    MethodSignature parseStarterCode(String starterCode);
    String commonImports();

}
