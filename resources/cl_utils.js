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

var createContext = function(webCLPlatform, webCLDevices, deviceType) {
    var gv = window.top.CLGlobalVariables;
    try {
        if (arguments.length > 0) {
            webCLContext = eval("webcl.createContext({platform:webCLPlatform, devices:webCLDevices, deviceType:deviceType})");
        } else {
            if (gv) {
                var selectedPlatform = gv.getInstance().getwebCLPlatform();
                var selectedDevices = gv.getInstance().getwebCLDevices();
                webCLContext = eval("webcl.createContext({platform:selectedPlatform, devices:selectedDevices, deviceType:null})");
            } else {
                webCLContext = eval("webcl.createContext()");
            }
        }
        if (webCLContext instanceof WebCLContext)
            return webCLContext;
    } catch(e) {
        e.description = "WebCL :: createContext threw exception : " + e.name;
        throw e;
    }
}

var createProgram = function(webCLContext, kernelSource) {
    try {
        webCLProgram = eval("webCLContext.createProgram(kernelSource)");
        if (webCLProgram instanceof WebCLProgram)
            return webCLProgram;
    } catch(e) {
        e.description = "WebCLContext :: createProgram threw exception : " + e.name;
        throw e;
    }
}

var createCommandQueue = function(webCLContext, webCLDevice, properties) {
    var gv = window.top.CLGlobalVariables;
    try {
        if (arguments.length > 1) {
            webCLCommandQueue = eval("webCLContext.createCommandQueue(webCLDevice, properties)");
        } else {
            if (gv) {
                var selectedDevices = gv.getInstance().getwebCLDevices();
                var dev = selectedDevices[0];
                webCLCommandQueue = eval("webCLContext.createCommandQueue(dev)");
            } else {
                webCLCommandQueue = eval("webCLContext.createCommandQueue()");
            }
        }
        if (webCLCommandQueue instanceof WebCLCommandQueue)
            return webCLCommandQueue;
    } catch(e) {
        e.description = "WebCLContext :: createCommandQueue threw exception : " + e.name;
        throw e;
    }
}

var createEvent = function(webCLContext) {
    try {
        webCLEvent = eval("webCLContext.createUserEvent()");
        if (webCLEvent instanceof WebCLEvent)
            return webCLEvent;
    } catch(e) {
        e.description = "WebCLContext :: createEvent threw exception : " + e.name;
        throw e;
    }
}

var createKernel = function(webCLProgram, kernelName) {
    try {
        webCLKernel = eval("webCLProgram.createKernel(kernelName)");
        if (webCLKernel instanceof WebCLKernel)
            return webCLKernel;
    } catch (e) {
        e.description = "WebCLContext :: createKernel threw exception : " + e.name;
        throw e;
    }
}

var createSampler = function(webCLContext, normalizedCoords, addressingMode, filterMode) {
    try {
        webCLSampler = eval("webCLContext.createSampler(normalizedCoords, addressingMode, filterMode)");
        if (webCLSampler instanceof WebCLSampler)
            return webCLSampler;
    } catch (e) {
        e.description = "WebCLContext :: webCLSampler threw exception : " + e.name;
        throw e;
    }
}

var getPlatforms = function() {
    var gv = window.top.CLGlobalVariables;
    try {
        if (gv)
            return gv.getInstance().getwebCLPlatform();
        else {
            webCLPlatforms = eval("webcl.getPlatforms()");
            if (typeof(webCLPlatforms) == 'object' && webCLPlatforms.length)
                return webCLPlatforms[0];
        }
    } catch(e) {
        e.description = "WebCL :: getPlatforms threw exception : " + e.name;
        throw e;
    }
}

