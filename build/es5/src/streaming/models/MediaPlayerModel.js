'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _UTCTiming=require('../../dash/vo/UTCTiming');var _UTCTiming2=_interopRequireDefault(_UTCTiming);var _FactoryMaker=require('../../core/FactoryMaker');var _FactoryMaker2=_interopRequireDefault(_FactoryMaker);var _HTTPRequest=require('../vo/metrics/HTTPRequest');var _Constants=require('../constants/Constants');var _Constants2=_interopRequireDefault(_Constants);var _ABRRulesCollection=require('../rules/abr/ABRRulesCollection');var _ABRRulesCollection2=_interopRequireDefault(_ABRRulesCollection);var _SupervisorTools=require('../utils/SupervisorTools');function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _defineProperty(obj,key,value){if(key in obj){Object.defineProperty(obj,key,{value:value,enumerable:true,configurable:true,writable:true});}else{obj[key]=value;}return obj;}/**
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
 */var LIVE_DELAY_FRAGMENT_COUNT=4;var DEFAULT_LOCAL_STORAGE_BITRATE_EXPIRATION=360000;var DEFAULT_LOCAL_STORAGE_MEDIA_SETTINGS_EXPIRATION=360000;var BANDWIDTH_SAFETY_FACTOR=0.9;var ABANDON_LOAD_TIMEOUT=10000;var BUFFER_TO_KEEP=20;var BUFFER_AHEAD_TO_KEEP=80;var BUFFER_PRUNING_INTERVAL=10;var DEFAULT_MIN_BUFFER_TIME=12;var DEFAULT_MIN_BUFFER_TIME_FAST_SWITCH=20;var BUFFER_TIME_AT_TOP_QUALITY=30;var BUFFER_TIME_AT_TOP_QUALITY_LONG_FORM=60;var LONG_FORM_CONTENT_DURATION_THRESHOLD=600;var SEGMENT_OVERLAP_TOLERANCE_TIME=0.2;var SMALL_GAP_LIMIT=0.8;var MANIFEST_UPDATE_RETRY_INTERVAL=100;var CACHE_LOAD_THRESHOLD_VIDEO=50;var CACHE_LOAD_THRESHOLD_AUDIO=5;var FRAGMENT_RETRY_ATTEMPTS=3;var FRAGMENT_RETRY_INTERVAL=1000;var MANIFEST_RETRY_ATTEMPTS=3;var MANIFEST_RETRY_INTERVAL=500;var XLINK_RETRY_ATTEMPTS=1;var XLINK_RETRY_INTERVAL=500;var DEFAULT_LOW_LATENCY_LIVE_DELAY=3.0;var LOW_LATENCY_REDUCTION_FACTOR=10;var LOW_LATENCY_MULTIPLY_FACTOR=5;var LOW_LATENCY_CATCH_UP_MIN_DRIFT=0.02;var LOW_LATENCY_CATCH_UP_MAX_DRIFT=0;var LOW_LATENCY_CATCH_UP_PLAYBACK_RATE=0.5;//This value influences the startup time for live (in ms).
