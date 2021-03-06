'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _HTTPLoader=require('./net/HTTPLoader');var _HTTPLoader2=_interopRequireDefault(_HTTPLoader);var _HeadRequest=require('./vo/HeadRequest');var _HeadRequest2=_interopRequireDefault(_HeadRequest);var _DashJSError=require('./vo/DashJSError');var _DashJSError2=_interopRequireDefault(_DashJSError);var _EventBus=require('./../core/EventBus');var _EventBus2=_interopRequireDefault(_EventBus);var _BoxParser=require('../streaming/utils/BoxParser');var _BoxParser2=_interopRequireDefault(_BoxParser);var _Events=require('./../core/events/Events');var _Events2=_interopRequireDefault(_Events);var _Errors=require('./../core/errors/Errors');var _Errors2=_interopRequireDefault(_Errors);var _FactoryMaker=require('../core/FactoryMaker');var _FactoryMaker2=_interopRequireDefault(_FactoryMaker);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}/**
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
 */function FragmentLoader(config){config=config||{};var context=this.context;var eventBus=(0,_EventBus2.default)(context).getInstance();var instance=void 0,httpLoader=void 0;function setup(){var boxParser=(0,_BoxParser2.default)(context).getInstance();httpLoader=(0,_HTTPLoader2.default)(context).create({errHandler:config.errHandler,metricsModel:config.metricsModel,mediaPlayerModel:config.mediaPlayerModel,requestModifier:config.requestModifier,boxParser:boxParser,useFetch:config.mediaPlayerModel.getLowLatencyEnabled()});}function checkForExistence(request){var report=function report(success){eventBus.trigger(_Events2.default.CHECK_FOR_EXISTENCE_COMPLETED,{request:request,exists:success});};if(request){var headRequest=new _HeadRequest2.default(request.url);httpLoader.load({request:headRequest,success:function success(){report(true);},error:function error(){report(false);}});}else{report(false);}}function load(request){var report=function report(data,error){eventBus.trigger(_Events2.default.LOADING_COMPLETED,{request:request,response:data||null,error:error||null,sender:instance});};if(request){httpLoader.load({request:request,progress:function progress(event){eventBus.trigger(_Events2.default.LOADING_PROGRESS,{request:request,stream:event.stream});if(event.data){eventBus.trigger(_Events2.default.LOADING_DATA_PROGRESS,{request:request,response:event.data||null,error:null,sender:instance});}},success:function success(data){report(data);},error:function error(request,statusText,errorText){report(undefined,new _DashJSError2.default(_Errors2.default.FRAGMENT_LOADER_LOADING_FAILURE_ERROR_CODE,errorText,statusText));},abort:function abort(request){if(request){eventBus.trigger(_Events2.default.LOADING_ABANDONED,{request:request,mediaType:request.mediaType,sender:instance});}}});}else{report(undefined,new _DashJSError2.default(_Errors2.default.FRAGMENT_LOADER_NULL_REQUEST_ERROR_CODE,_Errors2.default.FRAGMENT_LOADER_NULL_REQUEST_ERROR_MESSAGE));}}function abort(){if(httpLoader){httpLoader.abort();}}function reset(){if(httpLoader){httpLoader.abort();httpLoader=null;}}instance={checkForExistence:checkForExistence,load:load,abort:abort,reset:reset};setup();return instance;}FragmentLoader.__dashjs_factory_name='FragmentLoader';exports.default=_FactoryMaker2.default.getClassFactory(FragmentLoader);
//# sourceMappingURL=FragmentLoader.js.map
