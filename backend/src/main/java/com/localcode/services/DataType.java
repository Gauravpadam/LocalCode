package com.localcode.services;


public enum DataType{
    // not a datatype (reeks)
    VOID,

     // primitives
    INT,
    LONG,
    DOUBLE,
    FLOAT,
    BOOLEAN,
    CHAR,

    // simple objects
    STRING,

    // arrays
    ARRAY_INT,
    ARRAY_LONG,
    ARRAY_DOUBLE,
    ARRAY_STRING,
    ARRAY_CHAR,

    // collections
    LIST_INT,
    LIST_LONG,
    LIST_DOUBLE,
    LIST_STRING,

    // 2D arrays (primitive)
    ARRAY_2D_INT,
    ARRAY_2D_LONG,
    ARRAY_2D_STRING,
    ARRAY_2D_CHAR,

    // matrix / 2D (List<List<...>>)
    MATRIX_INT,
    MATRIX_LONG,
    MATRIX_STRING,

    // custom structures
    TREE_NODE,
    LIST_NODE,
    NODE,

    // fallback
    UNKNOWN
}