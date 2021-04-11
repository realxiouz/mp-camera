<template>
  <view class="page-live">
    <view class="video-container">
      <live-player
        id="livePlayer"
        binderror="error"
        bindstatechange="statechange"
        mode="RTC"
        :src="isHD ? videoHDSrc :videoSrc"
        @click.stop="onVideoTap"
        :muted="!openSound"
        :class="fullScreen ? 'video-item full-screen' :'video-item'"
        @fullscreenchange="fullscreenChange"
        :object-fit="objectFit"
        :autoplay="true"
      >
        <cover-view class="video-loading-container" @click.stop="onVideoTap" :hidden="videoLoadingStatus === 100">
          <cover-image class="video-loading-bg" src="/static/img/images/live/live_loading_bg.png"></cover-image>
          <cover-view class="video-loaing video-ready" :hidden="videoLoadingStatus !== 0">
            <cover-image class="loading-gif" src="/static/img/images/live/landscape_play.png" @click.stop="handlePlay"></cover-image>
          </cover-view>
          <cover-view class="video-loaing" :hidden="videoLoadingStatus === 0 || videoNetWorkError">
            <cover-image class="loading-gif" src="/static/img/images/live/loading_grey.gif"></cover-image>
            <cover-view class="video-loading-text">视频安全传输中...{{videoLoadingStatus}}%</cover-view>
          </cover-view>
        </cover-view>
        <cover-view class="video-loading-container" :hidden="!(panelStatus == 4)">
          <cover-image class="video-loading-bg" src="/static/img/images/live/live_loading_bg.png"></cover-image>
          <cover-view class="video-loaing">
            <cover-image class="loading-gif" src="/static/img/images/live/preview_fail_yinsi.png"></cover-image>
            <cover-view class="video-loading-text">已开启隐私遮蔽</cover-view>
          </cover-view>
        </cover-view>
        <cover-view class="video-loading-container" :hidden="!videoNetWorkError">
          <cover-image class="video-loading-bg" src="/static/img/images/live/live_loading_bg.png"></cover-image>
          <cover-view class="video-loaing">
            <cover-image class="loading-gif" src="/static/img/images/live/preview_fail.png"></cover-image>
            <cover-view class="video-loading-text">网络不稳定，加载失败</cover-view>
            <cover-view class="video-loading-text reTry" ontap="handlePlay">重试</cover-view>
          </cover-view>
        </cover-view>
        <cover-view class="video-loading-container" :hidden="!deviceOffline">
          <cover-image class="video-loading-bg" src="/static/img/images/live/live_loading_bg.png"></cover-image>
          <cover-view class="video-loaing">
            <cover-image class="loading-gif" src="/static/img/images/live/preview_fail_offline.png"></cover-image>
            <cover-view class="video-loading-text">设备不在线</cover-view>
            <cover-view class="video-loading-text">离线时间：{{deviceOfflineTime}}</cover-view>
          </cover-view>
        </cover-view>
        <cover-view :class="showHDSelect ? 'hd-select' : 'hd-select hide'">
          <cover-view :class="isHD ? 'hd-option active': 'hd-option'" @click.stop="changeVideoHD">高清</cover-view>
          <cover-view :class="!isHD ? 'hd-option active': 'hd-option'" @click.stop="changeVideoNormal">标清</cover-view>
        </cover-view>
        <cover-view :class="fullScreen ? 'hidden' : '' " class="video-controls-container">
        </cover-view>
        <cover-view class="video-controls-container" :class="(fullScreen || !showVideoControls)  ? 'hidden' : ''">
          <cover-image class="controls-img" :src='playVideo ? "/static/img/images/video_icon_stop.png":"/static/img/images/video_icon_play.png"' @click.stop="playVideo ? 'handleStop': 'handlePlay'"></cover-image>
          <cover-image class="controls-img" :src='!openSound ? "/static/img/images/video_icon_closesound.png":"/static/img/images/video_icon_opensound.png"' @click.stop="handleSound"></cover-image>
          <cover-image class="controls-img hd" :src="isHD ? '/static/img/images/video_icon_hd.png' : '/static/img/images/video_icon_bq.png'" @click.stop="handleHD">
          </cover-image>
          <cover-image class="controls-img" @click.stop="fullScreen" src="/static/img/images/video_icon_full.png"></cover-image>
        </cover-view>
        <cover-view class="video-back-container" :class="!fullScreen ? 'hidden' : '' ">
          <cover-image class="back-img" src="/static/img/images/nav_icon_back_full.png" @click.stop="unfullScreen"></cover-image>
          <cover-view class="back-device">{{deviceName}}</cover-view>
        </cover-view>
        <cover-view class="video-controls-container" :class="(!fullScreen || !showVideoControls) ? 'hidden' : '' ">
          <cover-image class="controls-img" :src='playVideo ? "/static/img/images/live_icon_stop_full.png":"/static/img/images/live_icon_play_full.png"' @click.stop="playVideo ? 'handleStop' : 'handlePlay'"></cover-image>
          <cover-image class="controls-img" :src='!openSound ? "/static/img/images/live_icon_unsound_full.png":"/static/img/images/live_icon_sound_full.png"' @click.stop="handleSound"></cover-image>
          <cover-image class="controls-img" @click.stop="ToggleObjectFit" src="/static/img/images/live_icon_adapt_full.png"></cover-image>
        </cover-view>
        <cover-view class="ptz-limit" :class="ptzLimit ? ptzLimit : 'hidden'"></cover-view>
      </live-player>

    </view>
    <view class="controls-container">
      <view class="controls-item" @click.stop="screenShoot">
        <image class="item-img" :src="(playVideo && videoLoadingStatus == 100) ? '/static/img/images/preview_cut_normal.png' : '/static/img/images/preview_cut_disable.png'"></image>
        <text :class="(playVideo && videoLoadingStatus == 100) ? 'item-text' : 'item-text disabled'" >截屏</text>
      </view>
      <button class="controls-item" open-type="share">
        <image class="item-img" src="/static/img/images/preview_share_normal.png"></image>
        <text class="item-text" >分享</text>
      </button>
    </view>
    
    <view :hidden="panelStatus == 1 || panelStatus == 2">
      <view class="panel-container">
        <view v-for="(item) in list" :key="item.id">
          <view class="panel-item" :data-value="item.id" @click.stop="tapPanel">
            <view class="panel-imgage-container">
              <image class="panel-image" :src="item.status === 0 ? item.normalPath: (item.status === 1 ? item.activePath : item.disablePath)"></image>
            </view>
            <view class="panel-name">{{item.name}}</view>
          </view>
        </view>
      </view>
    </view>
    <view :hidden="panelStatus !== 1" class="ptz-container">
      <view class="close">
        <image @click.stop="handleBackPanel" class="close-img" src="/static/img/images/yuntai/close.png"></image>
      </view>
      <view class="ptz-img-container" id="ptz-img-container" @touchstart="handlePtzTouchStart" @touchend="handlePtzTouchEnd">
        <image class="ptz-img" :src="currentPtzImg"></image>
      </view>
    </view>
    <view class="voice-container" :hidden="panelStatus !==2">
      <view class="close">
        <image @click.stop="handleBackPanel" class="close-img" src="/static/img/images/yuntai/close.png"></image>
      </view>
      <view class="voice-list-title">默认语音</view>
      <scroll-view class="scroll-view" enable-flex="true" scroll-y="true" style="height:100px;" bindscrolltolower="defaultScrollLower">
        <view v-for="(item) in defaultVoiceList" :key="item.fileUrl" class="voice-list-container">
          <view class="voice-list-item" @click.stop="playVoice" :data-value="item" data-type="default">
            <view class="name"> {{item.voiceName}}</view>
            <image class="gif" :src="activeDefaultVoiceName == item.voiceName ? '/static/img/images/voice.gif' : '/static/img/images/voice_normal.png'"></image>
          </view>
        </view>
        <view class="list-loading" :hidden="!defaultVoiceListLoading">正在载入更多...</view>
        <view class="list-loading" :hidden="(defaultVoiceListLoading || !defaultVoiceNoMore)">已加载全部</view>
      </scroll-view>
      <view class="voice-list-title">录制语音</view>
      <scroll-view  class="scroll-view" enable-flex="true" scroll-y="true" style="height:100px" bindscrolltolower="customScrollLower">
        <view v-for="(item) in customVoiceList" :key="item.fileUrl" class="voice-list-container">
          <view class="voice-list-item" @click.stop="playVoice" :data-value="item"  data-type="custom">
            <view class="name"> {{item.voiceName}}</view>
            <image class="gif" :src="activeCustomVoiceName == item.voiceName ? '/static/img/images/voice.gif' : '/static/img/images/voice_normal.png'"></image>
          </view>
        </view>
        <view class="list-loading" :hidden="!customVoiceListLoading">正在载入更多...</view>
        <view class="list-loading" :hidden="(customVoiceListLoading || !customVoiceNoMore)">已加载全部</view>
      </scroll-view>
      <button class="btn primary" :disabled="sendingOnceVoice" @ouchstart="speakStart" @touchend="speakEnd">{{ sendingOnceVoice ? '请稍后...' : (recoderTime === 60 ? '按住说话': '松开结束')}}</button>
    </view>

    <!-- <view class="backToLiveIcon" style="position: fixed; bottom: 20rpx; right: 20rpx">
      <button @click.stop="goToLive" style="text-align: center; font-size: 14px; background: #FF8F42;padding: 8">
        <view><cover-image class="back-img" src="/static/img/images/nav_icon_back_full.png"></cover-image>进入回放</view>
      </button>
    </view>
    <mp-dialog title="{{dialogTitle}}" show="{{dialogShow}}" bindbuttontap="tapDialogButton" buttons="{{buttons}}">
      <view>{{dialogContent}}</view>
    </mp-dialog> -->
  </view>
