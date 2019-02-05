'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _Constants=require('../../streaming/constants/Constants');var _Constants2=_interopRequireDefault(_Constants);var _Errors=require('../../core/errors/Errors');var _Errors2=_interopRequireDefault(_Errors);var _DashConstants=require('../constants/DashConstants');var _DashConstants2=_interopRequireDefault(_DashConstants);var _DashJSError=require('../../streaming/vo/DashJSError');var _DashJSError2=_interopRequireDefault(_DashJSError);var _EventBus=require('../../core/EventBus');var _EventBus2=_interopRequireDefault(_EventBus);var _Events=require('../../core/events/Events');var _Events2=_interopRequireDefault(_Events);var _FactoryMaker=require('../../core/FactoryMaker');var _FactoryMaker2=_interopRequireDefault(_FactoryMaker);var _Representation=require('../vo/Representation');var _Representation2=_interopRequireDefault(_Representation);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}/**
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
 */function RepresentationController(){var context=this.context;var eventBus=(0,_EventBus2.default)(context).getInstance();var instance=void 0,realAdaptation=void 0,realAdaptationIndex=void 0,updating=void 0,voAvailableRepresentations=void 0,currentVoRepresentation=void 0,abrController=void 0,indexHandler=void 0,playbackController=void 0,metricsModel=void 0,domStorage=void 0,timelineConverter=void 0,dashManifestModel=void 0,dashMetrics=void 0,streamProcessor=void 0,manifestModel=void 0;function setup(){resetInitialSettings();eventBus.on(_Events2.default.QUALITY_CHANGE_REQUESTED,onQualityChanged,instance);eventBus.on(_Events2.default.REPRESENTATION_UPDATED,onRepresentationUpdated,instance);eventBus.on(_Events2.default.WALLCLOCK_TIME_UPDATED,onWallclockTimeUpdated,instance);eventBus.on(_Events2.default.BUFFER_LEVEL_UPDATED,onBufferLevelUpdated,instance);eventBus.on(_Events2.default.MANIFEST_VALIDITY_CHANGED,onManifestValidityChanged,instance);}function setConfig(config){// allow the abrController created in setup to be overidden
if(config.abrController){abrController=config.abrController;}if(config.domStorage){domStorage=config.domStorage;}if(config.metricsModel){metricsModel=config.metricsModel;}if(config.dashMetrics){dashMetrics=config.dashMetrics;}if(config.dashManifestModel){dashManifestModel=config.dashManifestModel;}if(config.playbackController){playbackController=config.playbackController;}if(config.timelineConverter){timelineConverter=config.timelineConverter;}if(config.manifestModel){manifestModel=config.manifestModel;}if(config.streamProcessor){streamProcessor=config.streamProcessor;}}function initialize(){indexHandler=streamProcessor.getIndexHandler();}function getStreamProcessor(){return streamProcessor;}function getData(){return realAdaptation;}function getDataIndex(){return realAdaptationIndex;}function isUpdating(){return updating;}function getCurrentRepresentation(){return currentVoRepresentation;}function resetInitialSettings(){realAdaptation=null;realAdaptationIndex=-1;updating=true;voAvailableRepresentations=[];abrController=null;playbackController=null;metricsModel=null;domStorage=null;timelineConverter=null;dashManifestModel=null;dashMetrics=null;}function reset(){eventBus.off(_Events2.default.QUALITY_CHANGE_REQUESTED,onQualityChanged,instance);eventBus.off(_Events2.default.REPRESENTATION_UPDATED,onRepresentationUpdated,instance);eventBus.off(_Events2.default.WALLCLOCK_TIME_UPDATED,onWallclockTimeUpdated,instance);eventBus.off(_Events2.default.BUFFER_LEVEL_UPDATED,onBufferLevelUpdated,instance);eventBus.off(_Events2.default.MANIFEST_VALIDITY_CHANGED,onManifestValidityChanged,instance);resetInitialSettings();}function updateData(newRealAdaptation,voAdaptation,type){var streamInfo=streamProcessor.getStreamInfo();var maxQuality=abrController.getTopQualityIndexFor(type,streamInfo.id);var minIdx=abrController.getMinAllowedIndexFor(type);var quality=void 0,averageThroughput=void 0;var bitrate=null;updating=true;eventBus.trigger(_Events2.default.DATA_UPDATE_STARTED,{sender:this});voAvailableRepresentations=updateRepresentations(voAdaptation);if((realAdaptation===null||realAdaptation.id!=newRealAdaptation.id)&&type!==_Constants2.default.FRAGMENTED_TEXT){averageThroughput=abrController.getThroughputHistory().getAverageThroughput(type);bitrate=averageThroughput||abrController.getInitialBitrateFor(type,streamInfo);quality=abrController.getQualityForBitrate(streamProcessor.getMediaInfo(),bitrate);}else{quality=abrController.getQualityFor(type,streamInfo);}if(minIdx!==undefined&&quality<minIdx){quality=minIdx;}if(quality>maxQuality){quality=maxQuality;}currentVoRepresentation=getRepresentationForQuality(quality);realAdaptation=newRealAdaptation;if(type!==_Constants2.default.VIDEO&&type!==_Constants2.default.AUDIO&&type!==_Constants2.default.FRAGMENTED_TEXT){updating=false;eventBus.trigger(_Events2.default.DATA_UPDATE_COMPLETED,{sender:this,data:realAdaptation,currentRepresentation:currentVoRepresentation});return;}for(var i=0;i<voAvailableRepresentations.length;i++){indexHandler.updateRepresentation(voAvailableRepresentations[i],true);}}function addRepresentationSwitch(){var now=new Date();var currentRepresentation=getCurrentRepresentation();var currentVideoTimeMs=playbackController.getTime()*1000;metricsModel.addRepresentationSwitch(currentRepresentation.adaptation.type,now,currentVideoTimeMs,currentRepresentation.id);}function addDVRMetric(){var streamInfo=streamProcessor.getStreamInfo();var manifestInfo=streamInfo?streamInfo.manifestInfo:null;var isDynamic=manifestInfo?manifestInfo.isDynamic:null;var range=timelineConverter.calcSegmentAvailabilityRange(currentVoRepresentation,isDynamic);metricsModel.addDVRInfo(streamProcessor.getType(),playbackController.getTime(),manifestInfo,range);}function getRepresentationForQuality(quality){return quality===null||quality===undefined||quality>=voAvailableRepresentations.length?null:voAvailableRepresentations[quality];}function getQualityForRepresentation(voRepresentation){return voAvailableRepresentations.indexOf(voRepresentation);}function isAllRepresentationsUpdated(){for(var i=0,ln=voAvailableRepresentations.length;i<ln;i++){var segmentInfoType=voAvailableRepresentations[i].segmentInfoType;if(voAvailableRepresentations[i].segmentAvailabilityRange===null||!_Representation2.default.hasInitialization(voAvailableRepresentations[i])||(segmentInfoType===_DashConstants2.default.SEGMENT_BASE||segmentInfoType===_DashConstants2.default.BASE_URL)&&!voAvailableRepresentations[i].segments){return false;}}return true;}function updateRepresentations(voAdaptation){var voReps=void 0;realAdaptationIndex=dashManifestModel.getIndexForAdaptation(realAdaptation,voAdaptation.period.mpd.manifest,voAdaptation.period.index);voReps=dashManifestModel.getRepresentationsForAdaptation(voAdaptation);return voReps;}function updateAvailabilityWindow(isDynamic){var voRepresentation=void 0;for(var i=0,ln=voAvailableRepresentations.length;i<ln;i++){voRepresentation=voAvailableRepresentations[i];voRepresentation.segmentAvailabilityRange=timelineConverter.calcSegmentAvailabilityRange(voRepresentation,isDynamic);}}function resetAvailabilityWindow(){voAvailableRepresentations.forEach(function(rep){rep.segmentAvailabilityRange=null;});}function postponeUpdate(postponeTimePeriod){var delay=postponeTimePeriod;var update=function update(){if(isUpdating())return;updating=true;eventBus.trigger(_Events2.default.DATA_UPDATE_STARTED,{sender:instance});// clear the segmentAvailabilityRange for all reps.
// this ensures all are updated before the live edge search starts
resetAvailabilityWindow();for(var i=0;i<voAvailableRepresentations.length;i++){indexHandler.updateRepresentation(voAvailableRepresentations[i],true);}};updating=false;eventBus.trigger(_Events2.default.AST_IN_FUTURE,{delay:delay});setTimeout(update,delay);}function onRepresentationUpdated(e){if(e.sender.getStreamProcessor()!==streamProcessor||!isUpdating())return;var r=e.representation;var streamMetrics=metricsModel.getMetricsFor(_Constants2.default.STREAM);var metrics=metricsModel.getMetricsFor(getCurrentRepresentation().adaptation.type);var manifestUpdateInfo=dashMetrics.getCurrentManifestUpdate(streamMetrics);var alreadyAdded=false;var postponeTimePeriod=0;var repInfo=void 0,err=void 0,repSwitch=void 0;if(r.adaptation.period.mpd.manifest.type===_DashConstants2.default.DYNAMIC&&!r.adaptation.period.mpd.manifest.ignorePostponeTimePeriod){var segmentAvailabilityTimePeriod=r.segmentAvailabilityRange.end-r.segmentAvailabilityRange.start;// We must put things to sleep unless till e.g. the startTime calculation in ScheduleController.onLiveEdgeSearchCompleted fall after the segmentAvailabilityRange.start
var liveDelay=playbackController.computeLiveDelay(currentVoRepresentation.segmentDuration,streamProcessor.getStreamInfo().manifestInfo.DVRWindowSize);postponeTimePeriod=(liveDelay-segmentAvailabilityTimePeriod)*1000;}if(postponeTimePeriod>0){addDVRMetric();postponeUpdate(postponeTimePeriod);err=new _DashJSError2.default(_Errors2.default.SEGMENTS_UPDATE_FAILED_ERROR_CODE,_Errors2.default.SEGMENTS_UPDATE_FAILED_ERROR_MESSAGE);eventBus.trigger(_Events2.default.DATA_UPDATE_COMPLETED,{sender:this,data:realAdaptation,currentRepresentation:currentVoRepresentation,error:err});return;}if(manifestUpdateInfo){for(var i=0;i<manifestUpdateInfo.representationInfo.length;i++){repInfo=manifestUpdateInfo.representationInfo[i];if(repInfo.index===r.index&&repInfo.mediaType===streamProcessor.getType()){alreadyAdded=true;break;}}if(!alreadyAdded){metricsModel.addManifestUpdateRepresentationInfo(manifestUpdateInfo,r.id,r.index,r.adaptation.period.index,streamProcessor.getType(),r.presentationTimeOffset,r.startNumber,r.segmentInfoType);}}if(isAllRepresentationsUpdated()){updating=false;abrController.setPlaybackQuality(streamProcessor.getType(),streamProcessor.getStreamInfo(),getQualityForRepresentation(currentVoRepresentation));metricsModel.updateManifestUpdateInfo(manifestUpdateInfo,{latency:currentVoRepresentation.segmentAvailabilityRange.end-playbackController.getTime()});repSwitch=dashMetrics.getCurrentRepresentationSwitch(metrics);if(!repSwitch){addRepresentationSwitch();}eventBus.trigger(_Events2.default.DATA_UPDATE_COMPLETED,{sender:this,data:realAdaptation,currentRepresentation:currentVoRepresentation});}}function onWallclockTimeUpdated(e){if(e.isDynamic){updateAvailabilityWindow(e.isDynamic);}}function onBufferLevelUpdated(e){if(e.sender.getStreamProcessor()!==streamProcessor)return;var manifest=manifestModel.getValue();if(!manifest.doNotUpdateDVRWindowOnBufferUpdated){addDVRMetric();}}function onQualityChanged(e){if(e.mediaType!==streamProcessor.getType()||streamProcessor.getStreamInfo().id!==e.streamInfo.id)return;if(e.oldQuality!==e.newQuality){currentVoRepresentation=getRepresentationForQuality(e.newQuality);var bitrate=abrController.getThroughputHistory().getAverageThroughput(e.mediaType);if(!isNaN(bitrate)){domStorage.setSavedBitrateSettings(e.mediaType,bitrate);}addRepresentationSwitch();}}function onManifestValidityChanged(e){if(e.newDuration){var representation=getCurrentRepresentation();if(representation&&representation.adaptation.period){var period=representation.adaptation.period;period.duration=e.newDuration;}}}instance={initialize:initialize,setConfig:setConfig,getData:getData,getDataIndex:getDataIndex,isUpdating:isUpdating,updateData:updateData,getStreamProcessor:getStreamProcessor,getCurrentRepresentation:getCurrentRepresentation,getRepresentationForQuality:getRepresentationForQuality,reset:reset};setup();return instance;}RepresentationController.__dashjs_factory_name='RepresentationController';exports.default=_FactoryMaker2.default.getClassFactory(RepresentationController);
//# sourceMappingURL=RepresentationController.js.map
