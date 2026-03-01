package com.localcode.services;

public class Param {
        public final String type;
        public final String name;
    
        public Param(String type, String name) {
            this.type = type;
            this.name = name;
        }

        public String getName(){
            return this.name;
        }
    }