'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _Constants=require('../constants/Constants');var _Constants2=_interopRequireDefault(_Constants);var _HTTPRequest=require('../vo/metrics/HTTPRequest');var _DataChunk=require('../vo/DataChunk');var _DataChunk2=_interopRequireDefault(_DataChunk);var _FragmentModel=require('../models/FragmentModel');var _FragmentModel2=_interopRequireDefault(_FragmentModel);var _FragmentLoader=require('../FragmentLoader');var _FragmentLoader2=_interopRequireDefault(_FragmentLoader);var _RequestModifier=require('../utils/RequestModifier');var _RequestModifier2=_interopRequireDefault(_RequestModifier);var _EventBus=require('../../core/EventBus');var _EventBus2=_interopRequireDefault(_EventBus);var _Events=require('../../core/events/Events');var _Events2=_interopRequireDefault(_Events);var _FactoryMaker=require('../../core/FactoryMaker');var _FactoryMaker2=_interopRequireDefault(_FactoryMaker);var _Debug=require('../../core/Debug');var _Debug2=_interopRequireDefault(_Debug);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}/**
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
 */function FragmentController(config){config=config||{};var context=this.context;var eventBus=(0,_EventBus2.default)(context).getInstance();var errHandler=config.errHandler;var mediaPlayerModel=config.mediaPlayerModel;var metricsModel=config.metricsModel;var instance=void 0,logger=void 0,fragmentModels=void 0;function setup(){logger=(0,_Debug2.default)(context).getInstance().getLogger(instance);resetInitialSettings();eventBus.on(_Events2.default.FRAGMENT_LOADING_COMPLETED,onFragmentLoadingCompleted,instance);eventBus.on(_Events2.default.FRAGMENT_LOADING_PROGRESS,onFragmentLoadingCompleted,instance);}function getModel(type){var model=fragmentModels[type];if(!model){model=(0,_FragmentModel2.default)(context).create({metricsModel:metricsModel,fragmentLoader:(0,_FragmentLoader2.default)(context).create({metricsModel:metricsModel,mediaPlayerModel:mediaPlayerModel,errHandler:errHandler,requestModifier:(0,_RequestModifier2.default)(context).getInstance()})});fragmentModels[type]=model;}return model;}function isInitializationRequest(request){return request&&request.type&&request.type===_HTTPRequest.HTTPRequest.INIT_SEGMENT_TYPE;}function resetInitialSettings(){for(var model in fragmentModels){fragmentModels[model].reset();}fragmentModels={};}function reset(){eventBus.off(_Events2.default.FRAGMENT_LOADING_COMPLETED,onFragmentLoadingCompleted,this);eventBus.off(_Events2.default.FRAGMENT_LOADING_PROGRESS,onFragmentLoadingCompleted,this);resetInitialSettings();}function createDataChunk(bytes,request,streamId,endFragment){var chunk=new _DataChunk2.default();chunk.streamId=streamId;chunk.mediaInfo=request.mediaInfo;chunk.segmentType=request.type;chunk.start=request.startTime;chunk.duration=request.duration;chunk.end=chunk.start+chunk.duration;chunk.bytes=bytes;chunk.index=request.index;chunk.quality=request.quality;chunk.representationId=request.representationId;chunk.endFragment=endFragment;return chunk;}function onFragmentLoadingCompleted(e){if(fragmentModels[e.request.mediaType]!==e.sender){return;}var request=e.request;var bytes=e.response;var isInit=isInitializationRequest(request);var streamInfo=request.mediaInfo.streamInfo;if(e.error){if(e.request.mediaType===_Constants2.default.AUDIO||e.request.mediaType===_Constants2.default.VIDEO||e.request.mediaType===_Constants2.default.FRAGMENTED_TEXT){// add service location to blacklist controller - only for audio or video. text should not set errors
eventBus.trigger(_Events2.default.SERVICE_LOCATION_BLACKLIST_ADD,{entry:e.request.serviceLocation});}}if(!bytes||!streamInfo){logger.warn('No '+request.mediaType+' bytes to push or stream is inactive.');return;}var chunk=createDataChunk(bytes,request,streamInfo.id,e.type!==_Events2.default.FRAGMENT_LOADING_PROGRESS);eventBus.trigger(isInit?_Events2.default.INIT_FRAGMENT_LOADED:_Events2.default.MEDIA_FRAGMENT_LOADED,{chunk:chunk,fragmentModel:e.sender});}instance={getModel:getModel,isInitializationRequest:isInitializationRequest,reset:reset};setup();return instance;}FragmentController.__dashjs_factory_name='FragmentController';exports.default=_FactoryMaker2.default.getClassFactory(FragmentController);
//# sourceMappingURL=FragmentController.js.map
