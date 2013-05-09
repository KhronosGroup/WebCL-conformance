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

var createContext = function() {
    webCLContext = eval("webcl.createContext()");
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
    webCLCommandQueue = eval("webCLContext.createCommandQueue()");
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
    webCLPlatforms = eval("webcl.getPlatforms()");
    if (typeof(webCLPlatforms) == 'object' && webCLPlatforms.length)
        return webCLPlatforms;
    throw { name : "WebCLException", message : "WebCL::getPlatforms() failed."};
}

var getDevices = function(webCLPlatform, type)
{
    webCLDevices = eval("webCLPlatform.getDevices(type)");
    if (typeof(webCLDevices) == 'object' && webCLDevices.length)
        return webCLDevices;
    throw { name : "WebCLException", message : "WebCLPlatform::getDevices(" + type.toString(16) + ") failed."};
}

var getKernel = function(id)
{
    var kernelScript = document.getElementById(id);
    if (kernelScript == null || kernelScript.type != "x-kernel")
        return null;
    return kernelScript.firstChild.textContent;
}

var release = function(classObject)
{
    try {
        classObject.release();
        return true;
    } catch (e) {
        return e;
    }
}

var getSupportedImageFormats = function(webCLContext, flag, imageWidth, imageHeight)
{
    var imageFormatsArray = eval("webCLContext.getSupportedImageFormats(flag)");
    // FIXME :: Hardcoding to 1st image type. Need to check use cases.
    if (imageFormatsArray instanceof Array && imageFormatsArray.length > 0)
        return {width:imageWidth, height:imageHeight, channelOrder:imageFormatsArray[0].channelOrder, channelType:imageFormatsArray[0].channelType};
    throw {name:"FAILURE", message:"WebCLContext::getSupportedImageFormats( " + flag.toString(16) + " ) failed."};
}

var enqueueWriteImage = function(webCLCommandQueue, image, blockingWrite, origin, region, hostRowPitch, hostPtr)
{
    webCLCommandQueue.enqueueWriteImage(image, blockingWrite, origin, region, hostRowPitch, hostPtr);
    return true;
}

var enqueueReadImage = function(webCLCommandQueue, image, blockingRead, origin, region, hostRowPitch, hostPtr)
{
    webCLCommandQueue.enqueueReadImage(image, blockingRead, origin, region, hostRowPitch, hostPtr);
    return true;
}

var enqueueCopyBuffer = function(webCLCommandQueue, srcBuffer, destBuffer, srcOffset, destOffset, numBytes)
{
    webCLCommandQueue.enqueueCopyBuffer(srcBuffer, destBuffer, srcOffset, destOffset, numBytes);
    return true;
}

var enqueueCopyImage = function(webCLCommandQueue, srcImage, dstImage, srcOrigin, dstOrigin, region, eventWaitList, webclevent)
{
    webCLCommandQueue.enqueueCopyImage(srcImage, dstImage, srcOrigin, dstOrigin, region);
    return true;
}

var setCallback = function(webCLEvent, executionStatus, notify, userdata)
{
    webCLEvent.setCallback(executionStatus, notify, userdata);
    return true;
}

var build = function(webCLProgram, webCLDevice, options, callback, UserData)
{
    webCLProgram.build(webCLDevice, options, callback, UserData);
    return true;
}

var setArg = function(webCLkernel, index, value, type)
{
    if (type == null)
        webCLKernel.setArg(index, value);
    else
        webCLKernel.setArg(index, value, type);
    return true;
}

var enqueueNDRangeKernel = function(webCLCommandQueue, webCLKernel, globalWorkOffset, globalWorkSize, localWorkSize)
{
    webCLCommandQueue.enqueueNDRangeKernel(webCLKernel, globalWorkOffset, globalWorkSize, localWorkSize);
    return true;
}

