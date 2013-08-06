/*
   <!--
   Copyright (C) 2013 Samsung Electronics Corporation. All rights reserved.

   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided the following conditions
   are met:

   1.  Redistributions of source code must retain the above copyright
   notice, this list of conditions and the following disclaimer.

   2.  Redistributions in binary form must reproduce the above copyright
   notice, this list of conditions and the following disclaimer in the
   documentation and/or other materials provided with the distribution.

   THIS SOFTWARE IS PROVIDED BY SAMSUNG ELECTRONICS CORPORATION AND ITS
   CONTRIBUTORS "AS IS", AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING
   BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS
   FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL SAMSUNG
   ELECTRONICS CORPORATION OR ITS CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
   INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES(INCLUDING
   BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
   DATA, OR PROFITS, OR BUSINESS INTERRUPTION), HOWEVER CAUSED AND ON ANY THEORY
   OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT(INCLUDING
   NEGLIGENCE OR OTHERWISE ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
   EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   -->
*/

var SIZE = 1024;
var DATA_SIZE = Float32Array.BYTES_PER_ELEMENT * 1024;
var WIDTH_STEP = Float32Array.BYTES_PER_ELEMENT * 320 * 4;
var BUFFER_SIZE = Float32Array.BYTES_PER_ELEMENT * 320 * 240 * 4;


var WebCLTestUtils = (function() {

var generateData = function(type, size) {
    try {
        var data = eval("new type(size)");
    } catch (e) {
        throw {name : "WebCLException", message : "Expected a typed array but got " + type + "."};
    }
    for (index = 0; index < size; index++)
        data[index] = Math.floor(Math.random() * 100);
    return data;
};

var createContext = function() {
    var gv = window.top.CLGlobalVariables;
    if (gv) {
        var selectedPlatform = gv.getInstance().getwebCLPlatform();
        var selectedDevices = gv.getInstance().getwebCLDevices();
        webCLContext = webcl.createContext({platform:selectedPlatform, devices:selectedDevices, deviceType:null, shareGroup:null, hint:null});
    } else {
        webCLContext = eval("webcl.createContext()");
    }
    if (webCLContext instanceof WebCLContext)
        return webCLContext;
    throw { name : "WebCLException", message : "WebCL::createContext failed."};
}

var createProgram = function(webCLContext, kernelSource) {
    webCLProgram = eval("webCLContext.createProgram(kernelSource)");
    if (webCLProgram instanceof WebCLProgram)
        return webCLProgram;
    throw { name : "WebCLException", message : "WebCLContext::createProgram(" + kernelSource + ") failed."};
}

var createCommandQueue = function(webCLContext) {
    var gv = window.top.CLGlobalVariables;
    if (gv) {
        var selectedDevices = gv.getInstance().getwebCLDevices();
        var dev = selectedDevices[0];
        webCLCommandQueue = eval("webCLContext.createCommandQueue(dev)");
    } else {
        webCLCommandQueue = eval("webCLContext.createCommandQueue()");
    }
    if (webCLCommandQueue instanceof WebCLCommandQueue)
        return webCLCommandQueue;
    throw { name : "WebCLException", message : "WebCLContext::createCommandQueue() failed."};
}

var createEvent = function(webCLContext) {
    webCLEvent = eval("webCLContext.createUserEvent()");
    if (webCLEvent instanceof WebCLEvent)
        return webCLEvent;
    throw { name : "WebCLException", message : "WebCLContext::createEvent() failed."};
}

var createKernel = function(webCLProgram, kernelName) {
    webCLKernel = eval("webCLProgram.createKernel(kernelName)");
    if (webCLKernel instanceof WebCLKernel)
        return webCLKernel;
    throw { name : "WebCLException", message : "WebCLContext::createKernel() failed."};
}
var createSampler = function(webCLContext, normalizedCoords, addressingMode, filterMode) {
    webCLSampler = eval("webCLContext.createSampler(normalizedCoords, addressingMode, filterMode)");
    if (webCLSampler instanceof WebCLSampler)
        return webCLSampler;
    throw { name : "WebCLException", message : "WebCLContext::createSampler() failed."};
}

var getPlatforms = function() {
    var gv = window.top.CLGlobalVariables;
    if (gv)
        return gv.getInstance().getwebCLPlatform();
    else {
        webCLPlatforms = eval("webcl.getPlatforms()");
        if (typeof(webCLPlatforms) == 'object' && webCLPlatforms.length)
            return webCLPlatforms[0];
    }
    throw { name : "WebCLException", message : "WebCL::getPlatforms() failed."};
}

var getDevices = function(webCLPlatform, type) {
    var gv = window.top.CLGlobalVariables;
    if (gv)
        return gv.getInstance().getwebCLDevices();
    else {
        if (!type)
            type = webcl.DEVICE_TYPE_DEFAULT;
        webCLDevices = eval("webCLPlatform.getDevices(type)");
        if (typeof(webCLDevices) == 'object' && webCLDevices.length)
            return webCLDevices;
    }
    throw { name : "WebCLException", message : "WebCLPlatform::getDevices(" + type.toString(16) + ") failed."};
}

var getSupportedImageFormats = function(webCLContext, flag, imageWidth, imageHeight)
{
    var imageFormatsArray = eval("webCLContext.getSupportedImageFormats(flag)");
    // FIXME :: Hardcoding to 1st image type. Need to check use cases.
    if (imageFormatsArray instanceof Array && imageFormatsArray.length > 0)
        return {width:imageWidth, height:imageHeight, channelOrder:imageFormatsArray[0].channelOrder, channelType:imageFormatsArray[0].channelType};
    throw {name:"FAILURE", message:"WebCLContext::getSupportedImageFormats( " + flag.toString(16) + " ) failed."};
}

var build = function(webCLProgram, webCLDevices, options, callback, UserData)
{
    webCLProgram.build(webCLDevices, options, callback, UserData);
    if (webCLProgram.getBuildInfo(webCLDevices[0], webcl.PROGRAM_BUILD_STATUS) == 0)
        return true;
    throw { name : "WebCLException", message : "WebCLProgram::build failed."};
}

var setArg = function(webCLkernel, index, value, type)
{
    if (type == null)
        webCLKernel.setArg(index, value);
    else
        webCLKernel.setArg(index, value, type);
    return true;
}

var enqueueNDRangeKernel = function(webCLCommandQueue, webCLKernel, workDim, globalWorkOffset, globalWorkSize, localWorkSize)
{
    webCLCommandQueue.enqueueNDRangeKernel(webCLKernel, workDim, globalWorkOffset, globalWorkSize, localWorkSize);
    return true;
}
var readKernel = function(file) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", file, false);
    xhr.send();
    var source = xhr.responseText.replace(/\r/g, "");
    if (xhr.status === 200 && xhr.readyState === 4) {
        if (source.length && source.match(/^__kernel/))
            return source;
    }
    throw { name : "WebCLException", message : "Failed to read Kernel."};
};

return {
createContext:createContext,
createProgram:createProgram,
createCommandQueue:createCommandQueue,
createEvent:createEvent,
createKernel:createKernel,
createSampler:createSampler,
getPlatforms:getPlatforms,
getDevices:getDevices,
getSupportedImageFormats:getSupportedImageFormats,
build:build,
setArg:setArg,
enqueueNDRangeKernel:enqueueNDRangeKernel,
readKernel:readKernel,
generateData:generateData,
none:false
};
}());
