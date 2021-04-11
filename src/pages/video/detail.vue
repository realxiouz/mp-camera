<template>
  <div>
    <live-player
      style="height:420rpx;width:100%;display:block;"
      id="previewPlayer"
      @statechange="statechange"
      mode="RTC"
      :src="videoSrc"
      autoplay="true"
    >
      <cover-view class="video-loading-container" v-if="videoLoadingStatus !== 100">
        <cover-image class="video-loading-bg" src="/static/img/images/live/live_loading_bg.png"></cover-image>
        <cover-view class="video-loaing video-ready" v-if="videoLoadingStatus == 0">
          <cover-image class="loading-gif" src="/static/img/images/live/landscape_play.png" @click.stop="handlePlay"></cover-image>
        </cover-view>
      </cover-view>
    </live-player>
    <div class="padding-xs">
      <div class="bg-green flex align-center radius padding-xs" >
        <div class="text-sm margin-left-xs">摄像头加载:{{videoLoadingStatus}}%</div>
      </div>
    </div>
  </div>
</template>

<script>
let livePlayerContext = null

export default {
  onLoad(opt) {
    livePlayerContext = wx.createLivePlayerContext('previewPlayer', this)
    this.opt = opt
    this.getPlayUrl()
  },
  data() {
    return {
      videoSrc: '',
      videoLoadingStatus: 0,
    }
  },
  methods: {
    getPlayUrl() {
      let data = {
        'accessToken': this.$getStorage('ysToken'),
        'channelNo': 1,
        'deviceSerial': 'F72584666',
        'protocol': 3, // 流播放协议，1-ezopen、2-hls、3-rtmp
        'startTime': this.opt.s,
        'stopTime': this.opt.e,
        'type': 2, // 由页面按钮传入值
        'expireTime': 86400
      }
      wx.request({
        url: 'https://open.ys7.com/api/lapp/v2/live/address/get', 
        method: 'POST',
        data,
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: (res) => {
          console.log('获取到的播放地址：',res.data);
          if(res.data.code == "200" && res.data.data && res.data.data.url){
            const playUrl = res.data.data.url;        
            this.videoSrc =  playUrl  
            // livePlayerContext.play({
            //     success: _ => {},
            //     fail: e => {
            //       console.log(e)
            //       this.$toast('播放失败')
            //     }
            //   })     
            console.log('当前播放地址：', this.videoSrc);
          } else {
            if (res.data.msg) {
              this.$showModal({
                content: res.data.msg
              })
            }
          }
        }
      })
    },
    statechange(e) {
      console.log('live-player code:', e.detail.code,e.detail);
      const { code } = e.detail;
      let videoLoadingStatus = this.videoLoadingStatus;
      switch (code){
        case 2007: //启动loading
          videoLoadingStatus = 0;
          break;
        case 2001: //连接服务器
          videoLoadingStatus = 20;
          break;
        case 2002: //已经连接 RTMP 服务器,开始拉流
          videoLoadingStatus = 40;
          break;
        case 2008: // 解码器启动
          break;
        case 2009: //视频分辨率改动
          break;
        case 2004: // 视频播放开始
          videoLoadingStatus = 80;
          console.log("case 2004: // 视频播放开始");
          break;
        case 2003: //网络接收到首个视频数据包(IDR)
          console.log("case 2003: //网络接收到首个视频数据包(IDR)");
          videoLoadingStatus = 100;
        break;
        case 2103: //网络断连, 已启动自动重连（本小程序不自动重连）
        break;
        case 3001:
        case 3002:
        case 3003:
        case 3005: // 播放失败
        console.log("case 3005: // 播放失败");
        videoLoadingStatus = 100;
        wx.showToast({
          title: '当前网络异常',
          icon: 'none'
        })
        break;
        case 2105:
          break;
        case -2301: // 经多次重连抢救无效，更多重试请自行重启播放
          videoLoadingStatus = 100;
          break;
      }
      this.videoLoadingStatus = videoLoadingStatus
    },
    error() {

    },
    handlePlay() {
      livePlayerContext.play({
        success: _ => {
          console.log('播放中...')
        },
        fail: e => {
          console.log(e)
          this.$toast('播放失败')
        }
      })
    },
  }
}
</script>

<style>
.video-loading-container{
  position: relative;
  height: 100%;
  width: 100%;
  text-align: center;
  display: flex;
  justify-content:center;
  align-items: center;
}
.video-loading-bg{
  position: absolute;
  top:0;
  left: 0;
  width: 100%;
}

.video-loaing .loading-gif {
  display: inline-block;
  width: 80rpx;
  height: 80rpx;
}
</style>