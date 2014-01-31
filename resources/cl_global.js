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

/*
*
*   It is a class used to store value of Platform and Device(s), selected by User from the Welcome page.
*   Also used to retrive Platform and Device(s) values, when needed.
*   This is achieved with help of a singleton class and with object-oriented approach.
*
*/

var CLGlobalVariables = (function() {
    var instantiated;

    var init = function() {
        // Create new Object and return it.

        return {
        // FIXME default must not be null
        webCLPlatform : null,
        webCLDevices : null,
        m_isStrict : false,

        setwebCLPlatform : function (platform) {
            if (platform instanceof WebCLPlatform)
                this.webCLPlatform = platform;
            else
                throw { name : "WebCLException", message : "CLGlobalVariables ::setwebCLPlatform() failed. INVALID_PLATFORM"};
        },

        setwebCLDevices : function (devices) {
            if (typeof(devices) == 'object' && devices.length) {
                var flag = true;
                for (var i = 0; i < devices.length; i++) {
                    if (!(devices[i] instanceof WebCLDevice)) {
                        flag = false;
                        break;
                    }
                }
            }
            if (flag) {
                this.webCLDevices = devices;
                return;
            }
            throw { name : "WebCLException", message : "CLGlobalVariables ::setwebCLDevices() failed."};
        },

        setStrictFlag : function (value) {
            this.m_isStrict = value;
        },

        getwebCLPlatform : function() {
            return this.webCLPlatform;
        },

        getwebCLDevices : function() {
            return this.webCLDevices;
        },

        isStrict : function() {
            return this.m_isStrict;
        }
        }
    }

    var getInstance = function() {
        if (!this.instantiated) {
            this.instantiated = init();
        }
        return this.instantiated;
    }

return {
getInstance:getInstance,
none:false
};
}());
