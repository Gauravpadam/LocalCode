package com.localcode.services.Emitters.ParamParsers;



interface ProvidesMatrixHelper {
    String provideHelper();
}

class Primitive2DIntHelper implements ProvidesMatrixHelper {
    @Override
    public String provideHelper() {
        return """
                private static int[][] parseIntArray2D(String input) {
                    String tmp = input.trim().substring(1, input.trim().length() - 1);
                    List<int[]> rows = new ArrayList<>();
                    if (!tmp.isEmpty()) {
                        String[] parts = tmp.split("\\\\],\\\\s*\\\\[");
                        for (String r : parts) {
                            r = r.replaceAll("^\\\\[|\\\\]$", "");
                            rows.add(Arrays.stream(r.split(","))
                                .map(String::trim)
                                .filter(s -> !s.isEmpty())
                                .mapToInt(Integer::parseInt)
                                .toArray());
                        }
                    }
                    return rows.toArray(new int[0][]);
                }
            """;
    }
}

class Primitive2DLongHelper implements ProvidesMatrixHelper {
    @Override
    public String provideHelper() {
        return """
                private static long[][] parseLongArray2D(String input) {
                    String tmp = input.trim().substring(1, input.trim().length() - 1);
                    List<long[]> rows = new ArrayList<>();
                    if (!tmp.isEmpty()) {
                        String[] parts = tmp.split("\\\\],\\\\s*\\\\[");
                        for (String r : parts) {
                            r = r.replaceAll("^\\\\[|\\\\]$", "");
                            rows.add(Arrays.stream(r.split(","))
                                .map(String::trim)
                                .filter(s -> !s.isEmpty())
                                .mapToLong(Long::parseLong)
                                .toArray());
                        }
                    }
                    return rows.toArray(new long[0][]);
                }
            """;
    }
}

class Primitive2DStringHelper implements ProvidesMatrixHelper {
    @Override
    public String provideHelper() {
        return """
                private static String[][] parseStringArray2D(String input) {
                    String tmp = input.trim().substring(1, input.trim().length() - 1);
                    List<String[]> rows = new ArrayList<>();
                    if (!tmp.isEmpty()) {
                        String[] parts = tmp.split("\\\\],\\\\s*\\\\[");
                        for (String r : parts) {
                            r = r.replaceAll("^\\\\[|\\\\]$", "");
                            rows.add(Arrays.stream(r.split(","))
                                .map(String::trim)
                                .map(s -> s.replaceAll("^\\\"|\\\"$", ""))
                                .toArray(String[]::new));
                        }
                    }
                    return rows.toArray(new String[0][]);
                }
            """;
    }
}

class MatrixIntHelper implements ProvidesMatrixHelper {
    @Override
    public String provideHelper() {
        return """
                private static List<List<Integer>> parseIntMatrix(String input) {
                    String tmp = input.trim().substring(1, input.trim().length() - 1);
                    List<List<Integer>> result = new ArrayList<>();
                    if (!tmp.isEmpty()) {
                        String[] parts = tmp.split("\\\\],\\\\s*\\\\[");
                        for (String r : parts) {
                            r = r.replaceAll("^\\\\[|\\\\]$", "");
                            List<Integer> row = new ArrayList<>();
                            for (String v : r.split(",")) {
                                if (!v.trim().isEmpty()) row.add(Integer.parseInt(v.trim()));
                            }
                            result.add(row);
                        }
                    }
                    return result;
                }
            """;
    }
}

class MatrixLongHelper implements ProvidesMatrixHelper {
    @Override
    public String provideHelper() {
        return """
                private static List<List<Long>> parseLongMatrix(String input) {
                    String tmp = input.trim().substring(1, input.trim().length() - 1);
                    List<List<Long>> result = new ArrayList<>();
                    if (!tmp.isEmpty()) {
                        String[] parts = tmp.split("\\\\],\\\\s*\\\\[");
                        for (String r : parts) {
                            r = r.replaceAll("^\\\\[|\\\\]$", "");
                            List<Long> row = new ArrayList<>();
                            for (String v : r.split(",")) {
                                if (!v.trim().isEmpty()) row.add(Long.parseLong(v.trim()));
                            }
                            result.add(row);
                        }
                    }
                    return result;
                }
            """;
    }
}

