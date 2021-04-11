<template>
  <div>
    <swiper style="height:400rpx;" circular autoplay indicator-dots>
      <swiper-item v-for="(i, inx) in banner" :key="inx">
        <img style="width:100%;height:100%;" :src="i.image" alt="">
      </swiper-item>
    </swiper>
    <div class="cu-list grid col-4 margin-top-sm">
      <div class="cu-item" v-for="(i, inx) in icons" :key="inx" @click="onPath(i)">
        <div :class="[`cuIcon-${i.cuIcon}`, `text-${i.color}`]"></div>
        <span class="text-sm">{{i.name}}</span>
      </div>
    </div>
    <div class="flex flex-wrap">
      <div class="item bg-white" v-for="(i, inx) in list" :key="inx" style="margin: 10rpx 0 0 10rpx;width: 360rpx;">
        <div style="height:480rpx">
          <img :src="i.image" style="width:100%;height:100%" class="radius" mode="aspectFill"/>
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
import { mapState } from 'vuex'

export default {
  created() {
    this.getData()
  },
  onShow() {
    const page = this.$mp.page
    if (typeof page.getTabBar === 'function' &&  page.getTabBar()) {  
      page.getTabBar().setData({  
          selInx: 0  
      })  
    }
  },
  data() {
    return {
      list: [],
      banner: [],

      page: 1,
      isLoading: false,
      isEnd: false,

      icons: [
        // {
				// 	cuIcon: 'homefill',
				// 	color: 'orange',
				// 	badge: 1,
				// 	name: '首页'
				// },
        {
					cuIcon: 'recordfill',
					color: 'yellow',
					badge: 0,
					name: '视频录制',
          path: `/pages/video/list`
				},
        {
					cuIcon: 'picfill',
					color: 'olive',
					badge: 22,
					name: '照片拍摄',
          path: `/pages/photo/list`
				},
        {
					cuIcon: 'cameraaddfill',
					color: 'cyan',
					badge: 0,
					name: '管理中心',
          path: `/pages/live/live`
				},
        {
					cuIcon: 'favorfill',
					color: 'blue',
					badge: 0,
					name: '我的收藏',
          // path: `/pages/camera/index`
				}
      ],
    }
  },
  methods: {
    getData() {
      this.$showLoading()
      this.isLoading = true
      let d = {
        page: this.page
      }
      this.$get(`/api/v1/index`, d)
        .then(r => {
          this.banner = r.data.bannerList
          this.list.push(...r.data.list.data)
          if (this.page >= r.data.list.last_page) {
            this.isEnd = true
          }
        })
        .finally(_ => {
          this.$hideLoading()
          this.isLoading = false
        })
    },
    onPath(i) {
      if (!this.token) {
        this.$showModal({
          content: '您还未登录,无法使用该功能,点击确定去登录~~~',
          successCb: _ => {
            this.$go(`/pages/auth/login`)
          }
        })
        return
      }
      if (i.path) {
        this.$go(i.path)
      } else {
        this.$toast('接口...')
      }
    }
  },
  computed: {
    ...mapState('user', ['token'])
  },
  onReachBottom() {
    if (!this.isLoading && !this.isEnd) {
      this.page++
      this.getData()
    }
  }
}
</script>