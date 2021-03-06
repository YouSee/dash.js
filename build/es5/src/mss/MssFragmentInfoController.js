'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _MssEvents=require('./MssEvents');var _MssEvents2=_interopRequireDefault(_MssEvents);var _MssFragmentMoofProcessor=require('./MssFragmentMoofProcessor');var _MssFragmentMoofProcessor2=_interopRequireDefault(_MssFragmentMoofProcessor);var _FragmentRequest=require('../streaming/vo/FragmentRequest');var _FragmentRequest2=_interopRequireDefault(_FragmentRequest);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function MssFragmentInfoController(config){config=config||{};var context=this.context;var instance=void 0,logger=void 0,fragmentModel=void 0,started=void 0,type=void 0,bufferTimeout=void 0,startTime=void 0,startFragmentTime=void 0,index=void 0;var streamProcessor=config.streamProcessor;var eventBus=config.eventBus;var metricsModel=config.metricsModel;var playbackController=config.playbackController;var ISOBoxer=config.ISOBoxer;var baseURLController=config.baseURLController;var debug=config.debug;var controllerType='MssFragmentInfoController';function setup(){logger=debug.getLogger(instance);}function initialize(){started=false;startTime=null;startFragmentTime=null;// Register to StreamProcessor as external controller
streamProcessor.registerExternalController(instance);type=streamProcessor.getType();fragmentModel=streamProcessor.getFragmentModel();}function doStart(){if(started===true){return;}logger.debug('Do start');eventBus.on(_MssEvents2.default.FRAGMENT_INFO_LOADING_COMPLETED,onFragmentInfoLoadedCompleted,instance);started=true;startTime=new Date().getTime();index=0;loadNextFragmentInfo();}function doStop(){if(!started){return;}logger.debug('Do stop');eventBus.off(_MssEvents2.default.FRAGMENT_INFO_LOADING_COMPLETED,onFragmentInfoLoadedCompleted,instance);// Stop buffering process
clearTimeout(bufferTimeout);started=false;startTime=null;startFragmentTime=null;}function reset(){doStop();streamProcessor.unregisterExternalController(instance);}function loadNextFragmentInfo(){// Check if running state
if(!started){return;}// Get last segment from SegmentTimeline
var representation=getCurrentRepresentation();var manifest=representation.adaptation.period.mpd.manifest;var adaptation=manifest.Period_asArray[representation.adaptation.period.index].AdaptationSet_asArray[representation.adaptation.index];var segments=adaptation.SegmentTemplate.SegmentTimeline.S_asArray;var segment=segments[segments.length-1];logger.debug('Last fragment time: '+segment.t/adaptation.SegmentTemplate.timescale);// Generate segment request
var request=getRequestForSegment(adaptation,representation,segment);// Send segment request
requestFragment.call(this,request);}function delayLoadNextFragmentInfo(delay){clearTimeout(bufferTimeout);bufferTimeout=setTimeout(function(){bufferTimeout=null;loadNextFragmentInfo();},delay*1000);}function getRequestForSegment(adaptation,representation,segment){var timescale=adaptation.SegmentTemplate.timescale;var request=new _FragmentRequest2.default();request.mediaType=type;request.type='FragmentInfoSegment';// request.range = segment.mediaRange;
request.startTime=segment.t/timescale;request.duration=segment.d/timescale;request.timescale=timescale;// request.availabilityStartTime = segment.availabilityStartTime;
// request.availabilityEndTime = segment.availabilityEndTime;
// request.wallStartTime = segment.wallStartTime;
request.quality=representation.index;request.index=index++;request.mediaInfo=streamProcessor.getMediaInfo();request.adaptationIndex=representation.adaptation.index;request.representationId=representation.id;request.url=baseURLController.resolve(representation.path).url+adaptation.SegmentTemplate.media;request.url=request.url.replace('$Bandwidth$',representation.bandwidth);request.url=request.url.replace('$Time$',segment.tManifest?segment.tManifest:segment.t);request.url=request.url.replace('/Fragments(','/FragmentInfo(');return request;}function getCurrentRepresentation(){var representationController=streamProcessor.getRepresentationController();var representation=representationController.getCurrentRepresentation();return representation;}function requestFragment(request){logger.debug('Load fragment for time: '+request.startTime);if(streamProcessor.getFragmentModel().isFragmentLoadedOrPending(request)){// We may have reached end of timeline in case of start-over streams
logger.debug('No more fragments');return;}fragmentModel.executeRequest(request);}function onFragmentInfoLoadedCompleted(e){if(e.streamProcessor!==streamProcessor){return;}var request=e.fragmentInfo.request;if(!e.fragmentInfo.response){logger.error('Load error',request.url);return;}var deltaFragmentTime=void 0,deltaTime=void 0;logger.debug('FragmentInfo loaded: ',request.url);if(!startFragmentTime){startFragmentTime=request.startTime;}try{// Process FramgentInfo in order to update segment timeline (DVR window)
var mssFragmentMoofProcessor=(0,_MssFragmentMoofProcessor2.default)(context).create({metricsModel:metricsModel,playbackController:playbackController,ISOBoxer:ISOBoxer,eventBus:eventBus,debug:debug});mssFragmentMoofProcessor.updateSegmentList(e.fragmentInfo,streamProcessor);deltaTime=(new Date().getTime()-startTime)/1000;deltaFragmentTime=request.startTime+request.duration-startFragmentTime;delayLoadNextFragmentInfo(Math.max(0,deltaFragmentTime-deltaTime));}catch(e){logger.fatal('Internal error while processing fragment info segment ');}}function getType(){return type;}instance={initialize:initialize,controllerType:controllerType,start:doStart,getType:getType,reset:reset};setup();return instance;}/**
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
 */MssFragmentInfoController.__dashjs_factory_name='MssFragmentInfoController';exports.default=dashjs.FactoryMaker.getClassFactory(MssFragmentInfoController);/* jshint ignore:line */
//# sourceMappingURL=MssFragmentInfoController.js.map