var WALLCLOCK_TIME_UPDATE_INTERVAL=50;var DEFAULT_XHR_WITH_CREDENTIALS=false;function MediaPlayerModel(){var instance=void 0,useManifestDateHeaderTimeSource=void 0,useSuggestedPresentationDelay=void 0,UTCTimingSources=void 0,liveDelayFragmentCount=void 0,liveDelay=void 0,scheduleWhilePaused=void 0,bufferToKeep=void 0,bufferAheadToKeep=void 0,bufferPruningInterval=void 0,lastBitrateCachingInfo=void 0,lastMediaSettingsCachingInfo=void 0,stableBufferTime=void 0,bufferTimeAtTopQuality=void 0,bufferTimeAtTopQualityLongForm=void 0,longFormContentDurationThreshold=void 0,segmentOverlapToleranceTime=void 0,bandwidthSafetyFactor=void 0,abandonLoadTimeout=void 0,retryAttempts=void 0,retryIntervals=void 0,wallclockTimeUpdateInterval=void 0,ABRStrategy=void 0,startLiveStreamOver=void 0,useDefaultABRRules=void 0,xhrWithCredentials=void 0,fastSwitchEnabled=void 0,customABRRule=void 0,movingAverageMethod=void 0,cacheLoadThresholds=void 0,jumpGaps=void 0,smallGapLimit=void 0,lowLatencyEnabled=void 0,manifestUpdateRetryInterval=void 0,keepProtectionMediaKeys=void 0,liveCatchUpMinDrift=void 0,liveCatchUpMaxDrift=void 0,liveCatchUpPlaybackRate=void 0;var DEFAULT_UTC_TIMING_SOURCE={scheme:'urn:mpeg:dash:utc:http-xsdate:2014',value:'http://time.akamai.com/?iso&ms'};function setup(){var _retryAttempts,_retryIntervals;UTCTimingSources=[];useSuggestedPresentationDelay=false;useManifestDateHeaderTimeSource=true;scheduleWhilePaused=true;ABRStrategy=_Constants2.default.ABR_STRATEGY_DYNAMIC;startLiveStreamOver=false;useDefaultABRRules=true;fastSwitchEnabled=false;lastBitrateCachingInfo={enabled:true,ttl:DEFAULT_LOCAL_STORAGE_BITRATE_EXPIRATION};lastMediaSettingsCachingInfo={enabled:true,ttl:DEFAULT_LOCAL_STORAGE_MEDIA_SETTINGS_EXPIRATION};liveDelayFragmentCount=LIVE_DELAY_FRAGMENT_COUNT;liveDelay=undefined;// Explicitly state that default is undefined
bufferToKeep=BUFFER_TO_KEEP;bufferAheadToKeep=BUFFER_AHEAD_TO_KEEP;bufferPruningInterval=BUFFER_PRUNING_INTERVAL;stableBufferTime=NaN;bufferTimeAtTopQuality=BUFFER_TIME_AT_TOP_QUALITY;bufferTimeAtTopQualityLongForm=BUFFER_TIME_AT_TOP_QUALITY_LONG_FORM;longFormContentDurationThreshold=LONG_FORM_CONTENT_DURATION_THRESHOLD;segmentOverlapToleranceTime=SEGMENT_OVERLAP_TOLERANCE_TIME;bandwidthSafetyFactor=BANDWIDTH_SAFETY_FACTOR;abandonLoadTimeout=ABANDON_LOAD_TIMEOUT;wallclockTimeUpdateInterval=WALLCLOCK_TIME_UPDATE_INTERVAL;jumpGaps=false;smallGapLimit=SMALL_GAP_LIMIT;manifestUpdateRetryInterval=MANIFEST_UPDATE_RETRY_INTERVAL;xhrWithCredentials={default:DEFAULT_XHR_WITH_CREDENTIALS};customABRRule=[];movingAverageMethod=_Constants2.default.MOVING_AVERAGE_SLIDING_WINDOW;lowLatencyEnabled=false;liveCatchUpMinDrift=LOW_LATENCY_CATCH_UP_MIN_DRIFT;liveCatchUpMaxDrift=LOW_LATENCY_CATCH_UP_MAX_DRIFT;liveCatchUpPlaybackRate=LOW_LATENCY_CATCH_UP_PLAYBACK_RATE;retryAttempts=(_retryAttempts={},_defineProperty(_retryAttempts,_HTTPRequest.HTTPRequest.MPD_TYPE,MANIFEST_RETRY_ATTEMPTS),_defineProperty(_retryAttempts,_HTTPRequest.HTTPRequest.XLINK_EXPANSION_TYPE,XLINK_RETRY_ATTEMPTS),_defineProperty(_retryAttempts,_HTTPRequest.HTTPRequest.MEDIA_SEGMENT_TYPE,FRAGMENT_RETRY_ATTEMPTS),_defineProperty(_retryAttempts,_HTTPRequest.HTTPRequest.INIT_SEGMENT_TYPE,FRAGMENT_RETRY_ATTEMPTS),_defineProperty(_retryAttempts,_HTTPRequest.HTTPRequest.BITSTREAM_SWITCHING_SEGMENT_TYPE,FRAGMENT_RETRY_ATTEMPTS),_defineProperty(_retryAttempts,_HTTPRequest.HTTPRequest.INDEX_SEGMENT_TYPE,FRAGMENT_RETRY_ATTEMPTS),_defineProperty(_retryAttempts,_HTTPRequest.HTTPRequest.OTHER_TYPE,FRAGMENT_RETRY_ATTEMPTS),_retryAttempts);retryIntervals=(_retryIntervals={},_defineProperty(_retryIntervals,_HTTPRequest.HTTPRequest.MPD_TYPE,MANIFEST_RETRY_INTERVAL),_defineProperty(_retryIntervals,_HTTPRequest.HTTPRequest.XLINK_EXPANSION_TYPE,XLINK_RETRY_INTERVAL),_defineProperty(_retryIntervals,_HTTPRequest.HTTPRequest.MEDIA_SEGMENT_TYPE,FRAGMENT_RETRY_INTERVAL),_defineProperty(_retryIntervals,_HTTPRequest.HTTPRequest.INIT_SEGMENT_TYPE,FRAGMENT_RETRY_INTERVAL),_defineProperty(_retryIntervals,_HTTPRequest.HTTPRequest.BITSTREAM_SWITCHING_SEGMENT_TYPE,FRAGMENT_RETRY_INTERVAL),_defineProperty(_retryIntervals,_HTTPRequest.HTTPRequest.INDEX_SEGMENT_TYPE,FRAGMENT_RETRY_INTERVAL),_defineProperty(_retryIntervals,_HTTPRequest.HTTPRequest.OTHER_TYPE,FRAGMENT_RETRY_INTERVAL),_retryIntervals);cacheLoadThresholds={};cacheLoadThresholds[_Constants2.default.VIDEO]=CACHE_LOAD_THRESHOLD_VIDEO;cacheLoadThresholds[_Constants2.default.AUDIO]=CACHE_LOAD_THRESHOLD_AUDIO;keepProtectionMediaKeys=false;}//TODO Should we use Object.define to have setters/getters? makes more readable code on other side.
function setABRStrategy(value){if(value===_Constants2.default.ABR_STRATEGY_DYNAMIC||value===_Constants2.default.ABR_STRATEGY_BOLA||value===_Constants2.default.ABR_STRATEGY_THROUGHPUT){ABRStrategy=value;}else{throw _Constants2.default.BAD_ARGUMENT_ERROR;}}function getABRStrategy(){return ABRStrategy;}function setStartLiveStreamOver(value){startLiveStreamOver=value;}function getStartLiveStreamOver(){return startLiveStreamOver;}function setUseDefaultABRRules(value){(0,_SupervisorTools.checkParameterType)(value,'boolean');useDefaultABRRules=value;}function getUseDefaultABRRules(){return useDefaultABRRules;}function findABRCustomRuleIndex(rulename){var i=void 0;for(i=0;i<customABRRule.length;i++){if(customABRRule[i].rulename===rulename){return i;}}return-1;}function getABRCustomRules(){return customABRRule;}function addABRCustomRule(type,rulename,rule){if(typeof type!=='string'||type!==_ABRRulesCollection2.default.ABANDON_FRAGMENT_RULES&&type!==_ABRRulesCollection2.default.QUALITY_SWITCH_RULES||typeof rulename!=='string'){throw _Constants2.default.BAD_ARGUMENT_ERROR;}var index=findABRCustomRuleIndex(rulename);if(index===-1){// add rule
customABRRule.push({type:type,rulename:rulename,rule:rule});}else{// update rule
customABRRule[index].type=type;customABRRule[index].rule=rule;}}function removeABRCustomRule(rulename){if(rulename){var index=findABRCustomRuleIndex(rulename);//if no rulename custom rule has been found, do nothing
if(index!==-1){// remove rule
customABRRule.splice(index,1);}}else{//if no rulename is defined, remove all ABR custome rules
customABRRule=[];}}function setBandwidthSafetyFactor(value){(0,_SupervisorTools.checkParameterType)(value,'number');bandwidthSafetyFactor=value;}function getBandwidthSafetyFactor(){return bandwidthSafetyFactor;}function setAbandonLoadTimeout(value){(0,_SupervisorTools.checkParameterType)(value,'number');abandonLoadTimeout=value;}function getAbandonLoadTimeout(){return abandonLoadTimeout;}function setStableBufferTime(value){(0,_SupervisorTools.checkParameterType)(value,'number');stableBufferTime=value;}function getStableBufferTime(){if(getLowLatencyEnabled()){return getLiveDelay()*0.6;}return!isNaN(stableBufferTime)?stableBufferTime:fastSwitchEnabled?DEFAULT_MIN_BUFFER_TIME_FAST_SWITCH:DEFAULT_MIN_BUFFER_TIME;}function setBufferTimeAtTopQuality(value){(0,_SupervisorTools.checkParameterType)(value,'number');bufferTimeAtTopQuality=value;}function getBufferTimeAtTopQuality(){return bufferTimeAtTopQuality;}function setBufferTimeAtTopQualityLongForm(value){(0,_SupervisorTools.checkParameterType)(value,'number');bufferTimeAtTopQualityLongForm=value;}function getBufferTimeAtTopQualityLongForm(){return bufferTimeAtTopQualityLongForm;}function setLongFormContentDurationThreshold(value){(0,_SupervisorTools.checkParameterType)(value,'number');longFormContentDurationThreshold=value;}function getLongFormContentDurationThreshold(){return longFormContentDurationThreshold;}function setSegmentOverlapToleranceTime(value){(0,_SupervisorTools.checkParameterType)(value,'number');segmentOverlapToleranceTime=value;}function getSegmentOverlapToleranceTime(){return segmentOverlapToleranceTime;}function setCacheLoadThresholdForType(type,value){(0,_SupervisorTools.checkParameterType)(value,'number');(0,_SupervisorTools.checkIsVideoOrAudioType)(type);cacheLoadThresholds[type]=value;}function getCacheLoadThresholdForType(type){return cacheLoadThresholds[type];}function setBufferToKeep(value){(0,_SupervisorTools.checkParameterType)(value,'number');bufferToKeep=value;}function getBufferToKeep(){return bufferToKeep;}function setBufferAheadToKeep(value){(0,_SupervisorTools.checkParameterType)(value,'number');bufferAheadToKeep=value;}function getBufferAheadToKeep(){return bufferAheadToKeep;}function setLastBitrateCachingInfo(enable,ttl){if(typeof enable!=='boolean'||ttl!==undefined&&(typeof ttl!=='number'||isNaN(ttl))){throw _Constants2.default.BAD_ARGUMENT_ERROR;}lastBitrateCachingInfo.enabled=enable;if(ttl!==undefined){lastBitrateCachingInfo.ttl=ttl;}}function getLastBitrateCachingInfo(){return lastBitrateCachingInfo;}function setLastMediaSettingsCachingInfo(enable,ttl){if(typeof enable!=='boolean'||ttl!==undefined&&(typeof ttl!=='number'||isNaN(ttl))){throw _Constants2.default.BAD_ARGUMENT_ERROR;}lastMediaSettingsCachingInfo.enabled=enable;if(ttl!==undefined){lastMediaSettingsCachingInfo.ttl=ttl;}}function getLastMediaSettingsCachingInfo(){return lastMediaSettingsCachingInfo;}function setBufferPruningInterval(value){(0,_SupervisorTools.checkParameterType)(value,'number');bufferPruningInterval=value;}function getBufferPruningInterval(){return bufferPruningInterval;}function setRetryAttemptsForType(type,value){if(typeof value!=='number'||typeof type!=='string'||type!==_HTTPRequest.HTTPRequest.MPD_TYPE&&type!==_HTTPRequest.HTTPRequest.MEDIA_SEGMENT_TYPE){throw _Constants2.default.BAD_ARGUMENT_ERROR;}retryAttempts[type]=value;}function getRetryAttemptsForType(type){return getLowLatencyEnabled()?retryAttempts[type]*LOW_LATENCY_MULTIPLY_FACTOR:retryAttempts[type];}function setRetryIntervalForType(type,value){(0,_SupervisorTools.checkParameterType)(value,'number');retryIntervals[type]=value;}function getRetryIntervalForType(type){return getLowLatencyEnabled()?retryIntervals[type]/LOW_LATENCY_REDUCTION_FACTOR:retryIntervals[type];}function setWallclockTimeUpdateInterval(value){(0,_SupervisorTools.checkParameterType)(value,'number');wallclockTimeUpdateInterval=value;}function getWallclockTimeUpdateInterval(){return wallclockTimeUpdateInterval;}function setScheduleWhilePaused(value){(0,_SupervisorTools.checkParameterType)(value,'boolean');scheduleWhilePaused=value;}function getScheduleWhilePaused(){return scheduleWhilePaused;}function setLiveDelayFragmentCount(value){(0,_SupervisorTools.checkParameterType)(value,'number');liveDelayFragmentCount=value;}function getLiveDelayFragmentCount(){return liveDelayFragmentCount;}function setLiveDelay(value){if(value!==undefined){// undefined is the default value...
(0,_SupervisorTools.checkParameterType)(value,'number');}liveDelay=value;}function getLiveDelay(){if(lowLatencyEnabled){return liveDelay||DEFAULT_LOW_LATENCY_LIVE_DELAY;}return liveDelay;}function setUseManifestDateHeaderTimeSource(value){(0,_SupervisorTools.checkParameterType)(value,'boolean');useManifestDateHeaderTimeSource=value;}function getUseManifestDateHeaderTimeSource(){return useManifestDateHeaderTimeSource;}function setUseSuggestedPresentationDelay(value){(0,_SupervisorTools.checkParameterType)(value,'boolean');useSuggestedPresentationDelay=value;}function getUseSuggestedPresentationDelay(){return useSuggestedPresentationDelay;}function addUTCTimingSource(schemeIdUri,value){removeUTCTimingSource(schemeIdUri,value);//check if it already exists and remove if so.
var vo=new _UTCTiming2.default();vo.schemeIdUri=schemeIdUri;vo.value=value;UTCTimingSources.push(vo);}function getUTCTimingSources(){return UTCTimingSources;}function removeUTCTimingSource(schemeIdUri,value){(0,_SupervisorTools.checkParameterType)(schemeIdUri,'string');(0,_SupervisorTools.checkParameterType)(value,'string');UTCTimingSources.forEach(function(obj,idx){if(obj.schemeIdUri===schemeIdUri&&obj.value===value){UTCTimingSources.splice(idx,1);}});}function clearDefaultUTCTimingSources(){UTCTimingSources=[];}function restoreDefaultUTCTimingSources(){addUTCTimingSource(DEFAULT_UTC_TIMING_SOURCE.scheme,DEFAULT_UTC_TIMING_SOURCE.value);}function setXHRWithCredentialsForType(type,value){if(!type){Object.keys(xhrWithCredentials).forEach(function(key){setXHRWithCredentialsForType(key,value);});}else{xhrWithCredentials[type]=!!value;}}function getXHRWithCredentialsForType(type){var useCreds=xhrWithCredentials[type];return useCreds===undefined?xhrWithCredentials.default:useCreds;}function getFastSwitchEnabled(){return fastSwitchEnabled;}function setFastSwitchEnabled(value){(0,_SupervisorTools.checkParameterType)(value,'boolean');fastSwitchEnabled=value;}function setMovingAverageMethod(value){if(value===_Constants2.default.MOVING_AVERAGE_SLIDING_WINDOW||value===_Constants2.default.MOVING_AVERAGE_EWMA){movingAverageMethod=value;}else{throw _Constants2.default.BAD_ARGUMENT_ERROR;}}function getMovingAverageMethod(){return movingAverageMethod;}function setJumpGaps(value){(0,_SupervisorTools.checkParameterType)(value,'boolean');jumpGaps=value;}function getJumpGaps(){return jumpGaps;}function setSmallGapLimit(value){(0,_SupervisorTools.checkParameterType)(value,'number');smallGapLimit=value;}function getSmallGapLimit(){return smallGapLimit;}function getLowLatencyEnabled(){return lowLatencyEnabled;}function setLowLatencyEnabled(value){(0,_SupervisorTools.checkParameterType)(value,'boolean');lowLatencyEnabled=value;}function setCatchUpPlaybackRate(value){(0,_SupervisorTools.checkParameterType)(value,'number');(0,_SupervisorTools.checkRange)(value,0.0,0.5);liveCatchUpPlaybackRate=value;}function getCatchUpPlaybackRate(){return liveCatchUpPlaybackRate;}function setLowLatencyMinDrift(value){(0,_SupervisorTools.checkParameterType)(value,'number');liveCatchUpMinDrift=value;}function getLowLatencyMinDrift(){return liveCatchUpMinDrift;}function setLowLatencyMaxDriftBeforeSeeking(value){(0,_SupervisorTools.checkParameterType)(value,'number');liveCatchUpMaxDrift=value;}function getLowLatencyMaxDriftBeforeSeeking(){return liveCatchUpMaxDrift;}function setManifestUpdateRetryInterval(value){(0,_SupervisorTools.checkParameterType)(value,'number');manifestUpdateRetryInterval=value;}function getManifestUpdateRetryInterval(){return manifestUpdateRetryInterval;}function setKeepProtectionMediaKeys(value){(0,_SupervisorTools.checkParameterType)(value,'boolean');keepProtectionMediaKeys=value;}function getKeepProtectionMediaKeys(){return keepProtectionMediaKeys;}function getDefaultUtcTimingSource(){return DEFAULT_UTC_TIMING_SOURCE;}function reset(){//TODO need to figure out what props to persist across sessions and which to reset if any.
//setup();
}instance={setABRStrategy:setABRStrategy,getABRStrategy:getABRStrategy,setStartLiveStreamOver:setStartLiveStreamOver,getStartLiveStreamOver:getStartLiveStreamOver,setUseDefaultABRRules:setUseDefaultABRRules,getUseDefaultABRRules:getUseDefaultABRRules,getABRCustomRules:getABRCustomRules,addABRCustomRule:addABRCustomRule,removeABRCustomRule:removeABRCustomRule,setBandwidthSafetyFactor:setBandwidthSafetyFactor,getBandwidthSafetyFactor:getBandwidthSafetyFactor,setAbandonLoadTimeout:setAbandonLoadTimeout,getAbandonLoadTimeout:getAbandonLoadTimeout,setLastBitrateCachingInfo:setLastBitrateCachingInfo,getLastBitrateCachingInfo:getLastBitrateCachingInfo,setLastMediaSettingsCachingInfo:setLastMediaSettingsCachingInfo,getLastMediaSettingsCachingInfo:getLastMediaSettingsCachingInfo,setStableBufferTime:setStableBufferTime,getStableBufferTime:getStableBufferTime,setBufferTimeAtTopQuality:setBufferTimeAtTopQuality,getBufferTimeAtTopQuality:getBufferTimeAtTopQuality,setBufferTimeAtTopQualityLongForm:setBufferTimeAtTopQualityLongForm,getBufferTimeAtTopQualityLongForm:getBufferTimeAtTopQualityLongForm,setLongFormContentDurationThreshold:setLongFormContentDurationThreshold,getLongFormContentDurationThreshold:getLongFormContentDurationThreshold,setSegmentOverlapToleranceTime:setSegmentOverlapToleranceTime,getSegmentOverlapToleranceTime:getSegmentOverlapToleranceTime,getCacheLoadThresholdForType:getCacheLoadThresholdForType,setCacheLoadThresholdForType:setCacheLoadThresholdForType,setBufferToKeep:setBufferToKeep,getBufferToKeep:getBufferToKeep,setBufferAheadToKeep:setBufferAheadToKeep,getBufferAheadToKeep:getBufferAheadToKeep,setBufferPruningInterval:setBufferPruningInterval,getBufferPruningInterval:getBufferPruningInterval,setRetryAttemptsForType:setRetryAttemptsForType,getRetryAttemptsForType:getRetryAttemptsForType,setRetryIntervalForType:setRetryIntervalForType,getRetryIntervalForType:getRetryIntervalForType,setWallclockTimeUpdateInterval:setWallclockTimeUpdateInterval,getWallclockTimeUpdateInterval:getWallclockTimeUpdateInterval,setScheduleWhilePaused:setScheduleWhilePaused,getScheduleWhilePaused:getScheduleWhilePaused,getUseSuggestedPresentationDelay:getUseSuggestedPresentationDelay,setUseSuggestedPresentationDelay:setUseSuggestedPresentationDelay,setLiveDelayFragmentCount:setLiveDelayFragmentCount,getLiveDelayFragmentCount:getLiveDelayFragmentCount,getLiveDelay:getLiveDelay,setLiveDelay:setLiveDelay,setUseManifestDateHeaderTimeSource:setUseManifestDateHeaderTimeSource,getUseManifestDateHeaderTimeSource:getUseManifestDateHeaderTimeSource,addUTCTimingSource:addUTCTimingSource,removeUTCTimingSource:removeUTCTimingSource,getUTCTimingSources:getUTCTimingSources,clearDefaultUTCTimingSources:clearDefaultUTCTimingSources,restoreDefaultUTCTimingSources:restoreDefaultUTCTimingSources,setXHRWithCredentialsForType:setXHRWithCredentialsForType,getXHRWithCredentialsForType:getXHRWithCredentialsForType,setFastSwitchEnabled:setFastSwitchEnabled,getFastSwitchEnabled:getFastSwitchEnabled,setMovingAverageMethod:setMovingAverageMethod,getMovingAverageMethod:getMovingAverageMethod,setJumpGaps:setJumpGaps,getJumpGaps:getJumpGaps,setSmallGapLimit:setSmallGapLimit,getSmallGapLimit:getSmallGapLimit,getLowLatencyEnabled:getLowLatencyEnabled,setLowLatencyEnabled:setLowLatencyEnabled,setCatchUpPlaybackRate:setCatchUpPlaybackRate,getCatchUpPlaybackRate:getCatchUpPlaybackRate,setLowLatencyMinDrift:setLowLatencyMinDrift,getLowLatencyMinDrift:getLowLatencyMinDrift,setLowLatencyMaxDriftBeforeSeeking:setLowLatencyMaxDriftBeforeSeeking,getLowLatencyMaxDriftBeforeSeeking:getLowLatencyMaxDriftBeforeSeeking,setManifestUpdateRetryInterval:setManifestUpdateRetryInterval,getManifestUpdateRetryInterval:getManifestUpdateRetryInterval,setKeepProtectionMediaKeys:setKeepProtectionMediaKeys,getKeepProtectionMediaKeys:getKeepProtectionMediaKeys,getDefaultUtcTimingSource:getDefaultUtcTimingSource,reset:reset};setup();return instance;}//TODO see if you can move this and not export and just getter to get default value.
MediaPlayerModel.__dashjs_factory_name='MediaPlayerModel';exports.default=_FactoryMaker2.default.getSingletonFactory(MediaPlayerModel);
//# sourceMappingURL=MediaPlayerModel.js.map