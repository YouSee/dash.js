'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _DashJSError=require('./vo/DashJSError');var _DashJSError2=_interopRequireDefault(_DashJSError);var _HTTPLoader=require('./net/HTTPLoader');var _HTTPLoader2=_interopRequireDefault(_HTTPLoader);var _HTTPRequest=require('./vo/metrics/HTTPRequest');var _TextRequest=require('./vo/TextRequest');var _TextRequest2=_interopRequireDefault(_TextRequest);var _EventBus=require('../core/EventBus');var _EventBus2=_interopRequireDefault(_EventBus);var _Events=require('../core/events/Events');var _Events2=_interopRequireDefault(_Events);var _FactoryMaker=require('../core/FactoryMaker');var _FactoryMaker2=_interopRequireDefault(_FactoryMaker);var _Errors=require('../core/errors/Errors');var _Errors2=_interopRequireDefault(_Errors);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}/**
 * The copyright in this software is being made available under the BSD License,
 * included below. This software may be subject to other third party and contributor
 * rights, including patent rights, and no such rights are granted under this license.
 *
 * Copyright (c) 2013, Dash Industry Forum.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *  * Redistributions of source code must retain the above copyright notice, this
 *  list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above copyright notice,
 *  this list of conditions and the following disclaimer in the documentation and/or
 *  other materials provided with the distribution.
 *  * Neither the name of Dash Industry Forum nor the names of its
 *  contributors may be used to endorse or promote products derived from this software
 *  without specific prior written permission.
 *
 *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS AS IS AND ANY
 *  EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 *  WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
 *  IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
 *  INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
 *  NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 *  PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 *  WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 *  ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 *  POSSIBILITY OF SUCH DAMAGE.
 */function XlinkLoader(config){config=config||{};var RESOLVE_TO_ZERO='urn:mpeg:dash:resolve-to-zero:2013';var context=this.context;var eventBus=(0,_EventBus2.default)(context).getInstance();var httpLoader=(0,_HTTPLoader2.default)(context).create({errHandler:config.errHandler,metricsModel:config.metricsModel,mediaPlayerModel:config.mediaPlayerModel,requestModifier:config.requestModifier});var instance=void 0;function load(url,element,resolveObject){var report=function report(content,resolveToZero){element.resolved=true;element.resolvedContent=content?content:null;eventBus.trigger(_Events2.default.XLINK_ELEMENT_LOADED,{element:element,resolveObject:resolveObject,error:content||resolveToZero?null:new _DashJSError2.default(_Errors2.default.XLINK_LOADER_LOADING_FAILURE_ERROR_CODE,_Errors2.default.XLINK_LOADER_LOADING_FAILURE_ERROR_MESSAGE+url)});};if(url===RESOLVE_TO_ZERO){report(null,true);}else{var request=new _TextRequest2.default(url,_HTTPRequest.HTTPRequest.XLINK_EXPANSION_TYPE);httpLoader.load({request:request,success:function success(data){report(data);},error:function error(){report(null);}});}}function reset(){if(httpLoader){httpLoader.abort();httpLoader=null;}}instance={load:load,reset:reset};return instance;}XlinkLoader.__dashjs_factory_name='XlinkLoader';exports.default=_FactoryMaker2.default.getClassFactory(XlinkLoader);
//# sourceMappingURL=XlinkLoader.js.map
