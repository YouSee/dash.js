'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _Constants=require('../constants/Constants');var _Constants2=_interopRequireDefault(_Constants);var _FactoryMaker=require('../../core/FactoryMaker');var _FactoryMaker2=_interopRequireDefault(_FactoryMaker);var _TextSourceBuffer=require('./TextSourceBuffer');var _TextSourceBuffer2=_interopRequireDefault(_TextSourceBuffer);var _TextTracks=require('./TextTracks');var _TextTracks2=_interopRequireDefault(_TextTracks);var _VTTParser=require('../utils/VTTParser');var _VTTParser2=_interopRequireDefault(_VTTParser);var _TTMLParser=require('../utils/TTMLParser');var _TTMLParser2=_interopRequireDefault(_TTMLParser);var _EventBus=require('../../core/EventBus');var _EventBus2=_interopRequireDefault(_EventBus);var _Events=require('../../core/events/Events');var _Events2=_interopRequireDefault(_Events);var _SupervisorTools=require('../utils/SupervisorTools');function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function TextController(){var context=this.context;var instance=void 0,textSourceBuffer=void 0,errHandler=void 0,dashManifestModel=void 0,manifestModel=void 0,mediaController=void 0,videoModel=void 0,streamController=void 0,textTracks=void 0,vttParser=void 0,ttmlParser=void 0,eventBus=void 0,defaultLanguage=void 0,lastEnabledIndex=void 0,textDefaultEnabled=void 0,// this is used for default settings (each time a file is loaded, we check value of this settings )
allTracksAreDisabled=void 0,// this is used for one session (when a file has been loaded, we use this settings to enable/disable text)
forceTextStreaming=void 0;function setup(){defaultLanguage='';lastEnabledIndex=-1;textDefaultEnabled=true;forceTextStreaming=false;textTracks=(0,_TextTracks2.default)(context).getInstance();vttParser=(0,_VTTParser2.default)(context).getInstance();ttmlParser=(0,_TTMLParser2.default)(context).getInstance();textSourceBuffer=(0,_TextSourceBuffer2.default)(context).getInstance();eventBus=(0,_EventBus2.default)(context).getInstance();textTracks.initialize();eventBus.on(_Events2.default.TEXT_TRACKS_QUEUE_INITIALIZED,onTextTracksAdded,instance);resetInitialSettings();}function setConfig(config){if(!config){return;}if(config.errHandler){errHandler=config.errHandler;}if(config.dashManifestModel){dashManifestModel=config.dashManifestModel;}if(config.manifestModel){manifestModel=config.manifestModel;}if(config.mediaController){mediaController=config.mediaController;}if(config.videoModel){videoModel=config.videoModel;}if(config.streamController){streamController=config.streamController;}if(config.textTracks){textTracks=config.textTracks;}if(config.vttParser){vttParser=config.vttParser;}if(config.ttmlParser){ttmlParser=config.ttmlParser;}// create config for source buffer
textSourceBuffer.setConfig({errHandler:errHandler,dashManifestModel:dashManifestModel,manifestModel:manifestModel,mediaController:mediaController,videoModel:videoModel,streamController:streamController,textTracks:textTracks,vttParser:vttParser,ttmlParser:ttmlParser});}function getTextSourceBuffer(){return textSourceBuffer;}function getAllTracksAreDisabled(){return allTracksAreDisabled;}function addEmbeddedTrack(mediaInfo){textSourceBuffer.addEmbeddedTrack(mediaInfo);}function setTextDefaultLanguage(lang){(0,_SupervisorTools.checkParameterType)(lang,'string');defaultLanguage=lang;}function getTextDefaultLanguage(){return defaultLanguage;}function onTextTracksAdded(e){var _this=this;var tracks=e.tracks;var index=e.index;tracks.some(function(item,idx){if(item.lang===defaultLanguage){_this.setTextTrack(idx);index=idx;return true;}});if(!textDefaultEnabled){// disable text at startup
this.setTextTrack(-1);}lastEnabledIndex=index;eventBus.trigger(_Events2.default.TEXT_TRACKS_ADDED,{enabled:isTextEnabled(),index:index,tracks:tracks});}function setTextDefaultEnabled(enable){(0,_SupervisorTools.checkParameterType)(enable,'boolean');textDefaultEnabled=enable;if(!textDefaultEnabled){// disable text at startup
this.setTextTrack(-1);}}function getTextDefaultEnabled(){return textDefaultEnabled;}function enableText(enable){(0,_SupervisorTools.checkParameterType)(enable,'boolean');if(isTextEnabled()!==enable){// change track selection
if(enable){// apply last enabled tractk
this.setTextTrack(lastEnabledIndex);}if(!enable){// keep last index and disable text track
lastEnabledIndex=this.getCurrentTrackIdx();this.setTextTrack(-1);}}}function isTextEnabled(){var enabled=true;if(allTracksAreDisabled&&!forceTextStreaming){enabled=false;}return enabled;}// when set to true NextFragmentRequestRule will allow schedule of chunks even if tracks are all disabled. Allowing streaming to hidden track for external players to work with.
function enableForcedTextStreaming(enable){(0,_SupervisorTools.checkParameterType)(enable,'boolean');forceTextStreaming=enable;}function setTextTrack(idx){//For external time text file,  the only action needed to change a track is marking the track mode to showing.
// Fragmented text tracks need the additional step of calling TextController.setTextTrack();
var config=textSourceBuffer.getConfig();var fragmentModel=config.fragmentModel;var fragmentedTracks=config.fragmentedTracks;var videoModel=config.videoModel;var mediaInfosArr=void 0,streamProcessor=void 0;allTracksAreDisabled=idx===-1?true:false;var oldTrackIdx=textTracks.getCurrentTrackIdx();if(oldTrackIdx!==idx){textTracks.setModeForTrackIdx(oldTrackIdx,_Constants2.default.TEXT_HIDDEN);textTracks.setCurrentTrackIdx(idx);textTracks.setModeForTrackIdx(idx,_Constants2.default.TEXT_SHOWING);var currentTrackInfo=textTracks.getCurrentTrackInfo();if(currentTrackInfo&&currentTrackInfo.isFragmented&&!currentTrackInfo.isEmbedded){for(var i=0;i<fragmentedTracks.length;i++){var mediaInfo=fragmentedTracks[i];if(currentTrackInfo.lang===mediaInfo.lang&&currentTrackInfo.index===mediaInfo.index&&(mediaInfo.id?currentTrackInfo.label===mediaInfo.id:currentTrackInfo.label===mediaInfo.index)){var currentFragTrack=mediaController.getCurrentTrackFor(_Constants2.default.FRAGMENTED_TEXT,streamController.getActiveStreamInfo());if(mediaInfo!==currentFragTrack){fragmentModel.abortRequests();fragmentModel.removeExecutedRequestsBeforeTime();textSourceBuffer.remove();textTracks.deleteCuesFromTrackIdx(oldTrackIdx);mediaController.setTrack(mediaInfo);textSourceBuffer.setCurrentFragmentedTrackIdx(i);}else if(oldTrackIdx===-1){//in fragmented use case, if the user selects the older track (the one selected before disabled text track)
//no CURRENT_TRACK_CHANGED event will be trigger, so dashHandler current time has to be updated and the scheduleController
//has to be restarted.
var streamProcessors=streamController.getActiveStreamProcessors();for(var _i=0;_i<streamProcessors.length;_i++){if(streamProcessors[_i].getType()===_Constants2.default.FRAGMENTED_TEXT){streamProcessor=streamProcessors[_i];break;}}streamProcessor.getIndexHandler().setCurrentTime(videoModel.getTime());streamProcessor.getScheduleController().start();}}}}else if(currentTrackInfo&&!currentTrackInfo.isFragmented){var _streamProcessors=streamController.getActiveStreamProcessors();for(var _i2=0;_i2<_streamProcessors.length;_i2++){if(_streamProcessors[_i2].getType()===_Constants2.default.TEXT){streamProcessor=_streamProcessors[_i2];mediaInfosArr=streamProcessor.getMediaInfoArr();break;}}if(streamProcessor&&mediaInfosArr){for(var _i3=0;_i3<mediaInfosArr.length;_i3++){if(mediaInfosArr[_i3].index===currentTrackInfo.index&&mediaInfosArr[_i3].lang===currentTrackInfo.lang){streamProcessor.selectMediaInfo(mediaInfosArr[_i3]);break;}}}}}}function getCurrentTrackIdx(){return textTracks.getCurrentTrackIdx();}function resetInitialSettings(){allTracksAreDisabled=false;}function reset(){resetInitialSettings();textSourceBuffer.resetEmbedded();textSourceBuffer.reset();}instance={setConfig:setConfig,getTextSourceBuffer:getTextSourceBuffer,getAllTracksAreDisabled:getAllTracksAreDisabled,addEmbeddedTrack:addEmbeddedTrack,getTextDefaultLanguage:getTextDefaultLanguage,setTextDefaultLanguage:setTextDefaultLanguage,setTextDefaultEnabled:setTextDefaultEnabled,getTextDefaultEnabled:getTextDefaultEnabled,enableText:enableText,isTextEnabled:isTextEnabled,setTextTrack:setTextTrack,getCurrentTrackIdx:getCurrentTrackIdx,enableForcedTextStreaming:enableForcedTextStreaming,reset:reset};setup();return instance;}/**
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
 */TextController.__dashjs_factory_name='TextController';exports.default=_FactoryMaker2.default.getSingletonFactory(TextController);
//# sourceMappingURL=TextController.js.map
