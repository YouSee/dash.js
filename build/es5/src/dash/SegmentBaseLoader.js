'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _RequestModifier=require('../streaming/utils/RequestModifier');var _RequestModifier2=_interopRequireDefault(_RequestModifier);var _Segment=require('./vo/Segment');var _Segment2=_interopRequireDefault(_Segment);var _DashJSError=require('../streaming/vo/DashJSError');var _DashJSError2=_interopRequireDefault(_DashJSError);var _Events=require('../core/events/Events');var _Events2=_interopRequireDefault(_Events);var _EventBus=require('../core/EventBus');var _EventBus2=_interopRequireDefault(_EventBus);var _BoxParser=require('../streaming/utils/BoxParser');var _BoxParser2=_interopRequireDefault(_BoxParser);var _FactoryMaker=require('../core/FactoryMaker');var _FactoryMaker2=_interopRequireDefault(_FactoryMaker);var _Debug=require('../core/Debug');var _Debug2=_interopRequireDefault(_Debug);var _HTTPRequest=require('../streaming/vo/metrics/HTTPRequest');var _FragmentRequest=require('../streaming/vo/FragmentRequest');var _FragmentRequest2=_interopRequireDefault(_FragmentRequest);var _HTTPLoader=require('../streaming/net/HTTPLoader');var _HTTPLoader2=_interopRequireDefault(_HTTPLoader);var _Errors=require('../core/errors/Errors');var _Errors2=_interopRequireDefault(_Errors);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}/**
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
 */function SegmentBaseLoader(){var context=this.context;var eventBus=(0,_EventBus2.default)(context).getInstance();var instance=void 0,logger=void 0,errHandler=void 0,boxParser=void 0,requestModifier=void 0,metricsModel=void 0,mediaPlayerModel=void 0,httpLoader=void 0,baseURLController=void 0;function setup(){logger=(0,_Debug2.default)(context).getInstance().getLogger(instance);}function initialize(){boxParser=(0,_BoxParser2.default)(context).getInstance();requestModifier=(0,_RequestModifier2.default)(context).getInstance();httpLoader=(0,_HTTPLoader2.default)(context).create({errHandler:errHandler,metricsModel:metricsModel,mediaPlayerModel:mediaPlayerModel,requestModifier:requestModifier});}function setConfig(config){if(config.baseURLController){baseURLController=config.baseURLController;}if(config.metricsModel){metricsModel=config.metricsModel;}if(config.mediaPlayerModel){mediaPlayerModel=config.mediaPlayerModel;}if(config.errHandler){errHandler=config.errHandler;}}function checkSetConfigCall(){if(!baseURLController||!baseURLController.hasOwnProperty('resolve')){throw new Error('setConfig function has to be called previously');}}function loadInitialization(representation,loadingInfo){checkSetConfigCall();var initRange=null;var baseUrl=baseURLController.resolve(representation.path);var info=loadingInfo||{init:true,url:baseUrl?baseUrl.url:undefined,range:{start:0,end:1500},searching:false,bytesLoaded:0,bytesToLoad:1500};logger.debug('Start searching for initialization.');var request=getFragmentRequest(info);var onload=function onload(response){info.bytesLoaded=info.range.end;initRange=boxParser.findInitRange(response);if(initRange){representation.range=initRange;// note that we don't explicitly set rep.initialization as this
// will be computed when all BaseURLs are resolved later
eventBus.trigger(_Events2.default.INITIALIZATION_LOADED,{representation:representation});}else{info.range.end=info.bytesLoaded+info.bytesToLoad;loadInitialization(representation,info);}};var onerror=function onerror(){eventBus.trigger(_Events2.default.INITIALIZATION_LOADED,{representation:representation});};httpLoader.load({request:request,success:onload,error:onerror});logger.debug('Perform init search: '+info.url);}function loadSegments(representation,type,range,loadingInfo,callback){checkSetConfigCall();if(range&&(range.start===undefined||range.end===undefined)){var parts=range?range.toString().split('-'):null;range=parts?{start:parseFloat(parts[0]),end:parseFloat(parts[1])}:null;}callback=!callback?onLoaded:callback;var isoFile=null;var sidx=null;var hasRange=!!range;var baseUrl=baseURLController.resolve(representation.path);var info={init:false,url:baseUrl?baseUrl.url:undefined,range:hasRange?range:{start:0,end:1500},searching:!hasRange,bytesLoaded:loadingInfo?loadingInfo.bytesLoaded:0,bytesToLoad:1500};var request=getFragmentRequest(info);var onload=function onload(response){var extraBytes=info.bytesToLoad;var loadedLength=response.byteLength;info.bytesLoaded=info.range.end-info.range.start;isoFile=boxParser.parse(response);sidx=isoFile.getBox('sidx');if(!sidx||!sidx.isComplete){if(sidx){info.range.start=sidx.offset||info.range.start;info.range.end=info.range.start+(sidx.size||extraBytes);}else if(loadedLength<info.bytesLoaded){// if we have reached a search limit or if we have reached the end of the file we have to stop trying to find sidx
callback(null,representation,type);return;}else{var lastBox=isoFile.getLastBox();if(lastBox&&lastBox.size){info.range.start=lastBox.offset+lastBox.size;info.range.end=info.range.start+extraBytes;}else{info.range.end+=extraBytes;}}loadSegments(representation,type,info.range,info,callback);}else{var ref=sidx.references;var loadMultiSidx=void 0,segments=void 0;if(ref!==null&&ref!==undefined&&ref.length>0){loadMultiSidx=ref[0].reference_type===1;}if(loadMultiSidx){logger.debug('Initiate multiple SIDX load.');info.range.end=info.range.start+sidx.size;var j=void 0,len=void 0,ss=void 0,se=void 0,r=void 0;var segs=[];var count=0;var offset=(sidx.offset||info.range.start)+sidx.size;var tmpCallback=function tmpCallback(result){if(result){segs=segs.concat(result);count++;if(count>=len){callback(segs,representation,type);}}else{callback(null,representation,type);}};for(j=0,len=ref.length;j<len;j++){ss=offset;se=offset+ref[j].referenced_size-1;offset=offset+ref[j].referenced_size;r={start:ss,end:se};loadSegments(representation,null,r,info,tmpCallback);}}else{logger.debug('Parsing segments from SIDX.');segments=getSegmentsForSidx(sidx,info);callback(segments,representation,type);}}};var onerror=function onerror(){callback(null,representation,type);};httpLoader.load({request:request,success:onload,error:onerror});logger.debug('Perform SIDX load: '+info.url);}function reset(){httpLoader.abort();httpLoader=null;errHandler=null;boxParser=null;requestModifier=null;}function getSegmentsForSidx(sidx,info){var refs=sidx.references;var len=refs.length;var timescale=sidx.timescale;var time=sidx.earliest_presentation_time;var start=info.range.start+sidx.offset+sidx.first_offset+sidx.size;var segments=[];var segment=void 0,end=void 0,duration=void 0,size=void 0;for(var i=0;i<len;i++){duration=refs[i].subsegment_duration;size=refs[i].referenced_size;segment=new _Segment2.default();// note that we don't explicitly set segment.media as this will be
// computed when all BaseURLs are resolved later
segment.duration=duration;segment.startTime=time;segment.timescale=timescale;end=start+size-1;segment.mediaRange=start+'-'+end;segments.push(segment);time+=duration;start+=size;}return segments;}function getFragmentRequest(info){if(!info.url){return;}var request=new _FragmentRequest2.default();request.type=info.init?_HTTPRequest.HTTPRequest.INIT_SEGMENT_TYPE:_HTTPRequest.HTTPRequest.MEDIA_SEGMENT_TYPE;request.url=info.url;request.range=info.range.start+'-'+info.range.end;return request;}function onLoaded(segments,representation,type){if(segments){eventBus.trigger(_Events2.default.SEGMENTS_LOADED,{segments:segments,representation:representation,mediaType:type});}else{eventBus.trigger(_Events2.default.SEGMENTS_LOADED,{segments:null,representation:representation,mediaType:type,error:new _DashJSError2.default(_Errors2.default.SEGMENT_BASE_LOADER_ERROR_CODE,_Errors2.default.SEGMENT_BASE_LOADER_ERROR_MESSAGE)});}}instance={setConfig:setConfig,initialize:initialize,loadInitialization:loadInitialization,loadSegments:loadSegments,reset:reset};setup();return instance;}SegmentBaseLoader.__dashjs_factory_name='SegmentBaseLoader';exports.default=_FactoryMaker2.default.getSingletonFactory(SegmentBaseLoader);
//# sourceMappingURL=SegmentBaseLoader.js.map