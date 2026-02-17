package com.localcode.services.Emitters.ParamParsers;

import com.localcode.services.DataType;

interface InputParser {
   String generateInputParsing(); 
}

interface OutputFormatting {
    String generateOutputFormatting();
}

interface HelperMethodProvider {
    String generateHelperMethod();
}

interface CustomDataClasses{
    String generateCustomDataClasses();
}

class IntParser extends ParamParser {
    public IntParser() {
        super(new DirectDisplayFormatter(), new DoesNotNeedMatrixParsing(), new NeedsNoCustomDataType());
    }

    @Override
    public String generateInputParsing() {
        return "Integer.parseInt(input.trim())";
    }
}

class LongParser extends ParamParser {
    public LongParser() {
        super(new DirectDisplayFormatter(), new DoesNotNeedMatrixParsing(), new NeedsNoCustomDataType());
    }

    @Override
    public String generateInputParsing() {
        return "Long.parseLong(input.trim())";
    }
}

class DoubleParser extends ParamParser {
    public DoubleParser() {
        super(new DirectDisplayFormatter(), new DoesNotNeedMatrixParsing(), new NeedsNoCustomDataType());
    }

    @Override
    public String generateInputParsing() {
        return "Double.parseDouble(input.trim())";
    }
}

class FloatParser extends ParamParser {
    public FloatParser() {
        super(new DirectDisplayFormatter(), new DoesNotNeedMatrixParsing(), new NeedsNoCustomDataType());
    }

    @Override
    public String generateInputParsing() {
        return "Float.parseFloat(input.trim())";
    }
}

class BooleanParser extends ParamParser {
    public BooleanParser() {
        super(new DirectDisplayFormatter(), new DoesNotNeedMatrixParsing(), new NeedsNoCustomDataType());
    }

    @Override
    public String generateInputParsing() {
        return "Boolean.parseBoolean(input.trim())";
    }
}

class CharParser extends ParamParser {
    public CharParser() {
        super(new DirectDisplayFormatter(), new DoesNotNeedMatrixParsing(), new NeedsNoCustomDataType());
    }

    @Override
    public String generateInputParsing() {
        return "input.trim().charAt(0)";
    }
}

class StringParser extends ParamParser {
    public StringParser() {
        super(new DirectDisplayFormatter(), new DoesNotNeedMatrixParsing(), new NeedsNoCustomDataType());
    }

    @Override
    public String generateInputParsing() {
        return "input.trim()";
    }
}

class IntArrayParser extends ParamParser {
    public IntArrayParser() {
        super(new Primitive1DNumLikeArrayFormatter(), new DoesNotNeedMatrixParsing(), new NeedsNoCustomDataType());
    }

    @Override
    public String generateInputParsing() {
        return "Arrays.stream(input.trim().substring(1, input.length()-1).split(\",\"))"
                + ".map(String::trim).filter(stringz->!stringz.isEmpty()).mapToInt(Integer::parseInt).toArray()";
    }
}

class LongArrayParser extends ParamParser {
    public LongArrayParser() {
        super(new Primitive1DNumLikeArrayFormatter(), new DoesNotNeedMatrixParsing(), new NeedsNoCustomDataType());
    }

    @Override
    public String generateInputParsing() {
        return "Arrays.stream(input.trim().substring(1, input.length()-1).split(\",\"))"
                + ".map(String::trim).filter(stringz->!stringz.isEmpty()).mapToLong(Long::parseLong).toArray()";
    }
}

class DoubleArrayParser extends ParamParser {
    public DoubleArrayParser() {
        super(new Primitive1DNumLikeArrayFormatter(), new DoesNotNeedMatrixParsing(), new NeedsNoCustomDataType());
    }

    @Override
    public String generateInputParsing() {
        return "Arrays.stream(input.trim().substring(1, input.length()-1).split(\",\"))"
                + ".map(String::trim).filter(stringz->!stringz.isEmpty()).mapToDouble(Double::parseDouble).toArray()";
    }
}

class StringArrayParser extends ParamParser {
    public StringArrayParser() {
        super(new Primitive1DStringArrayFormatter(), new DoesNotNeedMatrixParsing(), new NeedsNoCustomDataType());
    }

    @Override
    public String generateInputParsing() {
        return "Arrays.stream(input.trim().substring(1, input.length()-1).split(\",\"))"
                + ".map(String::trim).map(stringz->stringz.replaceAll(\"^\\\\\"|\\\\\"$\", \"\")).toArray(String[]::new)";
    }
}

class CharArrayParser extends ParamParser {
    public CharArrayParser() {
        super(new Primitive1DCharArrayFormatter(), new DoesNotNeedMatrixParsing(), new NeedsNoCustomDataType());
    }

    @Override
    public String generateInputParsing() {
        return "Arrays.stream(input.trim().substring(1, input.length()-1).split(\",\"))"
                + ".map(String::trim).map(stringz->stringz.replaceAll(\"^\\\\\"|\\\\\"$\", \"\")).toArray(char[]::new)";
    }
}

class IntListParser extends ParamParser {
    public IntListParser() {
        super(new NumLikeListFormatter(), new DoesNotNeedMatrixParsing(), new NeedsNoCustomDataType());
    }

    @Override
    public String generateInputParsing() {
        return "Arrays.stream(input.trim().substring(1, input.length()-1).split(\",\"))"
                + ".map(String::trim).filter(s->!s.isEmpty()).map(Integer::parseInt).collect(Collectors.toList())";
    }
}

