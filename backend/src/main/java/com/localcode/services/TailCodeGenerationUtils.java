package com.localcode.services;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;
import java.util.regex.Matcher;

public final class TailCodeGenerationUtils {

    private TailCodeGenerationUtils() {
    }

    public static DataType dataTypeMap(String paramType) {
        return switch (paramType) {
            // primitives
            case "int" -> DataType.INT;
            case "long" -> DataType.LONG;
            case "double" -> DataType.DOUBLE;
            case "float" -> DataType.FLOAT;
            case "boolean" -> DataType.BOOLEAN;
            case "char" -> DataType.CHAR;

            // boxed / objects
            case "Integer" -> DataType.INT;
            case "Long" -> DataType.LONG;
            case "Double" -> DataType.DOUBLE;
            case "Float" -> DataType.FLOAT;
            case "Boolean" -> DataType.BOOLEAN;
            case "Character" -> DataType.CHAR;
            case "String" -> DataType.STRING;

            // primitive arrays
            case "int[]" -> DataType.ARRAY_INT;
            case "long[]" -> DataType.ARRAY_LONG;
            case "double[]" -> DataType.ARRAY_DOUBLE;
            case "String[]" -> DataType.ARRAY_STRING;
            case "char[]" -> DataType.ARRAY_CHAR;

            // lists (common variants)
            case "List<Integer>" -> DataType.LIST_INT;
            case "ArrayList<Integer>" -> DataType.LIST_INT;
            case "LinkedList<Integer>" -> DataType.LIST_INT;
            case "List<Long>" -> DataType.LIST_LONG;
            case "ArrayList<Long>" -> DataType.LIST_LONG;
            case "List<Double>" -> DataType.LIST_DOUBLE;
            case "ArrayList<Double>" -> DataType.LIST_DOUBLE;
            case "List<String>" -> DataType.LIST_STRING;
            case "ArrayList<String>" -> DataType.LIST_STRING;

            // 2D primitive arrays
            case "int[][]" -> DataType.ARRAY_2D_INT;
            case "long[][]" -> DataType.ARRAY_2D_LONG;
            case "String[][]" -> DataType.ARRAY_2D_STRING;

            // matrices (List<List<...>>)
            case "List<List<Integer>>" -> DataType.MATRIX_INT;
            case "ArrayList<List<Integer>>" -> DataType.MATRIX_INT;
            case "List<List<Long>>" -> DataType.MATRIX_LONG;
            case "ArrayList<List<Long>>" -> DataType.MATRIX_LONG;
            case "List<List<String>>" -> DataType.MATRIX_STRING;
            case "ArrayList<List<String>>" -> DataType.MATRIX_STRING;

            default -> throw new IllegalArgumentException("Unknown Java type: " + paramType);
        };
    }

    public static String generateImports() {
        return "import java.util.*;\nimport java.util.stream.*;\n";
    }

    

    public static MethodSignature parseStarterCode(String starterCode) {

        Pattern pattern = Pattern.compile(
            "(?:public|protected|private|static|final|\\s)*" +
            "([\\w<>\\[\\]]+)\\s+" +        // return type (captured)
            "([a-zA-Z_]\\w*)\\s*" +         // method name
            "\\(([^)]*)\\)"                 // params
        );
    
        Matcher matcher = pattern.matcher(starterCode);
    
        if (!matcher.find()) {
            throw new IllegalArgumentException("No method signature found");
        }
    
        String returnType = matcher.group(1);
        String methodName = matcher.group(2);
        String paramsStr = matcher.group(3).trim();
    
        List<Param> params = new ArrayList<>();
    
        if (!paramsStr.isEmpty()) {
            int depth = 0;
            int start = 0;
    
            for (int i = 0; i < paramsStr.length(); i++) {
                char c = paramsStr.charAt(i);
    
                if (c == '<') depth++;
                else if (c == '>') depth--;
                else if (c == ',' && depth == 0) {
                    extractParam(paramsStr.substring(start, i), params);
                    start = i + 1;
                }
            }
    
            // last param
            extractParam(paramsStr.substring(start), params);
        }
    
        return new MethodSignature(returnType, methodName, params);
    }

    private static void extractParam(String raw, List<Param> params) {
        String param = raw.trim();
        int lastSpace = param.lastIndexOf(' ');

        if (lastSpace == -1) {
            throw new IllegalArgumentException("Invalid parameter: " + param);
        }

        String type = param.substring(0, lastSpace).trim();
        String name = param.substring(lastSpace + 1).trim();

        params.add(new Param(type, name));
    }
}