var enqueueCopyBufferRect = function(webCLCommandQueue, srcBuffer, dstBuffer, srcOrigin, dstOrigin, region, srcRowPitch, srcSlicePitch, dstRowPitch, dstSlicePitch)
{
    webCLCommandQueue.enqueueCopyBufferRect(srcBuffer, dstBuffer, srcOrigin, dstOrigin, region, srcRowPitch, srcSlicePitch, dstRowPitch, dstSlicePitch);
    return true;
}

var enqueueReadBufferRect = function(webCLCommandQueue, webCLBuffer, blockingRead, bufferOrigin, hostOrigin, region, bufferRowPitch, bufferSlicePitch, hostRowPitch, hostSlicePitch, hostPtr, eventWaitList, webCLEvent)
{
    webCLCommandQueue.enqueueReadBufferRect(webCLBuffer, blockingRead, bufferOrigin, hostOrigin, region, bufferRowPitch, bufferSlicePitch, hostRowPitch, hostSlicePitch, hostPtr);
    return true;
}

var enqueueWriteBufferRect = function(webCLCommandQueue, webCLBuffer, blockingWrite, bufferOrigin, hostOrigin, region, bufferRowPitch, bufferSlicePitch, hostRowPitch, hostSlicePitch, hostPtr, eventWaitList, webCLEvent)
{
    webCLCommandQueue.enqueueWriteBufferRect(webCLBuffer, blockingWrite, bufferOrigin, hostOrigin, region, bufferRowPitch, bufferSlicePitch, hostRowPitch, hostSlicePitch, hostPtr);
    return true;
}
var enqueueCopyBufferToImage = function(webCLCommandQueue, srcBuffer, dstImage, srcOffset, dstOrigin, dstRegion)
{
    webCLCommandQueue.enqueueCopyBufferToImage(srcBuffer, dstImage, srcOffset, dstOrigin, dstRegion);
    return true;
}

var enqueueCopyImageToBuffer = function(webCLCommandQueue, srcImage, dstBuffer, srcOrigin, srcRegion, dstOffset)
{
    webCLCommandQueue.enqueueCopyImageToBuffer(srcImage, dstBuffer, srcOrigin, srcRegion, dstOffset);
    return true;
}

var enqueueWriteBuffer = function(webCLCommandQueue, webCLBuffer, blockingWrite, bufferOffset, numBytes, hostPtr)
{
    webCLCommandQueue.enqueueWriteBuffer(webCLBuffer, blockingWrite, bufferOffset, numBytes, hostPtr);
    return true;
}

var enqueueReadBuffer = function(webCLCommandQueue, webCLBuffer, blockingRead, bufferOffset, numBytes, hostPtr)
{
    webCLCommandQueue.enqueueReadBuffer(webCLBuffer, blockingRead, bufferOffset, numBytes, hostPtr);
    return true;
}

var enqueueTask = function(webCLCommandQueue, webCLKernel)
{
    webCLCommandQueue.enqueueTask(webCLKernel);
    return true;
}

return {
createContext:createContext,
createProgram:createProgram,
createCommandQueue:createCommandQueue,
createEvent:createEvent,
createKernel:createKernel,
createSampler:createSampler,
getPlatforms:getPlatforms,
getDevices:getDevices,
getKernel:getKernel,
release:release,
getSupportedImageFormats:getSupportedImageFormats,
enqueueWriteImage:enqueueWriteImage,
enqueueCopyBuffer:enqueueCopyBuffer,
enqueueCopyImage:enqueueCopyImage,
setCallback:setCallback,
build:build,
setArg:setArg,
enqueueNDRangeKernel:enqueueNDRangeKernel,
enqueueCopyBufferRect:enqueueCopyBufferRect,
enqueueReadBufferRect:enqueueReadBufferRect,
enqueueWriteBufferRect:enqueueWriteBufferRect,
enqueueReadImage:enqueueReadImage,
enqueueCopyBufferToImage:enqueueCopyBufferToImage,
enqueueCopyImageToBuffer:enqueueCopyImageToBuffer,
enqueueWriteBuffer:enqueueWriteBuffer,
enqueueReadBuffer:enqueueReadBuffer,
enqueueTask:enqueueTask,
none:false
};
}());
