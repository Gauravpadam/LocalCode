package com.localcode.services.Emitters.ParamParsers;

public abstract class ParamParser{
    protected ProvidesMatrixHelper mh;
    protected FormatsOutput fo;
    protected ProvidesCustomDataClass cd;

    protected ParamParser(FormatsOutput fo, ProvidesMatrixHelper mh, ProvidesCustomDataClass cd){
        this.fo = fo;
        this.mh = mh;
        this.cd = cd;

    }

    public abstract String generateInputParsing();

    public String generateOutputFormatting(){
        return fo.provideOutputFormatter();
    }

    public String generateHelperMethod(){
        return mh.provideHelper();
    }

    public String generateCustomDataClass(){
        return cd.provideCustomDataClass();
    }

}