class MatrixStringHelper implements ProvidesMatrixHelper {
    @Override
    public String provideHelper() {
        return """
                private static List<List<String>> parseStringMatrix(String input) {
                    String tmp = input.trim().substring(1, input.trim().length() - 1);
                    List<List<String>> result = new ArrayList<>();
                    if (!tmp.isEmpty()) {
                        String[] parts = tmp.split("\\\\],\\\\s*\\\\[");
                        for (String r : parts) {
                            r = r.replaceAll("^\\\\[|\\\\]$", "");
                            List<String> row = new ArrayList<>();
                            for (String v : r.split(",")) {
                                row.add(v.trim().replaceAll("^\\\"|\\\"$", ""));
                            }
                            result.add(row);
                        }
                    }
                    return result;
                }
            """;
    }
}

class TreeNodeHelper implements ProvidesMatrixHelper {
    @Override
    public String provideHelper() {
        return """
                private static TreeNode parseTreeNode(String input) {
                    String trimmed = input == null ? "" : input.trim();
                    if (trimmed.length() < 2 || "[]".equals(trimmed)) return null;

                    String content = trimmed.substring(1, trimmed.length() - 1).trim();
                    if (content.isEmpty()) return null;

                    String[] parts = content.split(",");
                    String rootToken = parts[0].trim();
                    if (rootToken.equalsIgnoreCase("null") || rootToken.isEmpty()) return null;

                    TreeNode root = new TreeNode(Integer.parseInt(rootToken));
                    Queue<TreeNode> queue = new ArrayDeque<>();
                    queue.offer(root);

                    int idx = 1;
                    while (!queue.isEmpty() && idx < parts.length) {
                        TreeNode current = queue.poll();

                        if (idx < parts.length) {
                            String left = parts[idx++].trim();
                            if (!left.equalsIgnoreCase("null") && !left.isEmpty()) {
                                current.left = new TreeNode(Integer.parseInt(left));
                                queue.offer(current.left);
                            }
                        }

                        if (idx < parts.length) {
                            String right = parts[idx++].trim();
                            if (!right.equalsIgnoreCase("null") && !right.isEmpty()) {
                                current.right = new TreeNode(Integer.parseInt(right));
                                queue.offer(current.right);
                            }
                        }
                    }

                    return root;
                }
            """;
    }
}

class ListNodeHelper implements ProvidesMatrixHelper {
    @Override
    public String provideHelper() {
        return """
                private static ListNode parseListNode(String input) {
                    String trimmed = input == null ? "" : input.trim();
                    if (trimmed.length() < 2 || "[]".equals(trimmed)) return null;

                    String content = trimmed.substring(1, trimmed.length() - 1).trim();
                    if (content.isEmpty()) return null;

                    String[] parts = content.split(",");
                    ListNode dummy = new ListNode(0);
                    ListNode tail = dummy;

                    for (String part : parts) {
                        String token = part.trim();
                        if (token.isEmpty() || token.equalsIgnoreCase("null")) continue;
                        tail.next = new ListNode(Integer.parseInt(token));
                        tail = tail.next;
                    }

                    return dummy.next;
                }
            """;
    }
}

class NodeHelper implements ProvidesMatrixHelper {
    @Override
    public String provideHelper() {
        return """
                private static Node parseNode(String input) {
                    String trimmed = input == null ? "" : input.trim();
                    if (trimmed.length() < 2 || "[]".equals(trimmed)) return null;

                    String content = trimmed.substring(1, trimmed.length() - 1).trim();
                    if (content.isEmpty()) return null;

                    String[] parts = content.split(",");
                    List<Integer> vals = new ArrayList<>();
                    for (String p : parts) {
                        String token = p.trim();
                        if (token.equalsIgnoreCase("null") || token.isEmpty()) {
                            vals.add(null);
                        } else {
                            vals.add(Integer.parseInt(token));
                        }
                    }

                    if (vals.isEmpty() || vals.get(0) == null) return null;

                    Node root = new Node(vals.get(0));
                    root.children = new ArrayList<>();
                    Queue<Node> queue = new ArrayDeque<>();
                    queue.offer(root);

                    int idx = 2;
                    while (!queue.isEmpty() && idx <= vals.size()) {
                        Node parent = queue.poll();
                        while (idx <= vals.size()) {
                            Integer value = vals.get(idx - 1);
                            idx++;
                            if (value == null) break;

                            Node child = new Node(value);
                            child.children = new ArrayList<>();
                            parent.children.add(child);
                            queue.offer(child);
                        }
                    }

                    return root;
                }
            """;
    }
}

class DoesNotNeedMatrixParsing implements ProvidesMatrixHelper{
    @Override
    public String provideHelper() {
        return "";
    }
}