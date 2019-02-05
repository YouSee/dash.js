'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _EventBus=require('../../core/EventBus');var _EventBus2=_interopRequireDefault(_EventBus);var _Events=require('../../core/events/Events');var _Events2=_interopRequireDefault(_Events);var _FactoryMaker=require('../../core/FactoryMaker');var _FactoryMaker2=_interopRequireDefault(_FactoryMaker);var _FragmentRequest=require('../vo/FragmentRequest');var _FragmentRequest2=_interopRequireDefault(_FragmentRequest);var _Debug=require('../../core/Debug');var _Debug2=_interopRequireDefault(_Debug);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}var FRAGMENT_MODEL_LOADING='loading';/**
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
 */var FRAGMENT_MODEL_EXECUTED='executed';var FRAGMENT_MODEL_CANCELED='canceled';var FRAGMENT_MODEL_FAILED='failed';function FragmentModel(config){config=config||{};var context=this.context;var eventBus=(0,_EventBus2.default)(context).getInstance();var metricsModel=config.metricsModel;var fragmentLoader=config.fragmentLoader;var instance=void 0,logger=void 0,streamProcessor=void 0,executedRequests=void 0,loadingRequests=void 0;function setup(){logger=(0,_Debug2.default)(context).getInstance().getLogger(instance);resetInitialSettings();eventBus.on(_Events2.default.LOADING_COMPLETED,onLoadingCompleted,instance);eventBus.on(_Events2.default.LOADING_DATA_PROGRESS,onLoadingInProgress,instance);eventBus.on(_Events2.default.LOADING_ABANDONED,onLoadingAborted,instance);}function setStreamProcessor(value){streamProcessor=value;}function getStreamProcessor(){return streamProcessor;}function isFragmentLoaded(request){var isEqualComplete=function isEqualComplete(req1,req2){return req1.action===_FragmentRequest2.default.ACTION_COMPLETE&&req1.action===req2.action;};var isEqualMedia=function isEqualMedia(req1,req2){return!isNaN(req1.index)&&req1.startTime===req2.startTime&&req1.adaptationIndex===req2.adaptationIndex&&req1.type===req2.type;};var isEqualInit=function isEqualInit(req1,req2){return isNaN(req1.index)&&isNaN(req2.index)&&req1.quality===req2.quality;};var check=function check(requests){var isLoaded=false;requests.some(function(req){if(isEqualMedia(request,req)||isEqualInit(request,req)||isEqualComplete(request,req)){isLoaded=true;return isLoaded;}});return isLoaded;};if(!request){return false;}return check(executedRequests);}function isFragmentLoadedOrPending(request){var isLoaded=false;var i=0;var req=void 0;// First, check if the fragment has already been loaded
isLoaded=isFragmentLoaded(request);// Then, check if the fragment is about to be loeaded
if(!isLoaded){for(i=0;i<loadingRequests.length;i++){req=loadingRequests[i];if(request.url===req.url&&request.startTime===req.startTime){isLoaded=true;}}}return isLoaded;}/**
     *
     * Gets an array of {@link FragmentRequest} objects
     *
     * @param {Object} filter The object with properties by which the method filters the requests to be returned.
     *  the only mandatory property is state, which must be a value from
     *  other properties should match the properties of {@link FragmentRequest}. E.g.:
     *  getRequests({state: FragmentModel.FRAGMENT_MODEL_EXECUTED, quality: 0}) - returns
     *  all the requests from executedRequests array where requests.quality = filter.quality
     *
     * @returns {Array}
     * @memberof FragmentModel#
     */function getRequests(filter){var states=filter?filter.state instanceof Array?filter.state:[filter.state]:[];var filteredRequests=[];states.forEach(function(state){var requests=getRequestsForState(state);filteredRequests=filteredRequests.concat(filterRequests(requests,filter));});return filteredRequests;}function getRequestThreshold(req){return isNaN(req.duration)?0.25:Math.min(req.duration/8,0.5);}function removeExecutedRequestsBeforeTime(time){executedRequests=executedRequests.filter(function(req){var threshold=getRequestThreshold(req);return isNaN(req.startTime)||(time!==undefined?req.startTime>=time-threshold:false);});}function removeExecutedRequestsAfterTime(time){executedRequests=executedRequests.filter(function(req){return isNaN(req.startTime)||(time!==undefined?req.startTime+req.duration<time:false);});}function removeExecutedRequestsInTimeRange(start,end){if(end<=start+0.5){return;}executedRequests=executedRequests.filter(function(req){var threshold=getRequestThreshold(req);return isNaN(req.startTime)||req.startTime>=end-threshold||isNaN(req.duration)||req.startTime+req.duration<=start+threshold;});}// Remove requests that are not "represented" by any of buffered ranges
function syncExecutedRequestsWithBufferedRange(bufferedRanges,streamDuration){if(!bufferedRanges||bufferedRanges.length===0){removeExecutedRequestsBeforeTime();return;}var start=0;for(var i=0,ln=bufferedRanges.length;i<ln;i++){removeExecutedRequestsInTimeRange(start,bufferedRanges.start(i));start=bufferedRanges.end(i);}if(streamDuration>0){removeExecutedRequestsInTimeRange(start,streamDuration);}}function abortRequests(){fragmentLoader.abort();loadingRequests=[];}function executeRequest(request){switch(request.action){case _FragmentRequest2.default.ACTION_COMPLETE:executedRequests.push(request);addSchedulingInfoMetrics(request,FRAGMENT_MODEL_EXECUTED);logger.debug('executeRequest trigger STREAM_COMPLETED');eventBus.trigger(_Events2.default.STREAM_COMPLETED,{request:request,fragmentModel:this});break;case _FragmentRequest2.default.ACTION_DOWNLOAD:addSchedulingInfoMetrics(request,FRAGMENT_MODEL_LOADING);loadingRequests.push(request);loadCurrentFragment(request);break;default:logger.warn('Unknown request action.');}}function loadCurrentFragment(request){eventBus.trigger(_Events2.default.FRAGMENT_LOADING_STARTED,{sender:instance,request:request});fragmentLoader.load(request);}function getRequestForTime(arr,time,threshold){// loop through the executed requests and pick the one for which the playback interval matches the given time
var lastIdx=arr.length-1;for(var i=lastIdx;i>=0;i--){var req=arr[i];var start=req.startTime;var end=start+req.duration;threshold=!isNaN(threshold)?threshold:getRequestThreshold(req);if(!isNaN(start)&&!isNaN(end)&&time+threshold>=start&&time-threshold<end||isNaN(start)&&isNaN(time)){return req;}}return null;}function filterRequests(arr,filter){// for time use a specific filtration function
if(filter.hasOwnProperty('time')){return[getRequestForTime(arr,filter.time,filter.threshold)];}return arr.filter(function(request){for(var prop in filter){if(prop==='state')continue;if(filter.hasOwnProperty(prop)&&request[prop]!=filter[prop])return false;}return true;});}function getRequestsForState(state){var requests=void 0;switch(state){case FRAGMENT_MODEL_LOADING:requests=loadingRequests;break;case FRAGMENT_MODEL_EXECUTED:requests=executedRequests;break;default:requests=[];}return requests;}function addSchedulingInfoMetrics(request,state){metricsModel.addSchedulingInfo(request.mediaType,new Date(),request.type,request.startTime,request.availabilityStartTime,request.duration,request.quality,request.range,state);metricsModel.addRequestsQueue(request.mediaType,loadingRequests,executedRequests);}function onLoadingCompleted(e){if(e.sender!==fragmentLoader)return;loadingRequests.splice(loadingRequests.indexOf(e.request),1);if(e.response&&!e.error){executedRequests.push(e.request);}addSchedulingInfoMetrics(e.request,e.error?FRAGMENT_MODEL_FAILED:FRAGMENT_MODEL_EXECUTED);eventBus.trigger(_Events2.default.FRAGMENT_LOADING_COMPLETED,{request:e.request,response:e.response,error:e.error,sender:this});}function onLoadingInProgress(e){if(e.sender!==fragmentLoader)return;eventBus.trigger(_Events2.default.FRAGMENT_LOADING_PROGRESS,{request:e.request,response:e.response,error:e.error,sender:this});}function onLoadingAborted(e){if(e.sender!==fragmentLoader)return;eventBus.trigger(_Events2.default.FRAGMENT_LOADING_ABANDONED,{streamProcessor:this.getStreamProcessor(),request:e.request,mediaType:e.mediaType});}function resetInitialSettings(){executedRequests=[];loadingRequests=[];}function reset(){eventBus.off(_Events2.default.LOADING_COMPLETED,onLoadingCompleted,this);eventBus.off(_Events2.default.LOADING_DATA_PROGRESS,onLoadingInProgress,this);eventBus.off(_Events2.default.LOADING_ABANDONED,onLoadingAborted,this);if(fragmentLoader){fragmentLoader.reset();}resetInitialSettings();}function addExecutedRequest(request){executedRequests.push(request);}instance={setStreamProcessor:setStreamProcessor,getStreamProcessor:getStreamProcessor,getRequests:getRequests,isFragmentLoaded:isFragmentLoaded,isFragmentLoadedOrPending:isFragmentLoadedOrPending,removeExecutedRequestsBeforeTime:removeExecutedRequestsBeforeTime,removeExecutedRequestsAfterTime:removeExecutedRequestsAfterTime,syncExecutedRequestsWithBufferedRange:syncExecutedRequestsWithBufferedRange,abortRequests:abortRequests,executeRequest:executeRequest,reset:reset,addExecutedRequest:addExecutedRequest};setup();return instance;}FragmentModel.__dashjs_factory_name='FragmentModel';var factory=_FactoryMaker2.default.getClassFactory(FragmentModel);factory.FRAGMENT_MODEL_LOADING=FRAGMENT_MODEL_LOADING;factory.FRAGMENT_MODEL_EXECUTED=FRAGMENT_MODEL_EXECUTED;factory.FRAGMENT_MODEL_CANCELED=FRAGMENT_MODEL_CANCELED;factory.FRAGMENT_MODEL_FAILED=FRAGMENT_MODEL_FAILED;_FactoryMaker2.default.updateClassFactory(FragmentModel.__dashjs_factory_name,factory);exports.default=factory;
//# sourceMappingURL=FragmentModel.js.map
