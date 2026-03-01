package com.localcode.services;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.stereotype.Component;

@Component
public class JSTailCodeGenerationUtils implements TailCodeGenerationUtils {

    @Override
    public DataType dataTypeResolver(String dataType) {
        return switch (dataType) {
            case "number" -> DataType.INT;
            case "bigint" -> DataType.LONG;
            case "string" -> DataType.STRING;
            case "boolean" -> DataType.BOOLEAN;
            case "number[]" -> DataType.ARRAY_INT;
            case "string[]" -> DataType.ARRAY_STRING;
            case "Array<number>" -> DataType.LIST_INT;
            case "Array<string>" -> DataType.LIST_STRING;
            case "number[][]" -> DataType.MATRIX_INT;
            case "string[][]" -> DataType.MATRIX_STRING;
            default -> throw new IllegalArgumentException("Unknown JS type: " + dataType);
        };
    }

    @Override
    public ReturnType returnTypeResolver(String returnType) {
        return switch (returnType) {
            case "void" -> ReturnType.VOID;
            case "number" -> ReturnType.INT;
            case "bigint" -> ReturnType.LONG;
            case "string" -> ReturnType.STRING;
            case "boolean" -> ReturnType.BOOLEAN;
            case "number[]" -> ReturnType.ARRAY_INT;
            case "string[]" -> ReturnType.ARRAY_STRING;
            case "number[][]" -> ReturnType.MATRIX_INT;
            case "string[][]" -> ReturnType.MATRIX_STRING;
            default -> ReturnType.UNKNOWN;
        };
    }

    @Override
    public String commonImports() {
        return ""; // JS uses plain code, no imports needed
    }

    @Override
    public MethodSignature parseStarterCode(String starterCode) {
        Pattern pattern = Pattern.compile(
            "function\\s+" +
            "([a-zA-Z_]\\w*)\\s*" +   // function name
            "\\(([^)]*)\\)"           // params
        );

        Matcher matcher = pattern.matcher(starterCode);

        if (!matcher.find()) {
            throw new IllegalArgumentException("No function signature found");
        }

        String methodName = matcher.group(1);
        String paramsStr = matcher.group(2).trim();
        String returnType = "void"; // JS doesn't have explicit return types

        List<Param> params = new ArrayList<>();

        if (!paramsStr.isEmpty()) {
            String[] paramParts = paramsStr.split(",");
            for (String param : paramParts) {
                extractParam(param.trim(), params);
            }
        }

        return new MethodSignature(returnType, methodName, params);
    }

    private void extractParam(String raw, List<Param> params) {
        String param = raw.trim();
        // JS params are typically just names, or name: type
        if (param.contains(":")) {
            String[] parts = param.split(":");
            String name = parts[0].trim();
            String type = parts.length > 1 ? parts[1].trim() : "any";
            params.add(new Param(type, name));
        } else {
            params.add(new Param("any", param));
        }
    }
}
