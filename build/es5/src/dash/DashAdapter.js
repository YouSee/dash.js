'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _Constants=require('../streaming/constants/Constants');var _Constants2=_interopRequireDefault(_Constants);var _DashConstants=require('./constants/DashConstants');var _DashConstants2=_interopRequireDefault(_DashConstants);var _RepresentationInfo=require('../streaming/vo/RepresentationInfo');var _RepresentationInfo2=_interopRequireDefault(_RepresentationInfo);var _MediaInfo=require('../streaming/vo/MediaInfo');var _MediaInfo2=_interopRequireDefault(_MediaInfo);var _StreamInfo=require('../streaming/vo/StreamInfo');var _StreamInfo2=_interopRequireDefault(_StreamInfo);var _ManifestInfo=require('../streaming/vo/ManifestInfo');var _ManifestInfo2=_interopRequireDefault(_ManifestInfo);var _Event=require('./vo/Event');var _Event2=_interopRequireDefault(_Event);var _FactoryMaker=require('../core/FactoryMaker');var _FactoryMaker2=_interopRequireDefault(_FactoryMaker);var _cea608Parser=require('../../externals/cea608-parser');var _cea608Parser2=_interopRequireDefault(_cea608Parser);var _SupervisorTools=require('../streaming/utils/SupervisorTools');function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}/**
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
 */function DashAdapter(){var instance=void 0,dashManifestModel=void 0,voPeriods=void 0,voAdaptations=void 0,currentMediaInfo=void 0;function setup(){reset();}function setConfig(config){if(!config)return;if(config.dashManifestModel){dashManifestModel=config.dashManifestModel;}}function getRepresentationForRepresentationInfo(representationInfo,representationController){return representationController&&representationInfo?representationController.getRepresentationForQuality(representationInfo.quality):null;}function getAdaptationForMediaInfo(mediaInfo){if(!mediaInfo||!mediaInfo.streamInfo||mediaInfo.streamInfo.id===undefined||!voAdaptations[mediaInfo.streamInfo.id])return null;return voAdaptations[mediaInfo.streamInfo.id][mediaInfo.index];}function getPeriodForStreamInfo(streamInfo,voPeriodsArray){var ln=voPeriodsArray.length;for(var i=0;i<ln;i++){var voPeriod=voPeriodsArray[i];if(streamInfo.id===voPeriod.id)return voPeriod;}return null;}function convertRepresentationToRepresentationInfo(voRepresentation){var representationInfo=new _RepresentationInfo2.default();var realAdaptation=voRepresentation.adaptation.period.mpd.manifest.Period_asArray[voRepresentation.adaptation.period.index].AdaptationSet_asArray[voRepresentation.adaptation.index];var realRepresentation=dashManifestModel.getRepresentationFor(voRepresentation.index,realAdaptation);representationInfo.id=voRepresentation.id;representationInfo.quality=voRepresentation.index;representationInfo.bandwidth=dashManifestModel.getBandwidth(realRepresentation);representationInfo.DVRWindow=voRepresentation.segmentAvailabilityRange;representationInfo.fragmentDuration=voRepresentation.segmentDuration||(voRepresentation.segments&&voRepresentation.segments.length>0?voRepresentation.segments[0].duration:NaN);representationInfo.MSETimeOffset=voRepresentation.MSETimeOffset;representationInfo.useCalculatedLiveEdgeTime=voRepresentation.useCalculatedLiveEdgeTime;representationInfo.mediaInfo=convertAdaptationToMediaInfo(voRepresentation.adaptation);return representationInfo;}function convertAdaptationToMediaInfo(adaptation){var mediaInfo=new _MediaInfo2.default();var realAdaptation=adaptation.period.mpd.manifest.Period_asArray[adaptation.period.index].AdaptationSet_asArray[adaptation.index];var viewpoint=void 0;mediaInfo.id=adaptation.id;mediaInfo.index=adaptation.index;mediaInfo.type=adaptation.type;mediaInfo.streamInfo=convertPeriodToStreamInfo(adaptation.period);mediaInfo.representationCount=dashManifestModel.getRepresentationCount(realAdaptation);mediaInfo.lang=dashManifestModel.getLanguageForAdaptation(realAdaptation);viewpoint=dashManifestModel.getViewpointForAdaptation(realAdaptation);mediaInfo.viewpoint=viewpoint?viewpoint.value:undefined;mediaInfo.accessibility=dashManifestModel.getAccessibilityForAdaptation(realAdaptation).map(function(accessibility){var accessibilityValue=accessibility.value;var accessibilityData=accessibilityValue;if(accessibility.schemeIdUri&&accessibility.schemeIdUri.search('cea-608')>=0&&typeof _cea608Parser2.default!=='undefined'){if(accessibilityValue){accessibilityData='cea-608:'+accessibilityValue;}else{accessibilityData='cea-608';}mediaInfo.embeddedCaptions=true;}return accessibilityData;});mediaInfo.audioChannelConfiguration=dashManifestModel.getAudioChannelConfigurationForAdaptation(realAdaptation).map(function(audioChannelConfiguration){return audioChannelConfiguration.value;});mediaInfo.roles=dashManifestModel.getRolesForAdaptation(realAdaptation).map(function(role){return role.value;});mediaInfo.codec=dashManifestModel.getCodec(realAdaptation);mediaInfo.mimeType=dashManifestModel.getMimeType(realAdaptation);mediaInfo.contentProtection=dashManifestModel.getContentProtectionData(realAdaptation);mediaInfo.bitrateList=dashManifestModel.getBitrateListForAdaptation(realAdaptation);if(mediaInfo.contentProtection){mediaInfo.contentProtection.forEach(function(item){item.KID=dashManifestModel.getKID(item);});}mediaInfo.isText=dashManifestModel.getIsTextTrack(mediaInfo.mimeType);return mediaInfo;}function convertVideoInfoToEmbeddedTextInfo(mediaInfo,channel,lang){mediaInfo.id=channel;// CC1, CC2, CC3, or CC4
mediaInfo.index=100+parseInt(channel.substring(2,3));mediaInfo.type=_Constants2.default.EMBEDDED_TEXT;mediaInfo.codec='cea-608-in-SEI';mediaInfo.isText=true;mediaInfo.isEmbedded=true;mediaInfo.lang=lang;mediaInfo.roles=['caption'];}function convertVideoInfoToThumbnailInfo(mediaInfo){mediaInfo.type=_Constants2.default.IMAGE;}function convertPeriodToStreamInfo(period){var streamInfo=new _StreamInfo2.default();var THRESHOLD=1;streamInfo.id=period.id;streamInfo.index=period.index;streamInfo.start=period.start;streamInfo.duration=period.duration;streamInfo.manifestInfo=convertMpdToManifestInfo(period.mpd);streamInfo.isLast=period.mpd.manifest.Period_asArray.length===1||Math.abs(streamInfo.start+streamInfo.duration-streamInfo.manifestInfo.duration)<THRESHOLD;return streamInfo;}function convertMpdToManifestInfo(mpd){var manifestInfo=new _ManifestInfo2.default();manifestInfo.DVRWindowSize=mpd.timeShiftBufferDepth;manifestInfo.loadedTime=mpd.manifest.loadedTime;manifestInfo.availableFrom=mpd.availabilityStartTime;manifestInfo.minBufferTime=mpd.manifest.minBufferTime;manifestInfo.maxFragmentDuration=mpd.maxSegmentDuration;manifestInfo.duration=dashManifestModel.getDuration(mpd.manifest);manifestInfo.isDynamic=dashManifestModel.getIsDynamic(mpd.manifest);return manifestInfo;}function getMediaInfoForType(streamInfo,type){if(voPeriods.length===0){return null;}var manifest=voPeriods[0].mpd.manifest;var realAdaptation=getAdaptationForType(manifest,streamInfo.index,type,streamInfo);if(!realAdaptation)return null;var selectedVoPeriod=getPeriodForStreamInfo(streamInfo,voPeriods);var periodId=selectedVoPeriod.id;var idx=dashManifestModel.getIndexForAdaptation(realAdaptation,manifest,streamInfo.index);voAdaptations[periodId]=voAdaptations[periodId]||dashManifestModel.getAdaptationsForPeriod(selectedVoPeriod);return convertAdaptationToMediaInfo(voAdaptations[periodId][idx]);}function getIsMain(adaptation){return dashManifestModel.getRolesForAdaptation(adaptation).filter(function(role){return role.value===_DashConstants2.default.MAIN;})[0];}function getAdaptationForType(manifest,periodIndex,type,streamInfo){var adaptations=dashManifestModel.getAdaptationsForType(manifest,periodIndex,type);if(!adaptations||adaptations.length===0)return null;if(adaptations.length>1&&streamInfo){var allMediaInfoForType=getAllMediaInfoForType(streamInfo,type);if(currentMediaInfo[streamInfo.id]&&currentMediaInfo[streamInfo.id][type]){for(var i=0,ln=adaptations.length;i<ln;i++){if(currentMediaInfo[streamInfo.id][type].isMediaInfoEqual(allMediaInfoForType[i])){return adaptations[i];}}}for(var _i=0,_ln=adaptations.length;_i<_ln;_i++){if(getIsMain(adaptations[_i])){return adaptations[_i];}}}return adaptations[0];}function getAllMediaInfoForType(streamInfo,type,externalManifest){var voLocalPeriods=voPeriods;var manifest=externalManifest;var mediaArr=[];var data=void 0,media=void 0,idx=void 0,i=void 0,j=void 0,ln=void 0;if(manifest){checkSetConfigCall();var mpd=dashManifestModel.getMpd(manifest);voLocalPeriods=dashManifestModel.getRegularPeriods(mpd);}else{if(voPeriods.length>0){manifest=voPeriods[0].mpd.manifest;}else{return mediaArr;}}var selectedVoPeriod=getPeriodForStreamInfo(streamInfo,voLocalPeriods);var periodId=selectedVoPeriod.id;var adaptationsForType=dashManifestModel.getAdaptationsForType(manifest,streamInfo.index,type!==_Constants2.default.EMBEDDED_TEXT?type:_Constants2.default.VIDEO);if(!adaptationsForType)return mediaArr;voAdaptations[periodId]=voAdaptations[periodId]||dashManifestModel.getAdaptationsForPeriod(selectedVoPeriod);for(i=0,ln=adaptationsForType.length;i<ln;i++){data=adaptationsForType[i];idx=dashManifestModel.getIndexForAdaptation(data,manifest,streamInfo.index);media=convertAdaptationToMediaInfo(voAdaptations[periodId][idx]);if(type===_Constants2.default.EMBEDDED_TEXT){var accessibilityLength=media.accessibility.length;for(j=0;j<accessibilityLength;j++){if(!media){continue;}var accessibility=media.accessibility[j];if(accessibility.indexOf('cea-608:')===0){var value=accessibility.substring(8);var parts=value.split(';');if(parts[0].substring(0,2)==='CC'){for(j=0;j<parts.length;j++){if(!media){media=convertAdaptationToMediaInfo.call(this,voAdaptations[periodId][idx]);}convertVideoInfoToEmbeddedTextInfo(media,parts[j].substring(0,3),parts[j].substring(4));mediaArr.push(media);media=null;}}else{for(j=0;j<parts.length;j++){// Only languages for CC1, CC2, ...
if(!media){media=convertAdaptationToMediaInfo.call(this,voAdaptations[periodId][idx]);}convertVideoInfoToEmbeddedTextInfo(media,'CC'+(j+1),parts[j]);mediaArr.push(media);media=null;}}}else if(accessibility.indexOf('cea-608')===0){// Nothing known. We interpret it as CC1=eng
convertVideoInfoToEmbeddedTextInfo(media,_Constants2.default.CC1,'eng');mediaArr.push(media);media=null;}}}else if(type===_Constants2.default.IMAGE){convertVideoInfoToThumbnailInfo(media);mediaArr.push(media);media=null;}else if(media){mediaArr.push(media);}}return mediaArr;}function checkSetConfigCall(){if(!dashManifestModel||!dashManifestModel.hasOwnProperty('getMpd')||!dashManifestModel.hasOwnProperty('getRegularPeriods')){throw new Error('setConfig function has to be called previously');}}function updatePeriods(newManifest){if(!newManifest)return null;checkSetConfigCall();var mpd=dashManifestModel.getMpd(newManifest);voPeriods=dashManifestModel.getRegularPeriods(mpd);voAdaptations={};}function getStreamsInfo(externalManifest,maxStreamsInfo){var streams=[];var voLocalPeriods=voPeriods;//if manifest is defined, getStreamsInfo is for an outside manifest, not the current one
if(externalManifest){checkSetConfigCall();var mpd=dashManifestModel.getMpd(externalManifest);voLocalPeriods=dashManifestModel.getRegularPeriods(mpd);}if(!maxStreamsInfo){maxStreamsInfo=voLocalPeriods.length;}for(var i=0;i<maxStreamsInfo;i++){streams.push(convertPeriodToStreamInfo(voLocalPeriods[i]));}return streams;}function checkStreamProcessor(streamProcessor){if(!streamProcessor||!streamProcessor.hasOwnProperty('getRepresentationController')||!streamProcessor.hasOwnProperty('getIndexHandler')||!streamProcessor.hasOwnProperty('getMediaInfo')||!streamProcessor.hasOwnProperty('getType')||!streamProcessor.hasOwnProperty('getStreamInfo')){throw new Error('streamProcessor parameter is missing or malformed!');}}function checkRepresentationController(representationController){if(!representationController||!representationController.hasOwnProperty('getRepresentationForQuality')||!representationController.hasOwnProperty('getCurrentRepresentation')){throw new Error('representationController parameter is missing or malformed!');}}function getInitRequest(streamProcessor,quality){var representationController=void 0,representation=void 0,indexHandler=void 0;checkStreamProcessor(streamProcessor);(0,_SupervisorTools.checkInteger)(quality);representationController=streamProcessor.getRepresentationController();indexHandler=streamProcessor.getIndexHandler();representation=representationController?representationController.getRepresentationForQuality(quality):null;return indexHandler?indexHandler.getInitRequest(representation):null;}function getFragmentRequest(streamProcessor,representationInfo,time,options){var representationController=void 0,representation=void 0,indexHandler=void 0;var fragRequest=null;checkStreamProcessor(streamProcessor);representationController=streamProcessor.getRepresentationController();representation=getRepresentationForRepresentationInfo(representationInfo,representationController);indexHandler=streamProcessor.getIndexHandler();if(indexHandler){//if time and options are undefined, it means the next segment is requested
//otherwise, the segment at this specific time is requested.
if(time!==undefined&&options!==undefined){fragRequest=indexHandler.getSegmentRequestForTime(representation,time,options);}else{fragRequest=indexHandler.getNextSegmentRequest(representation);}}return fragRequest;}function getIndexHandlerTime(streamProcessor){checkStreamProcessor(streamProcessor);var indexHandler=streamProcessor.getIndexHandler();return indexHandler?indexHandler.getCurrentTime():NaN;}function setIndexHandlerTime(streamProcessor,value){checkStreamProcessor(streamProcessor);var indexHandler=streamProcessor.getIndexHandler();if(indexHandler){indexHandler.setCurrentTime(value);}}function resetIndexHandler(streamProcessor){checkStreamProcessor(streamProcessor);var indexHandler=streamProcessor.getIndexHandler();if(indexHandler){indexHandler.resetIndex();}}function updateData(streamProcessor){checkStreamProcessor(streamProcessor);var selectedVoPeriod=getPeriodForStreamInfo(streamProcessor.getStreamInfo(),voPeriods);var mediaInfo=streamProcessor.getMediaInfo();var voAdaptation=getAdaptationForMediaInfo(mediaInfo);var type=streamProcessor.getType();var id=void 0,realAdaptation=void 0;id=mediaInfo?mediaInfo.id:null;if(voPeriods.length>0){realAdaptation=id?dashManifestModel.getAdaptationForId(id,voPeriods[0].mpd.manifest,selectedVoPeriod.index):dashManifestModel.getAdaptationForIndex(mediaInfo.index,voPeriods[0].mpd.manifest,selectedVoPeriod.index);streamProcessor.getRepresentationController().updateData(realAdaptation,voAdaptation,type);}}/**
     * Get a specific voRepresentation. If quality parameter is defined, this function will return the voRepresentation for this quality.
     * Otherwise, this function will return the current voRepresentation used by the representationController.
     * @param {RepresentationController} representationController - RepresentationController reference
     * @param {number} quality - quality index of the voRepresentaion expected.
     */function getRepresentationInfo(representationController,quality){checkRepresentationController(representationController);var voRepresentation=void 0;if(quality!==undefined){(0,_SupervisorTools.checkInteger)(quality);voRepresentation=representationController.getRepresentationForQuality(quality);}else{voRepresentation=representationController.getCurrentRepresentation();}return voRepresentation?convertRepresentationToRepresentationInfo(voRepresentation):null;}function getEvent(eventBox,eventStreams,startTime){if(!eventBox||!eventStreams){return null;}var event=new _Event2.default();var schemeIdUri=eventBox.scheme_id_uri;var value=eventBox.value;var timescale=eventBox.timescale;var presentationTimeDelta=eventBox.presentation_time_delta;var duration=eventBox.event_duration;var id=eventBox.id;var messageData=eventBox.message_data;var presentationTime=startTime*timescale+presentationTimeDelta;if(!eventStreams[schemeIdUri+'/'+value])return null;event.eventStream=eventStreams[schemeIdUri+'/'+value];event.eventStream.value=value;event.eventStream.timescale=timescale;event.duration=duration;event.id=id;event.presentationTime=presentationTime;event.messageData=messageData;event.presentationTimeDelta=presentationTimeDelta;return event;}function getEventsFor(info,streamProcessor){var events=[];if(voPeriods.length===0){return events;}var manifest=voPeriods[0].mpd.manifest;if(info instanceof _StreamInfo2.default){events=dashManifestModel.getEventsForPeriod(getPeriodForStreamInfo(info,voPeriods));}else if(info instanceof _MediaInfo2.default){events=dashManifestModel.getEventStreamForAdaptationSet(manifest,getAdaptationForMediaInfo(info));}else if(info instanceof _RepresentationInfo2.default){events=dashManifestModel.getEventStreamForRepresentation(manifest,getRepresentationForRepresentationInfo(info,streamProcessor.getRepresentationController()));}return events;}function setCurrentMediaInfo(streamId,type,mediaInfo){currentMediaInfo[streamId]=currentMediaInfo[streamId]||{};currentMediaInfo[streamId][type]=currentMediaInfo[streamId][type]||{};currentMediaInfo[streamId][type]=mediaInfo;}function reset(){voPeriods=[];voAdaptations={};currentMediaInfo={};}instance={convertDataToRepresentationInfo:convertRepresentationToRepresentationInfo,getDataForMedia:getAdaptationForMediaInfo,getStreamsInfo:getStreamsInfo,getMediaInfoForType:getMediaInfoForType,getAllMediaInfoForType:getAllMediaInfoForType,getRepresentationInfo:getRepresentationInfo,getAdaptationForType:getAdaptationForType,updateData:updateData,getInitRequest:getInitRequest,getFragmentRequest:getFragmentRequest,getIndexHandlerTime:getIndexHandlerTime,setIndexHandlerTime:setIndexHandlerTime,getEventsFor:getEventsFor,getEvent:getEvent,setConfig:setConfig,updatePeriods:updatePeriods,reset:reset,resetIndexHandler:resetIndexHandler,setCurrentMediaInfo:setCurrentMediaInfo};setup();return instance;}DashAdapter.__dashjs_factory_name='DashAdapter';exports.default=_FactoryMaker2.default.getSingletonFactory(DashAdapter);
//# sourceMappingURL=DashAdapter.js.map