var getDevices = function(webCLPlatform, deviceType) {
    var gv = window.top.CLGlobalVariables;
    try {
        if (arguments.length > 1)
            webCLDevices = eval("webCLPlatform.getDevices(deviceType)");
        else {
            if (gv)
                return gv.getInstance().getwebCLDevices();
            else
                webCLDevices = eval("webCLPlatform.getDevices(webcl.DEVICE_TYPE_DEFAULT)");
        }
        if (typeof(webCLDevices) == 'object' && webCLDevices.length)
                    return webCLDevices;
    } catch(e) {
        e.description = "WebCLPlatform :: getDevices threw exception : " + e.name;
        throw e;
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

var build = function(webCLProgram, webCLDevices, options, callback)
{
    try {
        webCLProgram.build(webCLDevices, options, callback);
        if (webCLProgram.getBuildInfo(webCLDevices[0], webcl.PROGRAM_BUILD_STATUS) == 0)
            return true;
    } catch(e) {
        e.description = "WebCLProgram :: build threw exception : " + e.name;
        throw e;
    }
}

var enqueueNDRangeKernel = function(webCLCommandQueue, webCLKernel, workDim, globalWorkOffset, globalWorkSize, localWorkSize)
{
    try {
        webCLCommandQueue.enqueueNDRangeKernel(webCLKernel, workDim, globalWorkOffset, globalWorkSize, localWorkSize);
    } catch(e) {
        e.description = "WebCLCommandQueue :: enqueueNDRangeKernel threw exception : " + e.name;
        throw e;
    }
}

var readKernel = function(file) {
    try {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", file, false);
        xhr.send();
        var source = xhr.responseText.replace(/\r/g, "");
        if (xhr.status === 200 && xhr.readyState === 4) {
            if (source.length && source.match(/^__kernel/))
                return source;
        }
        throw { name : "WebCLException", message : "Failed to read Kernel."};
    } catch(e) {
        e.description = "readKernel threw exception : " + e.name;
        throw e;
    }
}

var createBuffer = function(webCLContext, flag, bufferSize) {
    try {
        var webCLBuffer = eval("webCLContext.createBuffer(flag, bufferSize);");
        if (webCLBuffer instanceof WebCLBuffer)
            return webCLBuffer;
    } catch (e) {
        e.description = "WebCLContext :: createBuffer threw exception : " + e.name;
        throw e;
    }
}

var release = function(webCLObject) {
    try {
        eval("webCLObject.release()");
    } catch(e) {
        e.description = webCLObject + " :: release threw exception : " + e.name;
        throw e;
    }
}

var setArg = function(webCLKernel, index, value) {
    try {
        webCLKernel.setArg(index, value);
    } catch(e) {
        e.description = "WebCLKernel :: setArg threw exception : " + e.name;
        throw e;
    }
}

var createSubBuffer = function(webCLBuffer, flag, origin, size) {
    try {
        webCLSubBuffer = webCLBuffer.createSubBuffer(flag, origin, size);
        return webCLSubBuffer;
    } catch(e) {
        e.description = "WebCLBuffer :: createSubBuffer threw exception : " + e.name;
        throw e;
    }
}

var createImage = function(webCLContext, flag, webCLImageDescriptor) {
    try {
        webCLImage = webCLContext.createImage(flag, webCLImageDescriptor);
        if (webCLImage instanceof WebCLImage)
            return webCLImage;
    } catch (e) {
        e.description = "WebCLContext :: createImage threw exception : " + e.name;
        throw e;
    }
}

var enqueueCopyBuffer = function(webCLCommandQueue, srcBuffer, dstBuffer, srcOffset, dstOffset, numBytes) {
    try {
        webCLCommandQueue.enqueueCopyBuffer(srcBuffer, dstBuffer, srcOffset, dstOffset, numBytes);
    } catch(e) {
        e.description = "WebCLCommandQueue :: enqueueCopyBuffer threw exception : " + e.name;
        throw e;
    }
}

var enqueueReadBuffer = function(webCLCommandQueue, buffer, blockingRead, bufferOffset, numBytes, hostPtr) {
    try {
        webCLCommandQueue.enqueueReadBuffer(buffer, blockingRead, bufferOffset, numBytes, hostPtr);
    } catch(e) {
        e.description = "WebCLCommandQueue :: enqueueReadBuffer threw exception : " + e.name;
        throw e;
    }
}

var enqueueWriteBuffer = function(webCLCommandQueue, webCLBuffer, blockingWrite, bufferOffset, numBytes, hostPtr) {
    try {
        webCLCommandQueue.enqueueWriteBuffer(webCLBuffer, blockingWrite, bufferOffset, numBytes, hostPtr);
    } catch(e) {
        e.description = "WebCLCommandQueue :: enqueueWriteBuffer threw exception : " + e.name;
        throw e;
    }
}

var enqueueCopyBufferRect = function(webCLCommandQueue, srcBuffer, dstBuffer, srcOrigin, dstOrigin, region, srcRowPitch, srcSlicePitch, dstRowPitch, dstSlicePitch) {
    try {
        webCLCommandQueue.enqueueCopyBufferRect(srcBuffer, dstBuffer, srcOrigin, dstOrigin, region, srcRowPitch, srcSlicePitch, dstRowPitch, dstSlicePitch);
    } catch (e) {
        e.description = "WebCLCommandQueue :: enqueueCopyBufferRect threw exception : " + e.name;
        throw e;
    }
}

var enqueueReadBufferRect = function(webCLCommandQueue, buffer, blockingRead, bufferOrigin, hostOrigin, region, bufferRowPitch, bufferSlicePitch, hostRowPitch, hostSlicePitch, hostPtr) {
    try {
        webCLCommandQueue.enqueueReadBufferRect(buffer, blockingRead, bufferOrigin, hostOrigin, region, bufferRowPitch, bufferSlicePitch, hostRowPitch, hostSlicePitch, hostPtr);
    } catch(e) {
        e.description = "WebCLCommandQueue :: enqueueReadBufferRect threw exception : " + e.name;
        throw e;
    }
}

var enqueueWriteBufferRect = function(webCLCommandQueue, buffer, blockingWrite, bufferOrigin, hostOrigin, region, bufferRowPitch, bufferSlicePitch, hostRowPitch, hostSlicePitch, hostPtr) {
    try {
        webCLCommandQueue.enqueueWriteBufferRect(buffer, blockingWrite, bufferOrigin, hostOrigin, region, bufferRowPitch, bufferSlicePitch, hostRowPitch, hostSlicePitch, hostPtr);
    } catch(e) {
        e.description = "WebCLCommandQueue :: enqueueWriteBufferRect threw exception : " + e.name;
        throw e;
    }
}

var enqueueCopyImage = function(webCLCommandQueue, srcImage, dstImage, srcOrigin, dstOrigin, region) {
    try {
        webCLCommandQueue.enqueueCopyImage(srcImage, dstImage, srcOrigin, dstOrigin, region);
    } catch(e) {
        e.description = "WebCLCommandQueue :: enqueueCopyImage threw exception : " + e.name;
        throw e;
    }
}

var enqueueReadImage = function(webCLCommandQueue, image, blockingRead, origin, region, hostRowPitch, hostPtr) {
    try {
        webCLCommandQueue.enqueueReadImage(image, blockingRead, origin, region, hostRowPitch, hostPtr);
    } catch(e) {
        e.description = "WebCLCommandQueue :: enqueueReadImage threw exception : " + e.name;
        throw e;
    }
}

var enqueueWriteImage = function(webCLCommandQueue, image, blockingWrite, origin, region, hostRowPitch, hostPtr) {
    try {
        webCLCommandQueue.enqueueWriteImage(image, blockingWrite, origin, region, hostRowPitch, hostPtr);
    } catch(e) {
        e.description = "WebCLCommandQueue :: enqueueWriteImage threw exception : " + e.name;
        throw e;
    }
}

var enqueueCopyBufferToImage = function(webCLCommandQueue, srcBuffer, dstImage, srcOffset, dstOrigin, dstRegion) {
    try {
        webCLCommandQueue.enqueueCopyBufferToImage(srcBuffer, dstImage, srcOffset, dstOrigin, dstRegion);
    } catch(e) {
        e.description = "WebCLCommandQueue :: enqueueCopyBufferToImage threw exception : " + e.name;
        throw e;
    }
}

var enqueueCopyImageToBuffer = function(webCLCommandQueue, srcImage, dstBuffer, srcOrigin, srcRegion, dstOffset) {
    try {
        webCLCommandQueue.enqueueCopyImageToBuffer(srcImage, dstBuffer, srcOrigin, srcRegion, dstOffset);
    } catch (e) {
        e.description = "WebCLCommandQueue :: enqueueCopyImageToBuffer threw exception : " + e.name;
        throw e;
    }
}

var generateRandomInt = function(data, loopSize) {
    for (i = 0; i < loopSize; i++)
        data[i] = Math.floor(Math.random() * 10);
    return data;
}

var verifyResult = function(data, result, loopSize, msg) {
    correct = 0;
    for (i = 0; i < loopSize; i++)
        if (data[i] == result[i])
            correct++;
    if (correct == loopSize)
        testPassed("Test passed for " + msg + ".");
    else
        testFailed("Test failed for " + msg + ". Computed " + correct + " / " + loopSize + " correct values.");
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
getSupportedImageFormats:getSupportedImageFormats,
build:build,
enqueueNDRangeKernel:enqueueNDRangeKernel,
readKernel:readKernel,
generateData:generateData,
createBuffer:createBuffer,
createImage:createImage,
release:release,
setArg:setArg,
createSubBuffer:createSubBuffer,
enqueueCopyBuffer:enqueueCopyBuffer,
enqueueReadBuffer:enqueueReadBuffer,
enqueueWriteBuffer:enqueueWriteBuffer,
enqueueCopyBufferRect:enqueueCopyBufferRect,
enqueueReadBufferRect:enqueueReadBufferRect,
enqueueWriteBufferRect:enqueueWriteBufferRect,
enqueueCopyImage:enqueueCopyImage,
enqueueReadImage:enqueueReadImage,
enqueueWriteImage:enqueueWriteImage,
enqueueCopyBufferToImage:enqueueCopyBufferToImage,
enqueueCopyImageToBuffer:enqueueCopyImageToBuffer,
generateRandomInt:generateRandomInt,
verifyResult:verifyResult,
none:false
};
}());
