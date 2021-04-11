<template>
  <div>
    <div style="position: relative;">
      <live-player
        style="height:420rpx;width:100%;display:block;"
        id="liveVideo"
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
        <div class="text-sm margin-left-xs" v-if="isVideoing">视频时长: {{videoTime}}s</div>
        <div class="flex-sub"></div>
        <div class="cu-tag radius" :class="isVideoing?'bg-red':'bg-green'" @click="onVideo">{{isVideoing?'停止录制':'开始录制'}}</div>
      </div>
    </div>
    <div class="flex flex-wrap">
      <div class="item bg-white" v-for="(i, inx) in list" :key="inx" style="margin: 10rpx 0 0 10rpx;width: 360rpx;" @click="onDetail(i)">
        <div style="height:480rpx">
          <img :src="i.image" style="width:100%;height:100%" class="radius" />
        </div>
        <div class="padding-xs">
          <div class="margin-bottom-sm">{{i.create_time_text}}</div>
          <div class="flex align-center">
            <div class="cu-avatar round margin-right-sm" :style="{backgroundImage:`url(${i.user.avatar})`}"></div>
            <div class="flex-sub text-cut">{{i.user.username}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { DateFormat } from '@/common/utils'
export default {
  onLoad(opt) {
    this.getData()

    this.livePlayerContext = wx.createLivePlayerContext('liveVideo', this)
    this.getPlayUrl()
  },
  onUnload() {
    this.livePlayerContext.stop()
    this.livePlayerContext = null
    this.t && clearInterval(this.t)
    console.log('2')
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
      this.$get(`/api/v1/video/list`, d)
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
          accessToken: 'at.636lcmeydffjpzpp4l18tmzo3dohd1r1-1vx85nijgr-0t0617d-mdxli89ci',
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
              // this.$nextTick(_ => {
              //   this.livePlayerContext.play({
              //     success: _ => {},
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
      if (this.isVideoing) {
        this.end_time = DateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
        this.$post(`/api/v1/video/add`, {
          start_time: this.start_time,
          end_time: this.end_time
        }).then(r => {
            this.isVideoing = false
            this.start_time = ''
            this.end_time = ''
            this.t && clearInterval(this.t)
            this.getData(true)
          })
      } else {
        if (this.videoLoadingStatus != 100) {
          this.$toast('摄像头加载中,请稍后')
          return
        }
        this.isVideoing = true
        this.start_time = DateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
        this.end_time = ''
        this.videoTime = 0
        this.t = setInterval(_ => {
          this.videoTime++
        }, 1000)
      }
    },
    onDetail(i) {
      this.$go(`/pages/video/detail?s=${i.start_time}&e=${i.end_time}`)
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
    }
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