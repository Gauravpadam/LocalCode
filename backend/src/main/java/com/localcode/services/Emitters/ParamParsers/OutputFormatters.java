package com.localcode.services.Emitters.ParamParsers;

interface FormatsOutput{
    String provideOutputFormatter();
}


class Primitive1DNumLikeArrayFormatter implements FormatsOutput{
    @Override
    public String provideOutputFormatter() {
        return """
                System.out.println(Arrays.toString(%s).replace(" ", ""));
            """;
    }
}

class Primitive1DCharArrayFormatter implements FormatsOutput{
    @Override
    public String provideOutputFormatter() {
        return """
                System.out.print("[");
                for (int i = 0; i < %s.length; i++) {
                    System.out.print("\\\"" + %s[i] + "\\\"");
                    if (i != %s.length - 1) System.out.print(",");
                }
                System.out.println("]");
            """;
    } 
}

class Primitive1DStringArrayFormatter implements FormatsOutput{
    @Override
    public String provideOutputFormatter() {
        return """
                System.out.print("[");
                for (int i = 0; i < %s.length; i++) {
                    System.out.print("\\\"" + %s[i] + "\\\"");
                    if (i != %s.length - 1) System.out.print(",");
                }
                System.out.println("]");
            """;
    }
}

class Primitive2DNumLikeArrayFormatter implements FormatsOutput{
    @Override
    public String provideOutputFormatter() {
        return """
                System.out.print("[");
                for (int i = 0; i < %s.length; i++) {
                    System.out.print(Arrays.toString(%s[i]).replace(" ", ""));
                    if (i != %s.length - 1) System.out.print(",");
                }
                System.out.println("]");
            """;
    }
}

class Primitive2DStringArrayFormatter implements FormatsOutput{
    @Override
    public String provideOutputFormatter() {
        return  """
                System.out.print("[");
                for (int i = 0; i < %s.length; i++) {
                    System.out.print("[");
                    for (int j = 0; j < %s[i].length; j++) {
                        System.out.print("\\\"" + %s[i][j] + "\\\"");
                        if (j != %s[i].length - 1) System.out.print(",");
                    }
                    System.out.print("]");
                    if (i != %s.length - 1) System.out.print(",");
                }
                System.out.println("]");
            """;
    }
}

class Primitive2DCharArrayFormatter implements FormatsOutput{
    @Override
    public String provideOutputFormatter() {
        return """
                System.out.print("[");
                for (int i = 0; i < %s.length; i++) {
                    System.out.print("[");
                    for (int j = 0; j < %s[i].length; j++) {
                        System.out.print("\\"" + %s[i][j] + "\\"");
                        if (j != %s[i].length - 1) System.out.print(",");
                    }
                    System.out.print("]");
                    if (i != %s.length - 1) System.out.print(",");
                }
                System.out.println("]");
            """;
    }
}

class MatrixFormatter implements FormatsOutput{
    @Override
    public String provideOutputFormatter() {
        return """
                System.out.println(%s.toString().replace(" ", ""));\n
            """;
    }
}

class NumLikeListFormatter implements FormatsOutput{
    @Override
    public String provideOutputFormatter() {
        return """
                System.out.println(%s.toString().replace(" ", ""));\n
            """;
    }
}

class StringListFormatter implements FormatsOutput{
    @Override
    public String provideOutputFormatter() {
        return """
                System.out.print("[");
                for (int i = 0; i < %s.size(); i++) {
                    System.out.print("\\\"" + %s.get(i) + "\\\"");
                    if (i != %s.size() - 1) System.out.print(",");
                }
                System.out.println("]");
            """;
    }
}

class DirectDisplayFormatter implements FormatsOutput{
    @Override
    public String provideOutputFormatter() {
        return "System.out.println(%s);\n";
    }
}