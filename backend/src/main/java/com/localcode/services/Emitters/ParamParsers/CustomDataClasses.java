package com.localcode.services.Emitters.ParamParsers;

interface ProvidesCustomDataClass{
    String provideCustomDataClass();
}

class TreeNodeProviderClass implements ProvidesCustomDataClass {
    @Override
    public String provideCustomDataClass() {
        return """
                static class TreeNode {
                    int val;
                    TreeNode left;
                    TreeNode right;
                    TreeNode() {}
                    TreeNode(int val) { this.val = val; }
                    TreeNode(int val, TreeNode left, TreeNode right) {
                        this.val = val;
                        this.left = left;
                        this.right = right;
                    }
                }
            """;
    }
}

class ListNodeProviderClass implements ProvidesCustomDataClass {
    @Override
    public String provideCustomDataClass() {
        return """
                static class ListNode {
                    int val;
                    ListNode next;
                    ListNode() {}
                    ListNode(int val) { this.val = val; }
                    ListNode(int val, ListNode next) {
                        this.val = val;
                        this.next = next;
                    }
                }
            """;
    }
}

class NodeProviderClass implements ProvidesCustomDataClass {
    @Override
    public String provideCustomDataClass() {
        return """
                static class Node {
                    public int val;
                    public java.util.List<Node> children;

                    public Node() {}

                    public Node(int _val) {
                        val = _val;
                    }

                    public Node(int _val, java.util.List<Node> _children) {
                        val = _val;
                        children = _children;
                    }
                }
            """;
    }
}

class NeedsNoCustomDataType implements ProvidesCustomDataClass {
    @Override
    public String provideCustomDataClass() {
        return "";
    }
}