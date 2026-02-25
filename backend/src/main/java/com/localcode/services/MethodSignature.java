package com.localcode.services;

import java.util.List;

public class MethodSignature {
        public final String returnType;
        public final String methodName;
        public final List<Param> params;
    
        public MethodSignature(String returnType, String methodName, List<Param> params) {
            this.returnType = returnType;
            this.methodName = methodName;
            this.params = params;
        }
    }
