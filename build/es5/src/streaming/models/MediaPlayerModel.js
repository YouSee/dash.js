/**
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
 */'use strict';Object.defineProperty(exports,'__esModule',{value:true});function _interopRequireDefault(obj){return obj && obj.__esModule?obj:{'default':obj};}function _defineProperty(obj,key,value){if(key in obj){Object.defineProperty(obj,key,{value:value,enumerable:true,configurable:true,writable:true});}else {obj[key] = value;}return obj;}var _coreFactoryMaker=require('../../core/FactoryMaker');var _coreFactoryMaker2=_interopRequireDefault(_coreFactoryMaker);var _voMetricsHTTPRequest=require('../vo/metrics/HTTPRequest');var _constantsConstants=require('../constants/Constants');var _constantsConstants2=_interopRequireDefault(_constantsConstants);var DEFAULT_UTC_TIMING_SOURCE={scheme:'urn:mpeg:dash:utc:http-xsdate:2014',value:'http://time.akamai.com/?iso&ms'};var LIVE_DELAY_FRAGMENT_COUNT=4;var DEFAULT_LOCAL_STORAGE_BITRATE_EXPIRATION=360000;var DEFAULT_LOCAL_STORAGE_MEDIA_SETTINGS_EXPIRATION=360000;var BANDWIDTH_SAFETY_FACTOR=0.9;var ABANDON_LOAD_TIMEOUT=10000;var BUFFER_TO_KEEP=20;var BUFFER_AHEAD_TO_KEEP=80;var BUFFER_PRUNING_INTERVAL=10;var DEFAULT_MIN_BUFFER_TIME=12;var DEFAULT_MIN_BUFFER_TIME_FAST_SWITCH=20;var BUFFER_TIME_AT_TOP_QUALITY=30;var BUFFER_TIME_AT_TOP_QUALITY_LONG_FORM=60;var LONG_FORM_CONTENT_DURATION_THRESHOLD=600;var SEGMENT_OVERLAP_TOLERANCE_TIME=0.2;var SMALL_GAP_LIMIT=0.8;var MANIFEST_UPDATE_RETRY_INTERVAL=100;var CACHE_LOAD_THRESHOLD_VIDEO=50;var CACHE_LOAD_THRESHOLD_AUDIO=5;var FRAGMENT_RETRY_ATTEMPTS=3;var FRAGMENT_RETRY_INTERVAL=1000;var MANIFEST_RETRY_ATTEMPTS=3;var MANIFEST_RETRY_INTERVAL=500;var XLINK_RETRY_ATTEMPTS=1;var XLINK_RETRY_INTERVAL=500;var DEFAULT_LOW_LATENCY_LIVE_DELAY=2.8;var LOW_LATENCY_REDUCTION_FACTOR=10;var LOW_LATENCY_MULTIPLY_FACTOR=5; //This value influences the startup time for live (in ms).
