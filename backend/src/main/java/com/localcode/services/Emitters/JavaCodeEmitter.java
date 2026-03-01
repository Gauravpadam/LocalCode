package com.localcode.services.Emitters;
import java.util.List;
import java.util.ArrayList;
import java.util.Set;
import java.util.LinkedHashSet;

import com.localcode.services.MethodSignature;

import org.springframework.stereotype.Component;

import com.localcode.services.Param;
import com.localcode.services.JavaTailCodeGenerationUtils;
import com.localcode.services.Emitters.ParamParsers.ParamParser;
import com.localcode.services.Emitters.ParamParsers.ParamParsers;
import com.localcode.services.DataType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.localcode.services.ReturnType;

// TODO: A bigger refactor would be needed, this could be harness builder and then I could implement some strategies for it.
// TODO: Handle empty inputs. - DONE
// TDOD: Handle cases where custom types are present (TreeNode etc.)

@Component("JavaCodeEmitter")
public class JavaCodeEmitter implements CodeEmitter{


    private final JavaTailCodeGenerationUtils javaTailCodeGenerationUtils;
    private final Logger logger = LoggerFactory.getLogger(JavaCodeEmitter.class);

    public JavaCodeEmitter(JavaTailCodeGenerationUtils javaTailCodeGenerationUtils) {
        this.javaTailCodeGenerationUtils = javaTailCodeGenerationUtils;
    }

    @Override
    public String generateHeadCode(){
        return javaTailCodeGenerationUtils.commonImports();
    }


    private String generateParamParsing(ParamParser paramParser, String paramType, String paramName, int index) {
            StringBuilder code = new StringBuilder();
            code.append(String.format("        String input%d = scanner.hasNextLine() ? scanner.nextLine() : \"\";\n", index));
            
            String parseExpr = paramParser.generateInputParsing().replace("input", "input" + index);
            
            code.append(String.format("        %s %s = %s;\n", paramType, paramName, parseExpr));
            return code.toString();
        }
    
    
    private String generateMethodCall(String returnType, String methodName, List<Param> params) {
            StringBuilder code = new StringBuilder();

            logger.info(String.format("The return type received in generateMethodCall is: %s", returnType));

            
            // void vs normal returntype
            if (!"void".equals(returnType)) {
                logger.info("So it's void, but I still trigger the void control because why tf not");
                code.append("Result result = new Result();");
                code.append(String.format("        %s res = result.%s(", returnType, methodName));
                for (int i = 0; i < params.size(); i++) {
                    code.append(params.get(i).name);
                    if (i < params.size() - 1) code.append(", ");
                }

                code.append(");\n");
            } else {
                code.append("           Result result = new Result();");
                code.append("\n");
                code.append(String.format("        result.%s(", methodName));
                for (int i = 0; i < params.size(); i++) {
                    code.append(params.get(i).name);
                    if (i < params.size() - 1) code.append(", ");
                }
                code.append(");\n");
            }
            
            return code.toString();
        }

    private List<ParamParser> gatherParamParsers(List<Param> params){

        List<ParamParser> parserList = new ArrayList<>();

        for (Param p : params) {
            DataType dt = javaTailCodeGenerationUtils.dataTypeResolver(p.type);
            ParamParser parser = ParamParsers.getParser(dt);
            if (parser != null) {
                parserList.add(parser);
            }
        }
        
        return parserList;
    }



    private String addInputParsers(List<ParamParser> paramParsers, List<Param> params){

        StringBuilder inputParsers = new StringBuilder();

             // Read and parse each parameter
        for (int i = 0; i < paramParsers.size(); i++) {
            inputParsers.append(generateParamParsing(paramParsers.get(i), params.get(i).type, params.get(i).getName(), i));
        }

        return inputParsers.toString();
    }

    private String addOutputFormatters(ParamParser outputParser, String returnType, Param PrimaryParam){
        StringBuilder outputFormatters = new StringBuilder();

        logger.info("Inside outputFormatter the returnType is %s".formatted(returnType));

        if ("void".equals(returnType)){
            // If it's void, we print the primary parameter(s) instead after parsing
            outputFormatters.append(outputParser.generateOutputFormatting().replace("%s", PrimaryParam.name));
            // If there are multiple primary parameters, we would need to handle that as well (not implemented here)
        } else {
            outputFormatters.append(outputParser.generateOutputFormatting().replace("%s", "res"));
        }

        logger.info("This is how outputFormatter looks: \n %s \n".formatted(outputFormatters));

        return outputFormatters.toString();
    }

