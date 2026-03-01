package com.localcode.services;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.stereotype.Component;

@Component
public class PythonTailCodeGenerationUtils implements TailCodeGenerationUtils {

    @Override
    public DataType dataTypeResolver(String dataType) {
        return switch (dataType) {
            case "int" -> DataType.INT;
            case "float" -> DataType.DOUBLE;
            case "str" -> DataType.STRING;
            case "bool" -> DataType.BOOLEAN;
            case "List[int]", "list[int]" -> DataType.LIST_INT;
            case "List[float]", "list[float]" -> DataType.LIST_DOUBLE;
            case "List[str]", "list[str]" -> DataType.LIST_STRING;
            case "List[List[int]]", "list[list[int]]" -> DataType.MATRIX_INT;
            case "List[List[str]]", "list[list[str]]" -> DataType.MATRIX_STRING;
            default -> throw new IllegalArgumentException("Unknown Python type: " + dataType);
        };
    }

    @Override
    public ReturnType returnTypeResolver(String returnType) {
        return switch (returnType) {
            case "None" -> ReturnType.VOID;
            case "int" -> ReturnType.INT;
            case "float" -> ReturnType.DOUBLE;
            case "str" -> ReturnType.STRING;
            case "bool" -> ReturnType.BOOLEAN;
            case "List[int]", "list[int]" -> ReturnType.LIST_INT;
            case "List[float]", "list[float]" -> ReturnType.LIST_DOUBLE;
            case "List[str]", "list[str]" -> ReturnType.LIST_STRING;
            case "List[List[int]]", "list[list[int]]" -> ReturnType.MATRIX_INT;
            case "List[List[str]]", "list[list[str]]" -> ReturnType.MATRIX_STRING;
            default -> ReturnType.UNKNOWN;
        };
    }

    @Override
    public String commonImports() {
        return "from typing import List\n";
    }

    @Override
    public MethodSignature parseStarterCode(String starterCode) {
        Pattern pattern = Pattern.compile(
            "def\\s+" +
            "([a-zA-Z_]\\w*)\\s*" +                       // function name
            "\\(([^)]*)\\)" +                              // params
            "(?:\\s*->\\s*([\\w\\[\\],\\s]+))?"            // optional return type
        );

        Matcher matcher = pattern.matcher(starterCode);

        if (!matcher.find()) {
            throw new IllegalArgumentException("No function signature found");
        }

        String methodName = matcher.group(1);
        String paramsStr = matcher.group(2).trim();
        String returnType = matcher.group(3) != null ? matcher.group(3).trim() : "None";

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
        // Python params: name or name: type
        if (param.contains(":")) {
            String[] parts = param.split(":", 2);
            String name = parts[0].trim();
            String type = parts[1].trim();
            params.add(new Param(type, name));
        } else {
            params.add(new Param("Any", param));
        }
    }
}