var WALLCLOCK_TIME_UPDATE_INTERVAL=50;var DEFAULT_XHR_WITH_CREDENTIALS=false;function MediaPlayerModel(){var instance=undefined,useManifestDateHeaderTimeSource=undefined,useSuggestedPresentationDelay=undefined,UTCTimingSources=undefined,liveDelayFragmentCount=undefined,liveDelay=undefined,scheduleWhilePaused=undefined,bufferToKeep=undefined,bufferAheadToKeep=undefined,bufferPruningInterval=undefined,lastBitrateCachingInfo=undefined,lastMediaSettingsCachingInfo=undefined,stableBufferTime=undefined,bufferTimeAtTopQuality=undefined,bufferTimeAtTopQualityLongForm=undefined,longFormContentDurationThreshold=undefined,segmentOverlapToleranceTime=undefined,bandwidthSafetyFactor=undefined,abandonLoadTimeout=undefined,retryAttempts=undefined,retryIntervals=undefined,wallclockTimeUpdateInterval=undefined,ABRStrategy=undefined,startLiveStreamOver=undefined,useDefaultABRRules=undefined,xhrWithCredentials=undefined,fastSwitchEnabled=undefined,customABRRule=undefined,movingAverageMethod=undefined,cacheLoadThresholds=undefined,jumpGaps=undefined,smallGapLimit=undefined,lowLatencyEnabled=undefined,manifestUpdateRetryInterval=undefined,keepProtectionMediaKeys=undefined;function setup(){var _retryAttempts,_retryIntervals;UTCTimingSources = [];useSuggestedPresentationDelay = false;useManifestDateHeaderTimeSource = true;scheduleWhilePaused = true;ABRStrategy = _constantsConstants2['default'].ABR_STRATEGY_DYNAMIC;startLiveStreamOver = false;useDefaultABRRules = true;fastSwitchEnabled = false;lastBitrateCachingInfo = {enabled:true,ttl:DEFAULT_LOCAL_STORAGE_BITRATE_EXPIRATION};lastMediaSettingsCachingInfo = {enabled:true,ttl:DEFAULT_LOCAL_STORAGE_MEDIA_SETTINGS_EXPIRATION};liveDelayFragmentCount = LIVE_DELAY_FRAGMENT_COUNT;liveDelay = undefined; // Explicitly state that default is undefined
bufferToKeep = BUFFER_TO_KEEP;bufferAheadToKeep = BUFFER_AHEAD_TO_KEEP;bufferPruningInterval = BUFFER_PRUNING_INTERVAL;stableBufferTime = NaN;bufferTimeAtTopQuality = BUFFER_TIME_AT_TOP_QUALITY;bufferTimeAtTopQualityLongForm = BUFFER_TIME_AT_TOP_QUALITY_LONG_FORM;longFormContentDurationThreshold = LONG_FORM_CONTENT_DURATION_THRESHOLD;segmentOverlapToleranceTime = SEGMENT_OVERLAP_TOLERANCE_TIME;bandwidthSafetyFactor = BANDWIDTH_SAFETY_FACTOR;abandonLoadTimeout = ABANDON_LOAD_TIMEOUT;wallclockTimeUpdateInterval = WALLCLOCK_TIME_UPDATE_INTERVAL;jumpGaps = false;smallGapLimit = SMALL_GAP_LIMIT;manifestUpdateRetryInterval = MANIFEST_UPDATE_RETRY_INTERVAL;xhrWithCredentials = {'default':DEFAULT_XHR_WITH_CREDENTIALS};customABRRule = [];movingAverageMethod = _constantsConstants2['default'].MOVING_AVERAGE_SLIDING_WINDOW;lowLatencyEnabled = false;retryAttempts = (_retryAttempts = {},_defineProperty(_retryAttempts,_voMetricsHTTPRequest.HTTPRequest.MPD_TYPE,MANIFEST_RETRY_ATTEMPTS),_defineProperty(_retryAttempts,_voMetricsHTTPRequest.HTTPRequest.XLINK_EXPANSION_TYPE,XLINK_RETRY_ATTEMPTS),_defineProperty(_retryAttempts,_voMetricsHTTPRequest.HTTPRequest.MEDIA_SEGMENT_TYPE,FRAGMENT_RETRY_ATTEMPTS),_defineProperty(_retryAttempts,_voMetricsHTTPRequest.HTTPRequest.INIT_SEGMENT_TYPE,FRAGMENT_RETRY_ATTEMPTS),_defineProperty(_retryAttempts,_voMetricsHTTPRequest.HTTPRequest.BITSTREAM_SWITCHING_SEGMENT_TYPE,FRAGMENT_RETRY_ATTEMPTS),_defineProperty(_retryAttempts,_voMetricsHTTPRequest.HTTPRequest.INDEX_SEGMENT_TYPE,FRAGMENT_RETRY_ATTEMPTS),_defineProperty(_retryAttempts,_voMetricsHTTPRequest.HTTPRequest.OTHER_TYPE,FRAGMENT_RETRY_ATTEMPTS),_retryAttempts);retryIntervals = (_retryIntervals = {},_defineProperty(_retryIntervals,_voMetricsHTTPRequest.HTTPRequest.MPD_TYPE,MANIFEST_RETRY_INTERVAL),_defineProperty(_retryIntervals,_voMetricsHTTPRequest.HTTPRequest.XLINK_EXPANSION_TYPE,XLINK_RETRY_INTERVAL),_defineProperty(_retryIntervals,_voMetricsHTTPRequest.HTTPRequest.MEDIA_SEGMENT_TYPE,FRAGMENT_RETRY_INTERVAL),_defineProperty(_retryIntervals,_voMetricsHTTPRequest.HTTPRequest.INIT_SEGMENT_TYPE,FRAGMENT_RETRY_INTERVAL),_defineProperty(_retryIntervals,_voMetricsHTTPRequest.HTTPRequest.BITSTREAM_SWITCHING_SEGMENT_TYPE,FRAGMENT_RETRY_INTERVAL),_defineProperty(_retryIntervals,_voMetricsHTTPRequest.HTTPRequest.INDEX_SEGMENT_TYPE,FRAGMENT_RETRY_INTERVAL),_defineProperty(_retryIntervals,_voMetricsHTTPRequest.HTTPRequest.OTHER_TYPE,FRAGMENT_RETRY_INTERVAL),_retryIntervals);cacheLoadThresholds = {};cacheLoadThresholds[_constantsConstants2['default'].VIDEO] = CACHE_LOAD_THRESHOLD_VIDEO;cacheLoadThresholds[_constantsConstants2['default'].AUDIO] = CACHE_LOAD_THRESHOLD_AUDIO;keepProtectionMediaKeys = false;} //TODO Should we use Object.define to have setters/getters? makes more readable code on other side.
function setABRStrategy(value){ABRStrategy = value;}function getABRStrategy(){return ABRStrategy;}function setStartLiveStreamOver(value){startLiveStreamOver = value;}function getStartLiveStreamOver(){return startLiveStreamOver;}function setUseDefaultABRRules(value){useDefaultABRRules = value;}function getUseDefaultABRRules(){return useDefaultABRRules;}function findABRCustomRule(rulename){var i=undefined;for(i = 0;i < customABRRule.length;i++) {if(customABRRule[i].rulename === rulename){return i;}}return -1;}function getABRCustomRules(){return customABRRule;}function addABRCustomRule(type,rulename,rule){var index=findABRCustomRule(rulename);if(index === -1){ // add rule
customABRRule.push({type:type,rulename:rulename,rule:rule});}else { // update rule
customABRRule[index].type = type;customABRRule[index].rule = rule;}}function removeABRCustomRule(rulename){var index=findABRCustomRule(rulename);if(index !== -1){ // remove rule
customABRRule.splice(index,1);}}function removeAllABRCustomRule(){customABRRule = [];}function setBandwidthSafetyFactor(value){bandwidthSafetyFactor = value;}function getBandwidthSafetyFactor(){return bandwidthSafetyFactor;}function setAbandonLoadTimeout(value){abandonLoadTimeout = value;}function getAbandonLoadTimeout(){return abandonLoadTimeout;}function setStableBufferTime(value){stableBufferTime = value;}function getStableBufferTime(){var result=!isNaN(stableBufferTime)?stableBufferTime:fastSwitchEnabled?DEFAULT_MIN_BUFFER_TIME_FAST_SWITCH:DEFAULT_MIN_BUFFER_TIME;return getLowLatencyEnabled()?result / LOW_LATENCY_REDUCTION_FACTOR:result;}function setBufferTimeAtTopQuality(value){bufferTimeAtTopQuality = value;}function getBufferTimeAtTopQuality(){return bufferTimeAtTopQuality;}function setBufferTimeAtTopQualityLongForm(value){bufferTimeAtTopQualityLongForm = value;}function getBufferTimeAtTopQualityLongForm(){return bufferTimeAtTopQualityLongForm;}function setLongFormContentDurationThreshold(value){longFormContentDurationThreshold = value;}function getLongFormContentDurationThreshold(){return longFormContentDurationThreshold;}function setSegmentOverlapToleranceTime(value){segmentOverlapToleranceTime = value;}function getSegmentOverlapToleranceTime(){return segmentOverlapToleranceTime;}function setCacheLoadThresholdForType(type,value){cacheLoadThresholds[type] = value;}function getCacheLoadThresholdForType(type){return cacheLoadThresholds[type];}function setBufferToKeep(value){bufferToKeep = value;}function getBufferToKeep(){return bufferToKeep;}function setBufferAheadToKeep(value){bufferAheadToKeep = value;}function getBufferAheadToKeep(){return bufferAheadToKeep;}function setLastBitrateCachingInfo(enable,ttl){lastBitrateCachingInfo.enabled = enable;if(ttl !== undefined && !isNaN(ttl) && typeof ttl === 'number'){lastBitrateCachingInfo.ttl = ttl;}}function getLastBitrateCachingInfo(){return lastBitrateCachingInfo;}function setLastMediaSettingsCachingInfo(enable,ttl){lastMediaSettingsCachingInfo.enabled = enable;if(ttl !== undefined && !isNaN(ttl) && typeof ttl === 'number'){lastMediaSettingsCachingInfo.ttl = ttl;}}function getLastMediaSettingsCachingInfo(){return lastMediaSettingsCachingInfo;}function setBufferPruningInterval(value){bufferPruningInterval = value;}function getBufferPruningInterval(){return bufferPruningInterval;}function setFragmentRetryAttempts(value){retryAttempts[_voMetricsHTTPRequest.HTTPRequest.MEDIA_SEGMENT_TYPE] = value;}function setManifestRetryAttempts(value){retryAttempts[_voMetricsHTTPRequest.HTTPRequest.MPD_TYPE] = value;}function setRetryAttemptsForType(type,value){retryAttempts[type] = value;}function getFragmentRetryAttempts(){return retryAttempts[_voMetricsHTTPRequest.HTTPRequest.MEDIA_SEGMENT_TYPE];}function getManifestRetryAttempts(){return retryAttempts[_voMetricsHTTPRequest.HTTPRequest.MPD_TYPE];}function getRetryAttemptsForType(type){return getLowLatencyEnabled()?retryAttempts[type] * LOW_LATENCY_MULTIPLY_FACTOR:retryAttempts[type];}function setFragmentRetryInterval(value){retryIntervals[_voMetricsHTTPRequest.HTTPRequest.MEDIA_SEGMENT_TYPE] = value;}function setManifestRetryInterval(value){retryIntervals[_voMetricsHTTPRequest.HTTPRequest.MPD_TYPE] = value;}function setRetryIntervalForType(type,value){retryIntervals[type] = value;}function getFragmentRetryInterval(){return retryIntervals[_voMetricsHTTPRequest.HTTPRequest.MEDIA_SEGMENT_TYPE];}function getManifestRetryInterval(){return retryIntervals[_voMetricsHTTPRequest.HTTPRequest.MPD_TYPE];}function getRetryIntervalForType(type){return getLowLatencyEnabled()?retryIntervals[type] / LOW_LATENCY_REDUCTION_FACTOR:retryIntervals[type];}function setWallclockTimeUpdateInterval(value){wallclockTimeUpdateInterval = value;}function getWallclockTimeUpdateInterval(){return wallclockTimeUpdateInterval;}function setScheduleWhilePaused(value){scheduleWhilePaused = value;}function getScheduleWhilePaused(){return scheduleWhilePaused;}function setLiveDelayFragmentCount(value){liveDelayFragmentCount = value;}function setLiveDelay(value){liveDelay = value;}function getLiveDelayFragmentCount(){return liveDelayFragmentCount;}function getLiveDelay(){if(lowLatencyEnabled){return liveDelay || DEFAULT_LOW_LATENCY_LIVE_DELAY;}return liveDelay;}function setUseManifestDateHeaderTimeSource(value){useManifestDateHeaderTimeSource = value;}function getUseManifestDateHeaderTimeSource(){return useManifestDateHeaderTimeSource;}function setUseSuggestedPresentationDelay(value){useSuggestedPresentationDelay = value;}function getUseSuggestedPresentationDelay(){return useSuggestedPresentationDelay;}function setUTCTimingSources(value){UTCTimingSources = value;}function getUTCTimingSources(){return UTCTimingSources;}function setXHRWithCredentialsForType(type,value){if(!type){Object.keys(xhrWithCredentials).forEach(function(key){setXHRWithCredentialsForType(key,value);});}else {xhrWithCredentials[type] = !!value;}}function getXHRWithCredentialsForType(type){var useCreds=xhrWithCredentials[type];if(useCreds === undefined){return xhrWithCredentials['default'];}return useCreds;}function getFastSwitchEnabled(){return fastSwitchEnabled;}function setFastSwitchEnabled(value){if(typeof value !== 'boolean'){return;}fastSwitchEnabled = value;}function setMovingAverageMethod(value){movingAverageMethod = value;}function getMovingAverageMethod(){return movingAverageMethod;}function setJumpGaps(value){jumpGaps = value;}function getJumpGaps(){return jumpGaps;}function setSmallGapLimit(value){smallGapLimit = value;}function getSmallGapLimit(){return smallGapLimit;}function getLowLatencyEnabled(){return lowLatencyEnabled;}function setLowLatencyEnabled(value){if(typeof value !== 'boolean'){return;}lowLatencyEnabled = value;}function setManifestUpdateRetryInterval(value){manifestUpdateRetryInterval = value;}function getManifestUpdateRetryInterval(){return manifestUpdateRetryInterval;}function setKeepProtectionMediaKeys(value){keepProtectionMediaKeys = value;}function getKeepProtectionMediaKeys(){return keepProtectionMediaKeys;}function reset(){ //TODO need to figure out what props to persist across sessions and which to reset if any.
//setup();
}instance = {setABRStrategy:setABRStrategy,getABRStrategy:getABRStrategy,setStartLiveStreamOver:setStartLiveStreamOver,getStartLiveStreamOver:getStartLiveStreamOver,setUseDefaultABRRules:setUseDefaultABRRules,getUseDefaultABRRules:getUseDefaultABRRules,getABRCustomRules:getABRCustomRules,addABRCustomRule:addABRCustomRule,removeABRCustomRule:removeABRCustomRule,removeAllABRCustomRule:removeAllABRCustomRule,setBandwidthSafetyFactor:setBandwidthSafetyFactor,getBandwidthSafetyFactor:getBandwidthSafetyFactor,setAbandonLoadTimeout:setAbandonLoadTimeout,getAbandonLoadTimeout:getAbandonLoadTimeout,setLastBitrateCachingInfo:setLastBitrateCachingInfo,getLastBitrateCachingInfo:getLastBitrateCachingInfo,setLastMediaSettingsCachingInfo:setLastMediaSettingsCachingInfo,getLastMediaSettingsCachingInfo:getLastMediaSettingsCachingInfo,setStableBufferTime:setStableBufferTime,getStableBufferTime:getStableBufferTime,setBufferTimeAtTopQuality:setBufferTimeAtTopQuality,getBufferTimeAtTopQuality:getBufferTimeAtTopQuality,setBufferTimeAtTopQualityLongForm:setBufferTimeAtTopQualityLongForm,getBufferTimeAtTopQualityLongForm:getBufferTimeAtTopQualityLongForm,setLongFormContentDurationThreshold:setLongFormContentDurationThreshold,getLongFormContentDurationThreshold:getLongFormContentDurationThreshold,setSegmentOverlapToleranceTime:setSegmentOverlapToleranceTime,getSegmentOverlapToleranceTime:getSegmentOverlapToleranceTime,getCacheLoadThresholdForType:getCacheLoadThresholdForType,setCacheLoadThresholdForType:setCacheLoadThresholdForType,setBufferToKeep:setBufferToKeep,getBufferToKeep:getBufferToKeep,setBufferAheadToKeep:setBufferAheadToKeep,getBufferAheadToKeep:getBufferAheadToKeep,setBufferPruningInterval:setBufferPruningInterval,getBufferPruningInterval:getBufferPruningInterval,setFragmentRetryAttempts:setFragmentRetryAttempts,getFragmentRetryAttempts:getFragmentRetryAttempts,setManifestRetryAttempts:setManifestRetryAttempts,getManifestRetryAttempts:getManifestRetryAttempts,setRetryAttemptsForType:setRetryAttemptsForType,getRetryAttemptsForType:getRetryAttemptsForType,setFragmentRetryInterval:setFragmentRetryInterval,getFragmentRetryInterval:getFragmentRetryInterval,setManifestRetryInterval:setManifestRetryInterval,getManifestRetryInterval:getManifestRetryInterval,setRetryIntervalForType:setRetryIntervalForType,getRetryIntervalForType:getRetryIntervalForType,setWallclockTimeUpdateInterval:setWallclockTimeUpdateInterval,getWallclockTimeUpdateInterval:getWallclockTimeUpdateInterval,setScheduleWhilePaused:setScheduleWhilePaused,getScheduleWhilePaused:getScheduleWhilePaused,getUseSuggestedPresentationDelay:getUseSuggestedPresentationDelay,setUseSuggestedPresentationDelay:setUseSuggestedPresentationDelay,setLiveDelayFragmentCount:setLiveDelayFragmentCount,getLiveDelayFragmentCount:getLiveDelayFragmentCount,getLiveDelay:getLiveDelay,setLiveDelay:setLiveDelay,setUseManifestDateHeaderTimeSource:setUseManifestDateHeaderTimeSource,getUseManifestDateHeaderTimeSource:getUseManifestDateHeaderTimeSource,setUTCTimingSources:setUTCTimingSources,getUTCTimingSources:getUTCTimingSources,setXHRWithCredentialsForType:setXHRWithCredentialsForType,getXHRWithCredentialsForType:getXHRWithCredentialsForType,setFastSwitchEnabled:setFastSwitchEnabled,getFastSwitchEnabled:getFastSwitchEnabled,setMovingAverageMethod:setMovingAverageMethod,getMovingAverageMethod:getMovingAverageMethod,setJumpGaps:setJumpGaps,getJumpGaps:getJumpGaps,setSmallGapLimit:setSmallGapLimit,getSmallGapLimit:getSmallGapLimit,getLowLatencyEnabled:getLowLatencyEnabled,setLowLatencyEnabled:setLowLatencyEnabled,setManifestUpdateRetryInterval:setManifestUpdateRetryInterval,getManifestUpdateRetryInterval:getManifestUpdateRetryInterval,setKeepProtectionMediaKeys:setKeepProtectionMediaKeys,getKeepProtectionMediaKeys:getKeepProtectionMediaKeys,reset:reset};setup();return instance;} //TODO see if you can move this and not export and just getter to get default value.
MediaPlayerModel.__dashjs_factory_name = 'MediaPlayerModel';var factory=_coreFactoryMaker2['default'].getSingletonFactory(MediaPlayerModel);factory.DEFAULT_UTC_TIMING_SOURCE = DEFAULT_UTC_TIMING_SOURCE;_coreFactoryMaker2['default'].updateSingletonFactory(MediaPlayerModel.__dashjs_factory_name,factory);exports['default'] = factory;module.exports = exports['default'];
//# sourceMappingURL=MediaPlayerModel.js.map
