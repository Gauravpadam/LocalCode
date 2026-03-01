package com.localcode.services.Emitters;

public interface CodeEmitter {
    
    String generateHeadCode();
    String generateTailCode(String methodToCall);

}