</template>
<script>
import { DateFormat } from '@/common/utils';

const recorderManager = wx.getRecorderManager();

const options = {
  duration: 60000, //指定录音的时长，单位 ms，最大为10分钟（600000），默认为1分钟（60000）
  sampleRate: 16000, //采样率
  numberOfChannels: 1, //录音通道数
  format: 'mp3', //音频格式，有效值 aac/mp3
}

var livePlayerContext;
export default {
  data() {
    return {
      scene: 1001,
      accessToken: this.$getStorage('ysToken'),
      deviceSerial: 'F72584666',
      channelNo: '1',
      list: [
        {
          id: 'ptz',
          name: '云台控制',
          status: -1,
          normalPath: '/static/img/images/ptz.png',
          disablePath: '/static/img/images/ptz_disable.png',
          activePath:'/static/img/images/ptz.png',
        },
        {
          id: 'voice',
          name: '语音播报',
          status: -1,
          normalPath: '/static/img/images/voice.png',
          disablePath: '/static/img/images/voice_disable.png',
          // activePath: '/static/img/images/voice_active.png',
          activePath: '/static/img/images/voice.gif',
        },
        {
          id: 'mirror',
          name: '镜像翻转',
          status: -1,
          normalPath: '/static/img/images/fanzhuan.png',
          disablePath: '/static/img/images/fanzhuan_disable.png',
          activePath: '/static/img/images/fanzhuan.png',
        },
        {
          id: 'cover',
          name: '镜头遮蔽',
          status: -1,
          normalPath: '/static/img/images/yinsi.png',
          disablePath: '/static/img/images/yinsi_disable.png',
          activePath: '/static/img/images/yinsi_active.png',
        },
      ],
      videoSrc:"",
      videoHDSrc: "",
      panelStatus: 0, //0: 展示面板 1：进入云台 2-进入语音播报 3-进入镜像翻转 4-进入镜头遮蔽,
      ptzDisabled: true,
      voiceDiasbled: true,
      mirrorDisabled: true,
      mirrorInterval: false,
      coverDisabled: true,
      coverInterval: false,
      showVideoControls: true,
      autoHideTimer: undefined,
      videoLoadingStatus: 0,
      playVideo: false,
      videoNetWorkError: false,
      objectFit:'contain',
      openSound: true,
      isHD: false,
      showHDSelect: false,
      fullScreen: false,
      ptzStatus: 0, //0-初始化 1-top noraml 2-downnoraml 3-left normal 4-right normal  5-top noraml 6-down limit 7-left limit 8-right limit
      ptzLoading: false,
      ptzLimit: '',
      deviceOffline: false,
      deviceOfflineTime: new Date(),
      deviceName: '',
      currentPtzImg: '/static/img/images/yuntai/normal.png',
      // 语音播报
      activeDefaultVoiceName: '',
      activeCustomVoiceName: '',
      defaultVoiceList: [], // 默认语音列表
      defaultVoiceTotal: 0, // 默认语音总数
      defaultVoicePage: 0,   // 默认语言当前页
      defaultVoiceListLoading: false,
      defaultVoiceNoMore: false,
      customVoiceList: [], // 默认语音列表
      customVoiceTotal: 0, // 默认语音总数
      customVoicePage: 0,   // 默认语言当前页
      customVoiceListLoading: false,
      customVoiceListNoMore: false,
      recoderTime:60,
      recoderTimer: undefined,
      sendingOnceVoice: false,
      dialogTitle: '',
      dialogContent: '',
      buttons: [{text: '知道了'}],
      dialogShow: false,
      pathParam: ''
    }
  },
  onShow () {
    console.log("show");
    var launchOptions = wx.getLaunchOptionsSync();
    const pathParam = launchOptions.query.scene;
    console.log('pathParam:',pathParam);
    this.pathParam = pathParam
    if (pathParam) {
      this.getWxaInfo();
    }
    this.checkNetWork();
  },
  onHide () {
    console.log("hide")
    this.panelStatus = 0
  },
  onError (msg) {
    console.log(msg)
  },
  onLoad(query){
    var launchOptions = wx.getLaunchOptionsSync();
    if (this.accessToken) {
      this.getPlayUrl();
      this.getDeviceInfo();
      this.getDeviceCoverInfo();
    }
    this.showOneButtonDialog = true

    recorderManager.onStart(() => {
      console.log('recorder start');
    })
    recorderManager.onPause(() => {
      console.log('recorder pause');
      this.speakEnd();
    })
    recorderManager.onInterruptionBegin(this.speakEnd);

    recorderManager.onStop((res) => {
      console.log('recorder stop', res)
      const { recoderTime } = this;
      const { tempFilePath } = res;
      if(recoderTime >= 59) {
        this.recoderTime = 60
        clearTimeout(this.recoderTimer);
        return false;
      }
      this.sendingOnceVoice = true
      wx.uploadFile({
        url: 'https://open.ys7.com/api/lapp/voice/sendonce', //仅为示例，非真实的接口地址
        filePath: tempFilePath, //tempFilePaths[0],
        name: 'voiceFile',
        formData: {
          accessToken: this.accessToken,
          deviceSerial: this.deviceSerial,
          channelNo: this.channelNo,
        },
        header: {
          'content-type': 'amultipart/form-data' // 默认值
        },
        success: (res)=> {
          let data = res.data;
          if(!data.code){
            data = JSON.parse(data);
          }
          if(data.code == 200) {
            console.log("发送成功");
          }else if(data.code =='111012') { // 设备正忙
            wx.showToast({
              title: '操作中，请稍后再试',
              icon:'none',
            })
          }else if(data.code =='20007') { // 设备正忙
            wx.showToast({
              title: '设备不在线',
              icon:'none',
            })
          }else if(data.code =='20008') { // 设备正忙
            wx.showToast({
              title: '设备响应超时',
              icon:'none',
            })
          }else {
            wx.showToast({
              title: data.msg,
              icon: 'none',
            })
          }
          this.recoderTime = 60
          //do something
        },
        fail: (res)=>{
          wx.showToast({
            title: '网络异常',
            icon: 'none'
          })
        },
        complete: ()=>{
          this.sendingOnceVoice = false
        }
      })
    })
    recorderManager.onFrameRecorded((res) => {
      const { frameBuffer } = res
      console.log('frameBuffer.byteLength', frameBuffer.byteLength)
    });
    //视频
    livePlayerContext = wx.createLivePlayerContext('livePlayer');
    console.log("livePlayerContext", livePlayerContext);
    
  },
  methods: {
    checkNetWork(){
      wx.getNetworkType({
        success (res) {
          const networkType = res.networkType
          if(!networkType || networkType === 'none'){
            wx.showToast({
              title: '当前网络异常',
              icon: 'none',
              duration: 2000,
            })
          }
        }
      })
    },
    getPlayUrl(){
      const { accessToken, deviceSerial, channelNo } = this;
      var _this = this;
      wx.request({
        url: 'https://open.ys7.com/api/lapp/v2/live/address/get', //仅为示例，并非真实的接口地址
        method: 'POST',
        data: {
          accessToken: accessToken,
          deviceSerial: deviceSerial,
          channelNo: channelNo,
          expireTime: 86400,
          quality: 2,
          protocol: 3,
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: (res) => {
          console.log(res.data);
          const { list } = this;
          if(res.data.code ==200 && res.data.data && res.data.data.url){
            var result = res.data;
            if(result.code == 200){
              _this.videoSrc = result.data.url
            } else {
              list[0].status = -1;
              list[1].status = -1;
              list[2].status = -1;
              list[3].status = -1;
              _this.list = list
              _this.dialogContent = result.msg
              _this.showVideoControls = false
            }
          } else if (res.data.code == "20001" ||res.data.code == "20002" || res.data.code == '20018'|| res.data.code == '10001'){ // 设备不存在 / 不属于用户
            this.dialogTitle = '获取播放地址失败'
            this.dialogContent = 'dialogContent'
            this.dialogShow = true
          }else {
            console.log("获取播放地址失败")
          }
        }
      });
      wx.request({
        url: 'https://open.ys7.com/api/lapp/v2/live/address/get', //仅为示例，并非真实的接口地址
        method: 'POST',
        data: {
          accessToken: accessToken,
          deviceSerial: deviceSerial,
          channelNo: channelNo,
          expireTime: 86400,
          quality: 1,
          protocol: 3,
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: (res) => {
          console.log(res.data);
          const { list } = this;
          if(res.data.code ==200 && res.data.data && res.data.data.url){
            var result = res.data;
            if(result.code == 200){
              _this.videoHDSrc = result.data.url
            }else {
              list[0].status = -1;
              list[1].status = -1;
              list[2].status = -1;
              list[3].status = -1;
              _this.list = list
              _this.dialogContent = result.msg
              _this.showVideoControls = false
            }
          }else {
            console.log("获取高清播放地址失败")
            // _this.openPlayUrl();
          }
        }
      })
    },
    /*
    * 获取设备基本信息
    */
  getDeviceCoverInfo(){
    const { accessToken, deviceSerial, channelNo } = this;
    console.log(accessToken,deviceSerial,channelNo);
    var _this = this;
      wx.request({
        url: 'https://open.ys7.com/api/lapp/device/scene/switch/status',
        method: 'POST',
        data: {
          accessToken,
          deviceSerial,
          channelNo,
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success:(res) =>{
          console.log(res.data);
          if(res.data.code ==200 && res.data.data){
            const result = res.data.data;
            let list = this.list;
            if(result.enable == 1){ // 当前镜头遮蔽中
              list[0].status = -1;
              list[1].status = -1;
              list[2].status = -1;
              list[3].status = 1;
              this.videoNetWorkError = false
              this.showVideoControls = false
              this.panelStatus = 4
              this.videoLoadingStatus = 100
              this.list = list
              console.log("panelStatus",this.panelStatus)
            }
          }
        },
        error:(err)=>{
          console.log(err);
        },
      })
    },

    /*
    * 获取设备基本信息
    */
    getDeviceInfo(){
      const { accessToken, deviceSerial, channelNo ,showVideoControls, videoNetWorkError,videoLoadingStatus } = this;
      var _this = this;
      wx.request({
        url: 'https://open.ys7.com/api/lapp/device/info', //仅为示例，并非真实的接口地址
        method: 'POST',
        data: {
          accessToken,
          deviceSerial,
          channelNo,
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success:(res) =>{
          console.log(res.data);
          if(res.data.code ==200 && res.data.data){
            let list = this.list;
            var result = res.data.data;
            _this.deviceName = result.deviceName
            _this.deviceOffline = result.status !== 1
            _this.videoNetWorkError = result.status !==1 ? false : videoNetWorkError
            _this.showVideoControls = result.status !==1 ? false : showVideoControls
            _this.deviceOfflineTime = DateFormat(new Date(result.updateTime),'yyyy-MM-dd hh:mm:ss')
            _this.deviceIsEncrypt = result.isEncrypt
            _this.videoLoadingStatus = (result.isEncrypt === 1 || result.status !== 1) ? 100 : videoLoadingStatus
            // 配置标题
            if(result.deviceName){
              wx.setNavigationBarTitle({
                title: result.deviceName,
              }) 
            }
            if(result.status != 1 ){ // 设备不在线
              list[0].status = -1;
              list[1].status = -1;
              list[2].status = -1;
              list[3].status = -1;
              _this.list = list
              _this.showVideoControls = false
            }else if(result.isEncrypt == 1 ){ // 设备被加密
              list[0].status = -1;
              list[1].status = -1;
              list[2].status = -1;
              list[3].status = -1;
              _this.list = list
              _this.dialogTitle = '设备被加密'
              _this.dialogContent = '设备已被加密，无法继续查看，请前往萤石云app解密。'
              _this.dialogShow = true
              _this.showVideoControls = false
            } else {
              // 获取设备能力
              // _this.getDeviceCapacity();
              _this.getDeviceCoverInfo();
            }
          } else if (res.data.code == "20001" ||res.data.code == "20002" || res.data.code == '20018'){ // 设备不存在 / 不属于用户
            this.dialogTitle = '获取播放地址失败'
            this.dialogContent ='该用户不拥有该设备',
            this.dialogShow = true
          }else if(res.data.code == 10029){
            wx.showToast({
              title: '个人版接口调用超限，请升级企业版',
              icon: 'none',
            })
          }else if(res.data.code == 10002){
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
            })
            setTimeout(()=>{
              this.pageBack();
            },2000)
          }else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
          }
        }
      })
    },
    /*
    * 获取设备能力集
    */
  getDeviceCapacity(){
    const { accessToken,deviceSerial,channelNo,playVideo} = this;
    var _this = this;
    wx.request({
      url: 'https://open.ys7.com/api/lapp/device/capacity',
      method: 'POST',
      data: {
        accessToken,
        deviceSerial,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success:(res) =>{
        console.log(res.data);
        if(res.data.code ==200 && res.data.data){
          var result = res.data.data;
          let list = this.list;
          list[0].status = result.support_ptz == 0 ? -1 : 0;
          list[1].status = result.support_talk != 1 ? -1 : 0;
          list[2].status = result.ptz_top_bottom_mirror == 0 ? -1 : 0;
          list[3].status = result.support_privacy == 0 ? -1 : 0;
          if(!playVideo){ // 非视频播放成功状态下
            list[0].status = -1;
            list[2].status = -1;
          }
          _this.setData({
            list: list,
          })
        } else if (res.data.code == "20002" || res.data.code == '20018'){ // 设备不存在 / 不属于用户
          this.setData({
            dialogTitle: '设备被删除',
            dialogContent: '设备已从账号下删除，无法继续查看',
            dialogShow: true,
          })
        }
      }
    })
  },
    // fullScreen(){
    //   var _this = this;
    //   livePlayerContext.requestFullScreen({
    //     direction: 90,
    //     success: function(){
    //       _this.setData({
    //         fullScreen: true,
    //       })
    //     }
    //   });
    //   console.log("开启全屏");
    // },
    // unfullScreen() {
    //   var _this = this;
    //   livePlayerContext.exitFullScreen({
    //     success: function(){
    //       _this.setData({
    //         fullScreen: false,
    //       })
    //     }
    //   });
    //   console.log("开启全屏");
    // },
    ToggleObjectFit(){
      var objectFit = this.objectFit;
      this.objectFit = objectFit === 'contain' ? 'fillCrop': 'contain'
    },
    fullscreenChange(event){
      console.log("监听到全屏变化", event)
    },
    getDefaultVoice: function () {
      const { accessToken } = this;
      var _this = this;
      console.info("默认语音： 第" + _this.data.defaultVoicePage + "页");
      var _this = this;
      _this.defaultVoiceListLoading = true
      wx.request({
        url: 'https://open.ys7.com/api/lapp/voice/query', //仅为示例，并非真实的接口地址
        method: 'POST',
        data: {
          "accessToken": accessToken,
          "default": "true",
          "pageStart": _this.data.defaultVoicePage,
          "pageSize": 5,
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success(res) {
          console.log(res.data);
          var defaultVoiceList = _this.defaultVoiceList;
          defaultVoiceList = defaultVoiceList.concat(res.data.data);
          if(res.data.data && res.data.data.length>0){
            _this.defaultVoiceList = defaultVoiceList
            _this.defaultVoicePage = _this.defaultVoicePage + 1
          }else {
            _this.defaultVoiceNoMore = true
          }
          _this.sdefaultVoiceListLoading = false
        },
        error(error){
          console.log(error);
          _this.defaultVoiceListLoading = false
        }
      })
    },
    getCustomVoice: function () {
      const { accessToken } = this;
      var _this = this;
      console.info("用户自定义语音： 第" + _this.defaultVoicePage + "页");
      var _this = this;
      _this.customVoiceListLoading = true
      wx.request({
        url: 'https://open.ys7.com/api/lapp/voice/query', //仅为示例，并非真实的接口地址
        method: 'POST',
        data: {
          "accessToken": accessToken,
          default:false,
          "pageStart": _this.data.defaultVoicePage,
          "pageSize": 5,
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success(res) {
          console.log(res.data);
          var customVoiceList = _this.customVoiceList;
          customVoiceList = customVoiceList.concat(res.data.data);
          if(res.data.data && res.data.data.length>0){
            _this.customVoiceList = customVoiceList
            _this.customVoicePage = _this.customVoicePage + 1
          }else {
            _this.customVoiceNoMore = true
          }
          _this.customVoiceListLoading = false
        },
        error(error){
          console.log(error);
          _this.customVoiceListLoading = false
        }
      })
    },
    // 滚动至低端事件
    defaultScrollLower: function () {
      var _this = this;
      console.info("defaultScrollLower 第" + _this.data.defaultVoicePage + "页");
      this.getDefaultVoice();
    },
    // 滚动至低端事件
    customScrollLower: function () {
      var _this = this;
      console.info("customScrollLower 第" + _this.data.defaultVoicePage + "页");
      this.getCustomVoice();
    },
    handlePlay(callback){
      console.log("handelPlay",this.playVideo,this.isHD);
        this.checkNetWork()
        livePlayerContext.play({
          success: ()=>{
            this.showVideoControls = true
            this.videoNetWorkError = false
            if(callback && typeof callback === "function"){
              callback();
            }
          },
          fail: (error)=>{
            this.checkNetWork();
            wx.showToast({
              title: '网络异常',
              icon:'none',
            })
            console.log("开始播放失败");
            this.videoNetWorkError = true
            this.showVideoControls = false
            this.videoLoadingStatus = 100
          }
        })
    },
    handleStop(callback){
      console.log("stop");
      const { list } = this;
      livePlayerContext.stop({
        success: ()=>{
          list[0].status = -1;
          this.playVideo = false
          this.videoLoadingStatus = 0
          this.list = list
          this.panelStatus = 0
          if(callback && typeof callback === "function"){
            callback();
          }
        },
        fail: (error)=>{
          console.log("停止播放失败")
        }
      })
    },
    autoHideControl(){
      console.log("showHdSelect",this.showHDSelect);
        const _this = this;
        clearTimeout(this.autoHideTimer);
        this.autoHideTimer = setTimeout(()=>{
          const { showHDSelect } = _this;
          if(!showHDSelect){
            this.showVideoControls = false
          }
        },5000);
    },
    handleSound(e){
      var openSound = this.openSound;
      this.openSound = !openSound
    },
    handleHD(e){
      var showHDSelect = this.showHDSelect;
      console.log("handleHD",showHDSelect)
      this.showHDSelect = !showHDSelect
    },
    changeVideoHD(e){
      var _this = this;
      this.setData({
        showHDSelect: false,
        isHD: true
      });
      this.handleStop(_this.handlePlay);
    },
    changeVideoNormal(e) {
        this.setData({
          showHDSelect: false,
          isHD: false
        })
        this.handleStop(this.handlePlay);
    },
    statechange(e) {
      console.log('live-player code:', e.detail.code,e.detail);
      const { code } = e.detail;
      let { videoLoadingStatus,list,panelStatus } = this;
      switch (code){
        case 2007: //启动loading
          videoLoadingStatus = 0;
          this.setData({
            playVideo: true,
            videoLoadingStatus: 0,
          })
          break;
        case 2001: //连接服务器
          videoLoadingStatus = 20 + Math.floor(Math.random()*10+1);
          break;
        case 2002: //已经连接 RTMP 服务器,开始拉流
          videoLoadingStatus = 40 + Math.floor(Math.random()*10+1);
          break;
        case 2008: // 解码器启动
          break;
        case 2009: //视频分辨率改动
          break;
        case 2004: // 视频播放开始
          videoLoadingStatus = 80 + Math.floor(Math.random()*10+1);
          break;
        case 2003: //网络接收到首个视频数据包(IDR)
        videoLoadingStatus = 100;
        this.setData({
          playVideo: true,
        })
        this.autoHideControl();
        this.getDeviceCapacity();
        break;
        case 2103: //网络断连, 已启动自动重连（本小程序不自动重连）
        // videoLoadingStatus = 100;
        // this.handleStop();
        // 获取设备状态
        // this.getDeviceInfo();
        break;
        case 3001:
        case 3002:
        case 3003:
        case 3005: // 播放失败
        videoLoadingStatus = 100;
        // this.getDeviceInfo();
        this.checkNetWork();
        this.handleStop(this.playError);
        list[2].status = -1;
        this.setData({
          // playVideo: false,
          showVideoControls: false,
          videoNetWorkError: true,
          videoLoadingStatus: 100,
          list: list,
        })
        break;
        case -2301: // 经多次重连抢救无效，更多重试请自行重启播放
          videoLoadingStatus = 100;
          this.setData({
            // playVideo: false,
            showVideoControls: false,
            videoNetWorkError: true,
            videoLoadingStatus: 100,
          })
          break;
      }
      this.setData({
        videoLoadingStatus: videoLoadingStatus
      })
    },
    playError(){
      this.setData({
        showVideoControls: false,
        videoNetWorkError: true,
        videoLoadingStatus: 100,
      });
      // this.getPlayUrl();
      this.getDeviceInfo();
      this.getDeviceCoverInfo();
    },
    error(e) {
      console.log('live-player',e);
      console.error('live-player error:', e.detail.errMsg)
      if(e.detail.errCode == 10001){
        wx.showToast({
          title: '视频直播对讲需要你手机授权微信录音或麦克风权限',
          icon:'none',
          duration:3000,
        })
      }
    },
    onVideoTap(e){
      console.log("点击视频");
      const { deviceOffline,showVideoControls,panelStatus,videoNetWorkError} = this;
      if(deviceOffline || panelStatus === 4 || videoNetWorkError){
        return false;
      }
      if(showVideoControls){
        this.setData({
          showVideoControls: false,
        });
        clearTimeout(this.autoHideTimer);
      }else {
        this.setData({
          showVideoControls: true,
        })
        this.autoHideControl();
      }
    },
    tapPanel: function(event) {
      const { accessToken, deviceSerial, channelNo } = this;
      var tValue = event.currentTarget.dataset.value;
      var list = this.list;
      var panelStatus = this.panelStatus;
      switch (tValue) {
        case 'ptz':
          if(list[0].status === -1){
            return false;
          }
          panelStatus = 1;
          // list[0].status = 1;
          // list[1].status = 0;
          // list[2].status = 0;
          // list[3].status = 0;
          break;
        case 'voice':
          if(list[1].status === -1) {
            return false;
          }
          panelStatus = 2;
          this.getDefaultVoice();
          this.getCustomVoice();
          break;
        case 'mirror':
          if(list[2].status === -1){
            return false;
          }
          if(panelStatus === 3){
            panelStatus = 0;
            // list[0].status = 0;
            // list[1].status = 0;
            list[2].status = 0;
            // list[3].status = 0;
            this.sceneMirror(2);
          }else{
            panelStatus = 3;
            // list[0].status = 0;
            // list[1].status = 0;
            // list[2].status = 1;
            // list[3].status = 0;
            this.sceneMirror(2);
          }
          break;
        case 'cover':
          if(list[3].status === -1){
            return false;
          }
          if (panelStatus === 4){ // 镜头遮蔽中
            // panelStatus = 0;
            // list[0].status = 0;
            // list[1].status = 0;
            // list[2].status = 0;
            // list[3].status = 0;
            // this.getDeviceCapacity();
            this.sceneCover(0);
          }else{
            // panelStatus = 4;
            // list[0].status = 0;
            // list[1].status = 0;
            // list[2].status = 0;
            // list[3].status = 1;
            this.sceneCover(1);
          }
          break;
        default:
          panelStatus = 0;
      }
      this.setData({
        panelStatus: panelStatus,
        list: list
      })
    },
    startRecord(e){
      recorderManager.start(options)
    },
    stopRecord(e){
      recorderManager.stop()
    },
    handleBackPanel(event){
      var tValue = event.currentTarget.dataset.value;
      this.setData({
        panelStatus:0,
      })
    },
    handlePtzTouchStart(event){
      // var { offsetLeft, offsetTop } = event.currentTarget;
      // var {clientX,clientY} = event.touches[0];
      var { ptzStatus,ptzLoading } = this;
      // var centerLeft = 104 + offsetLeft;
      // var centerTop = 104 + offsetTop;
      // var left = clientX - centerLeft;
      // var top = clientY - centerTop;
      wx.createSelectorQuery().select('#ptz-img-container').boundingClientRect( (rect) => {
        let { clientX,clientY} = event.touches[0];
        let rectLeft = rect.left;
        let rectTop = rect.top;

        var centerLeft = 104 + rectLeft;
        var centerTop = 104 + rectTop;
        var left = clientX - centerLeft;
        var top = clientY - centerTop;

        console.log("点击了页面方位：pageY",clientY);
        console.log("云盘位置：top",rect.top);
        if(ptzLoading){
          wx.showToast({
            title: '操作过于频繁，建议长按转动',
            icon: 'none'
          })
          return false;
        }
        if(Math.abs(left) > Math.abs(top)){
          if(left>0){
            this.handlePtzControl(3);
            ptzStatus = 4;
          }else {
            ptzStatus = 3;
            this.handlePtzControl(2);
          }
        } else {
          if (top > 0) {
            ptzStatus = 2;
            this.handlePtzControl(1);

          } else {
            ptzStatus = 1;
            this.handlePtzControl(0);
          }
        }
        this.setData({
          ptzStatus: ptzStatus,
        })

      }).exec();
    },
    handlePtzTouchEnd(event) {
      let { clientX, clientY } = event.changedTouches[0];
      const _this = this;
      wx.createSelectorQuery().select('#ptz-img-container').boundingClientRect( (rect) => {
        let rectLeft = rect.left;
        let rectTop = rect.top;

        var centerLeft = 104 + rectLeft;
        var centerTop = 104 + rectTop;
        var left = clientX - centerLeft;
        var top = clientY - centerTop;
        if (Math.abs(left) > Math.abs(top)) {
          if (left > 0) {
            _this.handlePtzControl(3,'stop');
          } else {
            _this.handlePtzControl(2, 'stop');
          }
        } else {
          if (top > 0) {
            _this.handlePtzControl(1, 'stop');
          } else {
            _this.handlePtzControl(0,'stop');
          }
        }
      }).exec();
      this.setData({
        ptzStatus: 0,
      })
    },
    handlePtzControl(position,type){
      const { accessToken, deviceSerial, channelNo,ptzLoading } = this;
      let ptzLimit = '';
      const ptzTopImgSuccess = '/static/img/images/yuntai/top.png';
      const ptzTopImgFailed  = '/static/img/images/yuntai/top_limit.png';
      const ptzDownImgSuccess = '/static/img/images/yuntai/down.png';
      const ptzDownImgFailed  = '/static/img/images/yuntai/down_limit.png';
      const ptzLeftImgSuccess = '/static/img/images/yuntai/left.png';
      const ptzLeftImgFailed  = '/static/img/images/yuntai/left_limit.png';
      const ptzRightImgSuccess = '/static/img/images/yuntai/right.png';
      const ptzRightImgFailed  = '/static/img/images/yuntai/right_limit.png';
      const ptzNormalImg =  '/static/img/images/yuntai/normal.png';
      let ptzStatus = this.ptzStatus;
      let currentPtzImg = this.currentPtzImg;
      var url = 'https://open.ys7.com/api/lapp/device/ptz/start';
      if(type == 'stop'){
        url = 'https://open.ys7.com/api/lapp/device/ptz/stop'
      }
      if(ptzLoading && type === 'start'){
        wx.showToast({
          title: '操作过于频繁，建议长按转动',
          icon: 'none'
        })
        return false;
      }

      this.setData({
        ptzLoading: true,
      })
      wx.request({
        url: url, //仅为示例，并非真实的接口地址
        method: 'POST',
        data: {
          "accessToken": accessToken,
          "deviceSerial": deviceSerial,
          "channelNo": channelNo,
          "direction": position,
          speed:1,
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: (res) => {
          const code = res.data.code;
          if(code == 10029){
            wx.showToast({
              title: '个人版接口调用超限，请升级企业版',
              icon: 'none',
            })
          }else if(code != 200){
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
            })
          }
          if(type == 'stop'){
            ptzStatus = 0;
            currentPtzImg = ptzNormalImg;
          }else{
            switch(position){
              case 0:
                ptzStatus = 1;
                currentPtzImg = code == 200 ? ptzTopImgSuccess : ptzTopImgFailed;
                ptzLimit = code == 200 ? '' : 'top';
                break;
              case 1:
                ptzStatus = 2;
                currentPtzImg = code == 200 ? ptzDownImgSuccess : ptzDownImgFailed;
                ptzLimit = code == 200 ? '' : 'down';
                break;
              case 2:
                ptzStatus = 3;
                currentPtzImg = code == 200 ? ptzLeftImgSuccess : ptzLeftImgFailed;
                ptzLimit = code == 200 ? '' : 'left';
                break;
              case 3:
                ptzStatus = 4;
                currentPtzImg = code == 200 ? ptzRightImgSuccess : ptzRightImgFailed;
                ptzLimit = code == 200 ? '' : 'right';
                break;
              default:
                ptzStatus = 0;
                currentPtzImg = ptzTopImgSuccess;
                ptzLimit = '';
              }
            }
            this.setData({
              ptzStatus: ptzStatus,
              currentPtzImg: currentPtzImg,
              ptzLoading: false,
              ptzLimit: ptzLimit,
            });
        },
        error:(err) =>{
          this.setData({
            ptzLoading: false,
          })
        }
      })
    },
    screenShoot(e){
      const { playVideo,videoLoadingStatus  } = this;
      if(!playVideo || videoLoadingStatus != 100){
        console.log("非播放状态下点击截图");
        return false;
      }
      console.log("开始截图")
      // livePlayerContext.snapshot('raw');
      let that = this
      wx.getSetting({
        success(res) {
          if (res.authSetting['scope.writePhotosAlbum']) {
            that.saveImg();
          } 
          else if (res.authSetting['scope.writePhotosAlbum'] === undefined) {
            wx.authorize({
              scope: 'scope.writePhotosAlbum',
              success() {
                that.saveImg();
              },
              fail() {
                that.authConfirm()
              }
            })
          } 
          else {
            that.authConfirm()
          }
        }
      })
    
    },
    saveImg(){
      livePlayerContext.snapshot('raw')
      .then(data =>{
        console.log("data",data);
            if (data) {
              console.log(data)
              wx.saveImageToPhotosAlbum({
                filePath: data.tempImagePath,
                success(res) { 
                  console.log("保存成功",res)
                  wx.showToast({
                    title: '截图已保存至手机相册',
                    icon: 'none',
                  })
                }
              })
            }
      })
      .catch(err => {
        console.log("err",err);
      })
    },
    // 授权拒绝后，再次授权提示弹窗
  authConfirm(){
    let that = this
    wx.showModal({
      content: '您没打开保存图片权限，是否去设置打开？',
      confirmText: "确认",
      cancelText: "取消",
      success: function (res) {
        if (res.confirm) {
          wx.openSetting({
            success :(res) => {
              if (res.authSetting['scope.writePhotosAlbum']) {
                that.saveImg();
              }
              else {
                wx.showToast({
                  title: '您没有授权，无法保存到相册',
                  icon: 'none'
                })
              }
            }
          })
        } else {
          wx.showToast({
            title: '您没有授权，无法保存到相册',
            icon: 'none'
          })
        }
      }
    });
  },
    // 镜头遮蔽
    sceneCover(enable) {
      var _this = this;
      let { deviceSerial, channelNo,accessToken,coverInterval,list,panelStatus,videoNetWorkError } = this;
      if(coverInterval){
        wx.showToast({
          title: '操作过于频繁',
          icon: 'none'
        })
        return false;
      }
      this.setData({
        coverInterval: true,
      })
      wx.request({
        url: 'https://open.ys7.com/api/lapp/device/scene/switch/set',
        method: 'POST',
        data: {
          accessToken: accessToken,
          deviceSerial: deviceSerial,
          channelNo: channelNo,
          enable: enable,
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success:(res) =>{
          console.log(res.data);
          if(res.data.code == 200){
            if(enable == 0){
              list[3].status = 0;
              panelStatus = 0;
              videoNetWorkError = false;
              this.getDeviceCapacity();
              this.handlePlay();
            }else {
              list[0].status = -1;
              list[1].status = -1;
              list[2].status = -1;
              panelStatus = 4;
              list[3].status = 1;
              // this.handleStop();
            }
            setTimeout(()=>{
              this.setData({
                coverInterval: false,
              });
            },5000)
            this.setData({
              videoNetWorkError: videoNetWorkError,
              list:list,
              panelStatus:panelStatus
            })
          }else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
            })
            this.setData({
              coverInterval: false,
              panelStatus: panelStatus,
            });
          }
        },
        fail: (res)=>{
          wx.showToast({
            title: '网络异常',
            icon: 'none'
          })
          this.setData({
            coverInterval: false,
          });
        }
      });
    },
    // 镜象翻转
    sceneMirror(enable) {
      const { deviceSerial, channelNo,accessToken,mirrorInterval } = this;
      var _this = this;
      if(mirrorInterval) {
        wx.showToast({
          title: '操作过于频繁',
          icon: 'none'
        })
        return false;
      }
      this.setData({
        mirrorInterval: true,
      });
      wx.request({
        url: 'https://open.ys7.com/api/lapp/device/ptz/mirror', //仅为示例，并非真实的接口地址
        method: 'POST',
        data: {
          accessToken: accessToken,
          deviceSerial: deviceSerial,
          channelNo: channelNo,
          command: enable,
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success:(res) => {
          console.log(res.data);
          if(res.data.code == 200){
            setTimeout(()=>{
              this.setData({
                mirrorInterval: false,
              });
            },5000)
          }else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
            this.setData({
              mirrorInterval: false,
            });
          }
        },
        fail: (res)=>{
          wx.showToast({
            title: '网络异常',
            icon: 'none'
          })
          this.setData({
            mirrorInterval: false,
          });
        }
      })
    },
    playVoice(event){
      const { accessToken, deviceSerial, channelNo } = this;
      var { duration, voiceName,fileUrl } = event.currentTarget.dataset.value;
      var type = event.currentTarget.dataset.type;
      console.log("type",type)
      wx.request({
        url: 'https://open.ys7.com/api/lapp/voice/send', //仅为示例，并非真实的接口地址
        method: 'POST',
        data: {
          accessToken: accessToken,
          deviceSerial: deviceSerial,
          channelNo: channelNo,
          fileUrl: fileUrl,
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success:(res)=> {
          console.log(res.data);
          const { list } = this;
          if(res.data.code == 200){
            list[1].status = 1;
            this.setData({
              activeCustomVoiceName:  type === 'custom' ? voiceName : '',
              activeDefaultVoiceName: type === 'default' ? voiceName : '',
              list: list,
            });
            setTimeout(()=>{
              list[1].status = 0;
              this.setData({
                activeCustomVoiceName:  '',
                activeDefaultVoiceName: '',
                list: list,
              })
            },duration * 1000)
          }else if(res.data.code =='111012') { // 设备正忙
            wx.showToast({
              title: '操作中，请稍后再试',
              icon:'none',
            })
          }else if(res.data.code =='20007') { // 设备正忙
            wx.showToast({
              title: '设备不在线',
              icon:'none',
            })
          }else if(res.data.code =='20008') { // 设备正忙
            wx.showToast({
              title: '设备响应超时',
              icon:'none',
            })
          }else {
            wx.showToast({
              title: res.data.msg,
              icon:'none',
            })
          }
        },
        fail: (res)=>{
          wx.showToast({
            title: '网络异常',
            icon: 'none'
          })
        }
      })
    },
    speakStart(event){
      let recoderTime = this.recoderTime;
      this.setData({
        recoderTime: 59,
      })
      recorderManager.start(options);
      wx.showToast({
        icon: 'none',
        duration: 60000,
        image: '/static/img/images/voice_talk4.png',
        title: '剩余' + recoderTime
      });

      this.recoderTimer = setInterval(()=>{
        // _this.setData({
        //   recoderTime: --recoderTime
        // },1000)
        if(recoderTime > 0){
          --recoderTime;
          wx.showToast({
            icon: 'none',
            duration: 60000,
            image: '/static/img/images/voice_talk4.png',
            title: '剩余' + recoderTime
          });
          this.setData({
            recoderTime: recoderTime
          })
        }else {
          clearInterval(this.recoderTimer);
          this.speakEnd();
        }
        // console.log("recoderTime", recoderTime)
      },1000)
    },
    speakEnd(event) {
      wx.hideToast();
      let recoderTime = this.recoderTime;
      if(recoderTime >= 59){
        wx.showToast({
          title: '时间太短了',
          icon:'none',
        })
        recorderManager.stop();
        clearInterval(this.recoderTimer);
        return false;
      }else {
        wx.hideToast();
        recorderManager.stop();
        clearInterval(this.recoderTimer);
      }
    },
    tapDialogButton(e) {
      this.setData({
          dialogShow: false
      });
      this.pageBack();
    },
    pageBack() {
      const { scene } = this;
      console.log("scene",scene);
      // wx.showToast({
      //   title: `code ${scene}`,
      // })
      if([1007,1008,1036,1037,1038,1044].indexOf(scene) === -1){
        wx.navigateBack({
          delta: 1
        })
      } else {
        wx.reLaunch({
          url: '/pages/home/home',
        })
      }
    },
      /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function(res) {
      const { accessToken, deviceSerial, channelNo } = this;
      if (res.from === 'button') {
        // 来自页面内转发按钮
        console.log(res.target);
        this.setData({
          panelStatus: 0,
        })
      }
      return {
        title: '小程序',
        path:  '/pages/live/live?accessToken=' + accessToken + '&deviceSerial='+ deviceSerial + '&channelNo=' + channelNo + '&scene=1007',
      }
    },
    // 通过二位码进入直播，通过uuid获取accessToken、deviceSerial、channelNo
    getWxaInfo: function () {
      const { pathParam } = this;
      console.log('getWxaInfo:', pathParam)
      wx.request({
        url: 'https://open.ys7.com/device/getWxaInfo', //仅为示例，并非真实的接口地址
        method: 'POST',
        data: {
          uuid: pathParam
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success:(res)=> {
          console.log('通过uuid获取',res.data);
          const res1 = res.data.data;
          if (res1) {
            this.setData({
              accessToken: res1.accessToken, 
              deviceSerial: res1.deviceSerial, 
              channelNo: res1.channelNo
            });
            this.getPlayUrl();
            this.getDeviceInfo();
            this.getDeviceCoverInfo();
          }
        },
        fail: (res)=>{
          console.log('获取accesstoken失败');
          // wx.showToast({
          //   title: '网络异常',
          //   icon: 'none'
          // })
        }
      })
    },
    // 返回回放
    goToLive(){
      const { accessToken,deviceSerial, channelNo } = this;
      let url = '/pages/playback/playback?accessToken=' + accessToken + '&deviceSerial='+ deviceSerial + '&channelNo=' + channelNo;
      wx.navigateTo({
        url: url,
      })
    },
  }
}
</script>

<style>
page-live {
  background: #F8F8F8;
  min-height: 100vh;
}
.page-live .hd-select.hide {
  display: none;
}
.page-live .video-container {
  text-align: center;
  position: relative;
}
.page-live .video-container .ptz-limit {
  position: absolute;
  background: rgba(255,143,66,0.15);
  height: 0;
  width: 0;
}
.page-live .video-container .ptz-limit.right {
  top:0;
  right: 0;
  width: 30rpx;
  height: 420rpx;
}
.page-live .video-container .ptz-limit.left {
  top:0;
  left: 0;
  width: 30rpx;
  height: 420rpx;
}
.page-live .video-container .ptz-limit.top {
  position: absolute;
  top:0;
  left: 0;
  width: 100%;
  height: 30rpx;
}
.page-live .video-container .ptz-limit.down {
  position: absolute;
  bottom:0;
  left: 0;
  width: 100%;
  height: 30rpx;
}
.page-live .video-container .video-item {
  width: 100%;
  height: 420rpx;
  z-index: 0;
  background-image: linear-gradient(270deg, rgba(255,143,66,0.60) 0%, rgba(255,255,255,0.00) 100%);
}
.page-live .video-container .video-item.full-screen {
  height: 100%;
}
cover-view[hidden]{
  display: none!important;
}
.page-live .video-container .video-loading-container {
  position: relative;
  height: 100%;
  width: 100%;
  text-align: center;
  display: flex;
  justify-content:center;
  align-items: center;
}
.video-loading-container .video-loading-bg{
  position: absolute;
  top:0;
  left: 0;
  width: 100%;
}
.video-loading-container .video-loaing {
  position: absolute;
  width: 100%;
  text-align: center;
}
.video-loaing .loading-gif {
  display: inline-block;
  width: 80rpx;
  height: 80rpx;
}
.video-loading-container .video-loaing .video-loading-text {
  color: #fff;
  font-size: 28rpx;
  text-align: center;
  width: 100%;
  line-height: 40rpx;
  height: 40rpx;
}
.video-loading-container .video-loaing .video-loading-text.reTry {
  border: 2rpx solid #FFFFFF;
  border-radius: 40rpx;
  width: 156rpx;
  height: 60rpx;
  line-height: 60rpx;
  margin-top: 40rpx;
  display: inline-block;
}
.page-live .video-container .video-controls-container {
  position: absolute;
  width: 100%;
  bottom:0;
  z-index: 1000;
  display: flex;
  height: 84rpx;
  justify-content:space-around;
  align-items: flex-start;
  align-content: flex-start;
  flex-wrap:wrap;
}
.page-live .video-container .video-controls-container .controls-img {
  width: 60rpx;
  height: 60rpx;
}
.page-live .video-container .video-back-container {
  position: absolute;
  width: 360rpx;
  top:0;
  z-index: 1000;
  display: flex;
  height: 84rpx;
  justify-content:flex-start;
  align-items: flex-start;
  align-content: flex-start;
  flex-wrap:wrap;
}
.page-live .video-container .video-back-container{
    display: inline-block;
    width:100%;
    text-align: left;
    left: 0;
    background: rgba(0,0,0,0.30);
  }
.page-live .video-container .video-back-container .back-img {
  width: 40rpx;
  height: 40rpx;
  margin: 22rpx 20rpx 22rpx 30rpx;
  display: inline-block;
}
.page-live .video-container .video-back-container .back-device {
  color: #fff;
  display: inline-block;
  line-height: 84rpx;
  height: 84rpx;
  vertical-align: top;
}

.page-live .video-container .video-controls-container .hd {
  position: relative;
}

.page-live .hd-select {
  position: absolute;
  bottom: 84rpx;
  z-index: 1000;
  height: 130rpx;
  display: inline-block;
  width: 100rpx;
  left: 406rpx;
  background: rgba(0,0,0,0.70);
  border-radius: 16rpx;
  padding: 10rpx;
}
.page-live .hd-select .hd-option {
  font-size: 28rpx;
  color: #fff;
  letter-spacing: 0;
  height: 40rpx;
  line-break: 40rpx;
  padding: 10rpx;

}
.page-live .hd-select .hd-option.active {
  color: #FF8F42;
}

.page-live .controls-container {
  text-align: center;
  padding-top: 40rpx;
  display: flex;
  justify-content:space-around;
  align-items: center;
}
.page-live .controls-container .controls-item {
  display: inline-block;
  width: 30%;
  vertical-align: top;
  margin: 0;
}
button.controls-item {
  color: #999999;
  background: none;
  font-size: 32rpx;
  line-height: 60rpx;
  border: none;
  padding: 0;
  position: relative;
  display: inline-block;
}
button:after{display:none;}
.page-live .controls-container .controls-item .item-img {
  display: inline-block;
  width: 60rpx;
  height: 60rpx;
}
.page-live .controls-container .controls-item .item-text {
  font-size: 32rpx;
  color: #999999;
  letter-spacing: 0;
  display: inline-block;
  line-height: 60rpx;
  vertical-align: top;
  margin-left: 12rpx;
}
.page-live .controls-container .controls-item .item-text.disabled {
  color: #CCCCCC;
}
.page-live .panel-container {
  display: flex;
  height: calc(100vh - 600rpx);
  justify-content:space-around;
  align-items: flex-start;
  align-content: flex-start;
  flex-wrap:wrap;
}
.page-live .panel-container .panel-item {
  display: inline-block;
  width: 332rpx;
  height: 244rpx;
  margin-top:16rpx;
  background: #FFFFFF;
  box-shadow: 0 10rpx 42rpx 0 rgba(0,0,0,0.05);
  border:2rpx solid #fff;
  border-radius: 28rpx;
  text-align: center;
}
.panel-imgage-container .panel-image{
  width: 120rpx;
  height: 120rpx;
  margin-top:40rpx;
}
.panel-container .panel-item .panel-name {
  font-size: 24rpx;
  color: rgba(0, 0, 0, 0.65);
}
.ptz-container {
  width: 100%;
  height: 848rpx;
  background: #fff;
  text-align: center;

}
.close {
  text-align: right;
  padding: 0 30rpx;
}
.close .close-img {
  width: 36rpx;
  height: 36rpx;
  margin-top: 30rpx; 
  display: inline-block;
}
.ptz-container .ptz-img {
  display: inline-block;
  width: 416rpx;
  height: 416rpx;
}
.ptz-container .ptz-img-container{
  margin-top: 100rpx;
  display: inline-block;
}
.voice-list-container .voice-list-item {
  margin:20rpx 0;
  display: flex;
  justify-content: space-between;
  padding: 0 60rpx;
}
.voice-list-container .voice-list-item .name {
  font-size: 32rpx;
  color: #666666;
  letter-spacing: 0;
  line-height: 44rpx;
  display: inline-block;
}
.voice-list-container .voice-list-item .gif {
  width: 40rpx;
  height: 40rpx;
  display: inline-block;
}
.voice-list-title {
  font-size: 33rpx;
  color: #333333;
  letter-spacing: 0;
  line-height: 44rpx;
  margin:20rpx 0;
  padding:0 60rpx;
}
.scroll-view {
  display: flex;
  flex-direction: column;
  flex-flow: row wrap;
  min-height: 100%;
  align-self: flex-end;

}
.scroll-view .voice-list-container {
  width: 100%;
}

.scroll-view .voice-list-item {
  width: 86%;
  align-self: flex-end;
}

.list-loading {
  text-align: center;
  color: #666666;
  font-size: 20rpx;
  width: 100%;
  align-items: flex-end;
}
.btn.primary {
    background: #4C80F7;
  box-shadow: 0 10rpx 42rpx 0 rgba(0,0,0,0.05);
  border-radius: 16rpx;
  height: 92rpx;
  line-height: 92rpx;
  font-size: 32rpx;
  color: #FFFFFF;
  margin:0 60rpx 60rpx 60rpx;
}


.hidden {
  display: none!important;
}

.back-img {
  width: 40rpx;
  height: 40rpx;
  margin: 15rpx 0rpx;
  float: left;
}
</style>