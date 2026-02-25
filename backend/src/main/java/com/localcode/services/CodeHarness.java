package com.localcode.services;


import org.springframework.stereotype.Service;

import com.localcode.dto.ExecutionRequest;

import com.localcode.services.Emitters.CodeEmitter;
import com.localcode.services.Emitters.EmitterFactory;

// DI figured out
@Service
public class CodeHarness {

    private final EmitterFactory emitterFactory;

    public CodeHarness(
        EmitterFactory emitterFactory
        
    ) {
        this.emitterFactory = emitterFactory;
    }

    public String generate(ExecutionRequest request){

        CodeEmitter emitter = emitterFactory.getEmitter(request.getLanguage());
        StringBuilder harness = new StringBuilder();

      
        harness.append(emitter.generateTailCode(request.getMethodToCall()));

        return harness.toString();
    }
}