    // start main
        // declarations*
        // scanner
        // input parsers
        // method call*
        // output parsing
    
    // TODO: Implement logic for declarations on void types and custom ways to call the method for different return types
    private String addMainMethod(List<ParamParser> paramParsers, ParamParser outputParser, MethodSignature signature){
        StringBuilder mainMethod = new StringBuilder();
        mainMethod.append("    public static void main(String[] args) {\n");
        mainMethod.append("        Scanner scanner = new Scanner(System.in);\n\n");

        logger.info("Entered addMainMethod");


        // if (signature.returnType) == 'void'{
        // Now here I would need the primary parameter that needs to be modified
        // For now to keep things simple I'll say it's the first one in the order}

        // if (signature.returnType == "void "){
        //     Param primaryParam = signature.params.get(0);

        //     mainMethod.append("        %s %s;")
            
        // }

        /* 
            The neat part is: There could be multiple such parameters for in place modification,
            keeping that fact aside, here's what we need to do/change to incorportate this

            primary parameters to be declared (?)
            Now that I think about it, We are already storing the types with names after parsing
            All we need is the indexes of primary parameters
            Then, we pass by reference and let user modify the param in place in their code

            After that when we call for result method 
                if void, we print the primary params in order after parsing,
                else we print the result normally after parsing (whatever user method returned)
            
            Sometimes I think why aren't we just dumping all code into the file
            still that wouldn't help with in place modification
        */


        // Input parsers
        mainMethod.append(addInputParsers(paramParsers, signature.params));

        // clean code go brrrrrr
        mainMethod.append("\n");

        // Call method and handle output
        mainMethod.append(generateMethodCall(signature.returnType, signature.methodName, signature.params));

        // handle output
        mainMethod.append(addOutputFormatters(outputParser, signature.returnType, signature.params.get(0))); // Assuming first one is the primary param

       
        mainMethod.append("        scanner.close();\n");
        mainMethod.append("    }\n");

        return mainMethod.toString();
    }

    private String addCustomDataTypeClasses(List<ParamParser> paramParsers){
        StringBuilder classes = new StringBuilder();
        
        Set<String> addedClasses = new LinkedHashSet<>();
        for (ParamParser paramParser : paramParsers){
            String classDef = paramParser.generateCustomDataClass();
            if (!classDef.isEmpty() && !addedClasses.contains(classDef)){
                classes.append(classDef).append("\n");
                addedClasses.add(classDef);
            }
        }

        return classes.toString();
    }

    private String addMatrixParsingHelpers(List<ParamParser> paramParsers){
        StringBuilder helpers = new StringBuilder();
        
        for (ParamParser paramParser : paramParsers){
            helpers.append(paramParser.generateHelperMethod());
        }

        return helpers.toString();
            
    }

    // custom datatype classes*
    // public clsas Solution {
        // helper methods
            // start main
                // declarations*
                // scanner
                // input parsers
                // method call*
                // output parsing
                // print statement* (for void return type)
            // end main
    // }
    @Override
    public String generateTailCode(String methodToCall) {

        MethodSignature signature = javaTailCodeGenerationUtils.parseStarterCode(methodToCall);
        List<ParamParser> paramParsers = gatherParamParsers(signature.params);

        ParamParser outputParser;

        StringBuilder out = new StringBuilder();

    

        if ("void".equals(signature.returnType)){
            outputParser = paramParsers.get(0); // Sending the output parser in separately for the primary param (assumed to be the first one)
        } else {
            outputParser = ParamParsers.getParser(javaTailCodeGenerationUtils.dataTypeResolver(signature.returnType));
        }
        // Have to think about replacing the variable in template

        logger.info("Entered the generate tail code method");

       // custom datatypes (defined outside the solution class for it to be commonly accessible for user solution)
        out.append(addCustomDataTypeClasses(paramParsers));

        out.append("public class Solution {\n");

        // matrix helpers
        out.append(addMatrixParsingHelpers(paramParsers)); 

        // main function
        out.append(addMainMethod(paramParsers, outputParser, signature));
        

        // close class
        out.append("}\n"); 

        return out.toString();
    }

    

    
}
