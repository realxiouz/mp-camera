<template>
  <div>
    <live-player
      style="height:420rpx;width:100%;"
      id="livePlayer"
      binderror="error"
      @statechange="statechange"
      mode="RTC"
      :src="videoSrc"
      @click.stop="onVideoTap"
      :muted="!openSound"
      @fullscreenchange="fullscreenChange"
      :object-fit="objectFit"
      :autoplay="true"
    ></live-player>
    <div class="padding-xs">
      <div class="bg-white flex align-center radius padding-xs" >
        <button class="cu-btn cuIcon">
          <text class="cuIcon-emojifill"></text>
        </button>
        <div class="text-sm margin-left-xs" v-if="isVideoing">{{videoTime}}s</div>
        <div class="flex-sub"></div>
        <div class="cu-tag radius" :class="isVideoing?'bg-red':'bg-green'" @click="onVideo">{{isVideoing?'停止录制':'开始录制'}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { DateFormat } from '@/common/utils'
let livePlayerContext = null
export default {
  onLoad() {
    livePlayerContext = wx.createLivePlayerContext('livePlayer')
    this.getPlayUrl()
    // this.getDeviceCoverInfo()
    // this.getDeviceInfo()
  },
  onUnload() {
    this.t && clearInterval(this.t)
  },
  data() {
    return {
      videoSrc: '',
      isVideoing: false,
      videoLoadingStatus: 0,
      videoTime: 0,
    }
  },
  methods: {
    getPlayUrl() {
      wx.request({
        url: 'https://open.ys7.com/api/lapp/v2/live/address/get',
        method: 'POST',
        data: {
          accessToken: 'at.59l4nssa0rnepbf1d4u2e750e0gh7oyl-9rhzd1qlv6-1s0hzdd-ehw1v9vcd',
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
              livePlayerContext.play({
                success: _ => {},
                fail: e => {
                  console.log(e)
                  this.$toast('播放失败')
                }
              })
            }
          }
        },
      })
    },
    statechange(e) {
      console.log('live-player code:', e.detail.code,e.detail);
      const { code } = e.detail;
      let videoLoadingStatus = 0
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
        case 2009: //视频分辨率改动
          break;
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
    // getDeviceCoverInfo() {
    //   wx.request({
    //     url: 'https://open.ys7.com/api/lapp/device/scene/switch/status',
    //     method: 'POST',
    //     data: {
    //       accessToken: 'at.59l4nssa0rnepbf1d4u2e750e0gh7oyl-9rhzd1qlv6-1s0hzdd-ehw1v9vcd',
    //       deviceSerial: 'F72584666',
    //       channelNo: 1,
    //     },
    //     header: {
    //       'content-type': 'application/x-www-form-urlencoded' // 默认值
    //     },
    //     success:(res) =>{
    //       console.log(res.data);
    //       if(res.data.code ==200 && res.data.data){
    //         const result = res.data.data;
    //         let list = this.list;
    //         if(result.enable == 1){ // 当前镜头遮蔽中
    //           list[0].status = -1;
    //           list[1].status = -1;
    //           list[2].status = -1;
    //           list[3].status = 1;
    //           this.videoLoadingStatus = 100
    //           console.log("panelStatus",this.panelStatus)
    //         }
    //       }
    //     },
    //     error:(err)=>{
    //       console.log(err);
    //     },
    //   })
    // },
    // getDeviceInfo() {
    //   wx.request({
    //     url: 'https://open.ys7.com/api/lapp/device/info',
    //     method: 'POST',
    //     data: {
    //       accessToken: 'at.59l4nssa0rnepbf1d4u2e750e0gh7oyl-9rhzd1qlv6-1s0hzdd-ehw1v9vcd',
    //       deviceSerial: 'F72584666',
    //       channelNo: 1,
    //     },
    //     header: {
    //       'content-type': 'application/x-www-form-urlencoded'
    //     },
    //     success:(res) =>{
    //       console.log(res.data);
    //       if(res.data.code ==200 && res.data.data){
    //         let list = this.list;
    //         var result = res.data.data;
    //         this.deviceName = result.deviceName
    //         this.deviceOffline = result.status !== 1
    //         this.videoNetWorkError = result.status !==1 ? false : videoNetWorkError
    //         this.showVideoControls = result.status !==1 ? false : showVideoControls
    //         this.deviceOfflineTime = DateFormat(new Date(result.updateTime),'yyyy-MM-dd hh:mm:ss')
    //         this.deviceIsEncrypt = result.isEncrypt
    //         this.videoLoadingStatus = (result.isEncrypt === 1 || result.status !== 1) ? 100 : videoLoadingStatus
    //         // 配置标题
    //         if(result.deviceName){
    //           wx.setNavigationBarTitle({
    //             title: result.deviceName,
    //           }) 
    //         }
    //         if(result.status != 1 ){ // 设备不在线
    //           list[0].status = -1;
    //           list[1].status = -1;
    //           list[2].status = -1;
    //           list[3].status = -1;
    //           this.list = list
    //           this.showVideoControls = false
    //         }else if(result.isEncrypt == 1 ){ // 设备被加密
    //           list[0].status = -1;
    //           list[1].status = -1;
    //           list[2].status = -1;
    //           list[3].status = -1;
    //           this.list = list
    //           this.dialogTitle = '设备被加密'
    //           this.dialogContent = '设备已被加密，无法继续查看，请前往萤石云app解密。'
    //           this.dialogShow = true
    //           this.showVideoControls = false
    //         } else {
    //           // 获取设备能力
    //           // this.getDeviceCapacity();
    //           this.getDeviceCoverInfo();
    //         }
    //       } else if (res.data.code == "20001" ||res.data.code == "20002" || res.data.code == '20018'){ // 设备不存在 / 不属于用户
    //         this.dialogTitle = '获取播放地址失败'
    //         this.dialogContent ='该用户不拥有该设备',
    //         this.dialogShow = true
    //       }else if(res.data.code == 10029){
    //         wx.showToast({
    //           title: '个人版接口调用超限，请升级企业版',
    //           icon: 'none',
    //         })
    //       }else if(res.data.code == 10002){
    //         wx.showToast({
    //           title: res.data.msg,
    //           icon: 'none',
    //         })
    //         setTimeout(()=>{
    //           this.pageBack();
    //         },2000)
    //       }else {
    //         wx.showToast({
    //           title: res.data.msg,
    //           icon: 'none'
    //         })
    //       }
    //     }
    //   })
    // },
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
    }
  }
}
</script>

<style>

</style>