class LongListParser extends ParamParser {
    public LongListParser() {
        super(new NumLikeListFormatter(), new DoesNotNeedMatrixParsing(), new NeedsNoCustomDataType());
    }

    @Override
    public String generateInputParsing() {
        return "Arrays.stream(input.trim().substring(1, input.length()-1).split(\",\"))"
                + ".map(String::trim).filter(s->!s.isEmpty()).map(Long::parseLong).collect(Collectors.toList())";
    }
}

class DoubleListParser extends ParamParser {
    public DoubleListParser() {
        super(new NumLikeListFormatter(), new DoesNotNeedMatrixParsing(), new NeedsNoCustomDataType());
    }

    @Override
    public String generateInputParsing() {
        return "Arrays.stream(input.trim().substring(1, input.length()-1).split(\",\"))"
                + ".map(String::trim).filter(s->!s.isEmpty()).map(Double::parseDouble).collect(Collectors.toList())";
    }
}

class StringListParser extends ParamParser {
    public StringListParser() {
        super(new StringListFormatter(), new DoesNotNeedMatrixParsing(), new NeedsNoCustomDataType());
    }

    @Override
    public String generateInputParsing() {
        return "Arrays.stream(input.trim().substring(1, input.length()-1).split(\",\"))"
                + ".map(String::trim).map(s->s.replaceAll(\"^\\\\\"|\\\\\"$\", \"\")).collect(Collectors.toList())";
    }
}

class Int2DArrayParser extends ParamParser {
    public Int2DArrayParser() {
        super(new Primitive2DNumLikeArrayFormatter(), new Primitive2DIntHelper(), new NeedsNoCustomDataType());
    }

    @Override
    public String generateInputParsing() {
        return "parseIntArray2D(input)";
    }
}

class Long2DArrayParser extends ParamParser {
    public Long2DArrayParser() {
        super(new Primitive2DNumLikeArrayFormatter(), new Primitive2DLongHelper(), new NeedsNoCustomDataType());
    }

    @Override
    public String generateInputParsing() {
        return "parseLongArray2D(input)";
    }
}

class String2DArrayParser extends ParamParser {
    public String2DArrayParser() {
        super(new Primitive2DStringArrayFormatter(), new Primitive2DStringHelper(), new NeedsNoCustomDataType());
    }

    @Override
    public String generateInputParsing() {
        return "parseStringArray2D(input)";
    }
}

class IntMatrixParser extends ParamParser {
    public IntMatrixParser() {
        super(new MatrixFormatter(), new MatrixIntHelper(), new NeedsNoCustomDataType());
    }

    @Override
    public String generateInputParsing() {
        return "parseIntMatrix(input)";
    }
}

class LongMatrixParser extends ParamParser {
    public LongMatrixParser() {
        super(new MatrixFormatter(), new MatrixLongHelper(), new NeedsNoCustomDataType());
    }

    @Override
    public String generateInputParsing() {
        return "parseLongMatrix(input)";
    }
}

class StringMatrixParser extends ParamParser {
    public StringMatrixParser() {
        super(new MatrixFormatter(), new MatrixStringHelper(), new NeedsNoCustomDataType());
    }

    @Override
    public String generateInputParsing() {
        return "parseStringMatrix(input)";
    }
}

class TreeNodeParser extends ParamParser {
    public TreeNodeParser() {
        super(new DirectDisplayFormatter(), new TreeNodeHelper(), new TreeNodeProviderClass());
    }

    @Override
    public String generateInputParsing() {
        return "parseTreeNode(input)";
    }
}

class ListNodeParser extends ParamParser {
    public ListNodeParser() {
        super(new DirectDisplayFormatter(), new ListNodeHelper(), new ListNodeProviderClass());
    }

    @Override
    public String generateInputParsing() {
        return "parseListNode(input)";
    }
}

class NodeParser extends ParamParser {
    public NodeParser() {
        super(new DirectDisplayFormatter(), new NodeHelper(), new NodeProviderClass());
    }

    @Override
    public String generateInputParsing() {
        return "parseNode(input)";
    }
}

public class ParamParsers{
        public static ParamParser getParser(DataType dataType) {
            return switch (dataType) {
                case INT -> new IntParser();
                case LONG -> new LongParser();
                case DOUBLE -> new DoubleParser();
                case FLOAT -> new FloatParser();
                case BOOLEAN -> new BooleanParser();
                case CHAR -> new CharParser();
                case STRING -> new StringParser();
                
                case ARRAY_INT -> new IntArrayParser();
                case ARRAY_LONG -> new LongArrayParser();
                case ARRAY_DOUBLE -> new DoubleArrayParser();
                case ARRAY_STRING -> new StringArrayParser();
                case ARRAY_CHAR -> new CharArrayParser();
                
                case LIST_INT -> new IntListParser();
                case LIST_LONG -> new LongListParser();
                case LIST_DOUBLE -> new DoubleListParser();
                case LIST_STRING -> new StringListParser();

                case ARRAY_2D_INT -> new Int2DArrayParser();
                case ARRAY_2D_LONG -> new Long2DArrayParser();
                case ARRAY_2D_STRING -> new String2DArrayParser();
                
                case MATRIX_INT -> new IntMatrixParser();
                case MATRIX_LONG -> new LongMatrixParser();
                case MATRIX_STRING -> new StringMatrixParser();
                case TREE_NODE -> new TreeNodeParser();
                case LIST_NODE -> new ListNodeParser();
                case NODE -> new NodeParser();
                
    
                default -> throw new IllegalArgumentException("Unsupported data type: " + dataType);
            };
        }
}