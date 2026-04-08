// dummySolutions.js

export const dummySolutions = [
  {
    id: 1,
    user: "Alice Johnson",
    language: "java",
    code: `public class Solution {
    public int add(int a, int b) {
        return a + b;
    }
}`,
    status: "ACCEPTED",
    runtimeMs: 12,
    memoryKb: 1024,
    submittedAt: "2026-01-25T12:34:56Z",
  },
  {
    id: 2,
    user: "Bob Smith",
    language: "python",
    code: `def add(a, b):
    return a + b`,
    status: "WRONG_ANSWER",
    runtimeMs: 15,
    memoryKb: 2048,
    submittedAt: "2026-01-24T15:20:10Z",
  },
  {
    id: 3,
    user: "Charlie Lee",
    language: "javascript",
    code: `function add(a, b) {
    return a + b;
}`,
    status: "TIME_LIMIT_EXCEEDED",
    runtimeMs: 1000,
    memoryKb: 512,
    submittedAt: "2026-01-23T10:05:00Z",
  },
];
