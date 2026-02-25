package com.localcode.services.Emitters;

import org.springframework.stereotype.Component;
import com.localcode.services.DataType;
import com.localcode.services.MethodSignature;
import com.localcode.services.Param;
import com.localcode.services.PythonTailCodeGenerationUtils;

@Component("PythonCodeEmitter")
public class PythonCodeEmitter implements CodeEmitter {

    private final PythonTailCodeGenerationUtils pythonTailCodeGenerationUtils;

    public PythonCodeEmitter(PythonTailCodeGenerationUtils pythonTailCodeGenerationUtils) {
        this.pythonTailCodeGenerationUtils = pythonTailCodeGenerationUtils;
    }

    @Override
    public String generateHeadCode() {
        return pythonTailCodeGenerationUtils.commonImports();
    }

    private String generateInputParsing(DataType dataType) {
        return switch (dataType) {
            case INT -> "int(input_val.strip())";
            case LONG -> "int(input_val.strip())";
            case DOUBLE, FLOAT -> "float(input_val.strip())";
            case BOOLEAN -> "input_val.strip().lower() == 'true'";
            case CHAR -> "input_val.strip()[0]";
            case STRING -> "input_val.strip()";
            
            case ARRAY_INT, LIST_INT -> 
                "list(map(int, [s.strip() for s in input_val.strip()[1:-1].split(',') if s.strip()]))";
            
            case ARRAY_LONG, LIST_LONG -> 
                "list(map(int, [s.strip() for s in input_val.strip()[1:-1].split(',') if s.strip()]))";
            
            case ARRAY_DOUBLE, LIST_DOUBLE -> 
                "list(map(float, [s.strip() for s in input_val.strip()[1:-1].split(',') if s.strip()]))";
            
            case ARRAY_STRING, LIST_STRING -> 
                "[s.strip().strip('\"') for s in input_val.strip()[1:-1].split(',')]";
            
            case MATRIX_INT -> 
                "(lambda: (lambda tmp: [[int(v.strip()) for v in r.strip('[]').split(',') if v.strip()] " +
                "for r in tmp.split('],') if r.strip()])(input_val.strip()[1:-1] if input_val.strip() else ''))()";
            
            case MATRIX_LONG -> 
                "(lambda: (lambda tmp: [[int(v.strip()) for v in r.strip('[]').split(',') if v.strip()] " +
                "for r in tmp.split('],') if r.strip()])(input_val.strip()[1:-1] if input_val.strip() else ''))()";
            
            case MATRIX_STRING -> 
                "(lambda: (lambda tmp: [[v.strip().strip('\"') for v in r.strip('[]').split(',')] " +
                "for r in tmp.split('],') if r.strip()])(input_val.strip()[1:-1] if input_val.strip() else ''))()";
            
            default -> "input_val.strip()";
        };
    }

    private String generateParamParsing(Param param, int index) {
        StringBuilder code = new StringBuilder();
        code.append(String.format("    input_val%d = input()\n", index));
        
        DataType dt = pythonTailCodeGenerationUtils.dataTypeResolver(param.type);
        String parseExpr = generateInputParsing(dt).replace("input_val", "input_val" + index);
        
        code.append(String.format("    %s = %s\n", param.name, parseExpr));
        return code.toString();
    }

    private String generateMethodCall(MethodSignature signature) {
        StringBuilder code = new StringBuilder();
        
        code.append(String.format("    result = %s(", signature.methodName));
        for (int i = 0; i < signature.params.size(); i++) {
            code.append(signature.params.get(i).name);
            if (i < signature.params.size() - 1) code.append(", ");
        }
        code.append(")\n");
        code.append("    print(result)\n");
        
        return code.toString();
    }

    @Override
    public String generateTailCode(String methodToCall) {
        MethodSignature signature = pythonTailCodeGenerationUtils.parseStarterCode(methodToCall);

        StringBuilder out = new StringBuilder();
        out.append("def main():\n");

        // Read and parse each parameter
        for (int i = 0; i < signature.params.size(); i++) {
            out.append(generateParamParsing(signature.params.get(i), i));
        }

        out.append("\n");
        
        // Call method and handle output
        out.append(generateMethodCall(signature));

        out.append("\nif __name__ == '__main__':\n");
        out.append("    main()\n");

        return out.toString();
    }
}
