<template>
  <div>
    <div style="position: relative;">
      <live-player
        style="height:420rpx;width:100%;display:block;"
        id="livePhoto"
        binderror="error"
        @statechange="statechange"
        mode="RTC"
        :src="videoSrc"
      >
        <cover-view class="video-loading-container" v-if="videoLoadingStatus !== 100">
          <cover-image class="video-loading-bg" src="/static/img/images/live/live_loading_bg.png"></cover-image>
          <cover-view class="video-loaing video-ready" v-if="videoLoadingStatus == 0">
            <cover-image class="loading-gif" src="/static/img/images/live/landscape_play.png" @click.stop="handlePlay"></cover-image>
          </cover-view>
        </cover-view>
      </live-player>
    </div>
    <div class="padding-xs">
      <div class="bg-white flex align-center radius padding-xs" >
        <button class="cu-btn cuIcon " :class="videoLoadingStatus==100?'bg-blue':'bg-red'">
          <text class="cuIcon-file"></text>
        </button>
        <div class="text-sm margin-left-xs" v-if="videoLoadingStatus!=100">摄像头加载:{{videoLoadingStatus}}%</div>
        <div class="flex-sub"></div>
        <div class="cu-tag radius bg-green" @click="onVideo">照片拍摄</div>
      </div>
    </div>
    <div class="padding-xs">
      <div class="radius bg-green padding-xs text-xs">
        <span class="cuIcon-messagefill margin-right-xs"></span>点击图片可以预览,预览页面长按可以保存图片!
      </div>
    </div>
    <div class="flex flex-wrap">
      <div class="item bg-white" v-for="(i, inx) in list" :key="inx" style="margin: 10rpx 0 0 10rpx;width: 360rpx;">
        <div style="height:360rpx;">
          <img :src="i.image" style="width:100%;height:100%" class="radius" mode="aspectFill" @click="onPreview(i.image)"/>
        </div>
        
        <!-- <div class="padding-xs">
          <div class="margin-bottom-sm">{{i.create_time_text}}</div>
          <div class="flex align-center">
            <div class="cu-avatar round margin-right-sm" :style="{backgroundImage:`url(${i.user.avatar})`}"></div>
            <div class="flex-sub text-cut">{{i.user.username}}</div>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import { DateFormat } from '@/common/utils'
export default {
  onLoad(opt) {
    this.getData()

    this.livePlayerContext = wx.createLivePlayerContext('livePhoto', this)
    this.getPlayUrl()
  },
  onUnload() {
    this.livePlayerContext.stop()
    this.livePlayerContext = null
    console.log('1')
  },
  data() {
    return {
      list: [],
      page: 1,
      isLoading: false,
      isEnd: false,

      videoSrc: '',
      isVideoing: false,
      videoLoadingStatus: 0,
      videoTime: 0,
      livePlayerContext: null,
    }
  },
  methods: {
    getData(reset=false) {
      if (reset) {
        this.page = 1
        this.list = []
        this.isEnd = false
      }
      let d = {
        page: this.page
      }
      this.isLoading = true
      this.$showLoading()
      this.$get(`/api/v1/photo/list`, d)
        .then(r => {
          this.list.push(...r.data.data)
          if (this.page >= r.data.last_page) {
            this.isEnd = true
          }
        })
        .finally(_ => {
          this.isLoading = false
          this.$hideLoading()
        })
    },

    getPlayUrl() {
      wx.request({
        url: 'https://open.ys7.com/api/lapp/v2/live/address/get',
        method: 'POST',
        data: {
          accessToken: this.$getStorage('ysToken'),
          deviceSerial: 'F72584666',
          channelNo: 1,
          expireTime: 86400,
          quality: 2,
          protocol: 3,
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: res => {
          if(res.data.code ==200 && res.data.data && res.data.data.url){
            var result = res.data;
            if(result.code == 200){
              this.videoSrc = result.data.url
              console.log(this.videoSrc)
              // this.$nextTick(_ => {
              //   this.livePlayerContext.play({
              //     success: _ => {
              //       console.log('播放中...')
              //     },
              //     fail: e => {
              //       console.log(e)
              //       this.$toast('播放失败')
              //     }
              //   })
              // })
            }
          }
        },
      })
    },
    statechange(e) {
      console.log('live-player code:', e.detail.code,e.detail);
      const { code } = e.detail;
      let videoLoadingStatus = this.videoLoadingStatus
      switch (code){
        case 2007: //启动loading
          videoLoadingStatus = 0;
          break;
        case 2001: //连接服务器
          videoLoadingStatus = 20 + Math.floor(Math.random()*10+1);
          break;
        case 2002: //已经连接 RTMP 服务器,开始拉流
          videoLoadingStatus = 40 + Math.floor(Math.random()*10+1);
          break;
        case 2008: // 解码器启动
          break;
        // case 2009: //视频分辨率改动
        //   break;
        case 2004: // 视频播放开始
          videoLoadingStatus = 80 + Math.floor(Math.random()*10+1);
          break;
        case 2003: //网络接收到首个视频数据包(IDR)
          videoLoadingStatus = 100;
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
          break;
        case -2301: // 经多次重连抢救无效，更多重试请自行重启播放
          videoLoadingStatus = 100;
          break;
      }
      this.videoLoadingStatus = videoLoadingStatus
      console.log(this.videoLoadingStatus)
    },
    onVideo() {
      if (this.videoLoadingStatus != 100) {
        this.$toast('摄像头加载中,请稍后')
        return
      }
      this.livePlayerContext.snapshot('raw')
        .then(data =>{
          if (data) {
            wx.uploadFile({
              url: `https://oath.softtiny.com/api/v1/common/upload`,
              filePath: data.tempImagePath,
              name: 'file',
              header: {
                token: wx.getStorageSync('token')
              },
              success: r => {
                console.log(r)
                if (r.statusCode == 200 && r.errMsg == 'uploadFile:ok') {
                  let d = JSON.parse(r.data)
                  console.log(d.data.url)

                  wx.request({
                    url: 'https://oath.softtiny.com/api/v1/photo/add',
                    method: 'POST',
                    data: {
                      image: d.data.url
                    },
                    header: {
                      token: wx.getStorageSync('token'),
                      'content-type': 'application/x-www-form-urlencoded'
                    },
                    success: r => {
                      wx.showToast({
                        title: `照片已拍摄`
                      })
                      this.getData(true)
                    }
                  })
                }
              },
              fail: e => {
                console.log(e)
              }
            })
          }
        })
        .catch(err => {
          console.log("err",err);
        })
    },
    onPreview(url) {
      wx.previewImage({
        current: 0,
        urls: [url]
      })
    },
    error(e) {
      console.log(e)
    },
    handlePlay() {
      this.livePlayerContext.play({
        success: _ => {
          console.log('播放中...')
        },
        fail: e => {
          console.log(e)
          this.$toast('播放失败')
        }
      })
    },
    
  },
  onReachBottom() {
    if (!this.isLoading && !this.isEnd) {
      this.page++
      this.getData()
    }
  }
}
</script>

<style scoped>
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