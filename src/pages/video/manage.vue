<template>
  <div class="flex flex-wrap">
    <div class="bg-white" v-for="(i,inx) in list" :key="inx" style="margin: 10rpx 0 0 10rpx;width: 360rpx;">
      <div style="height:480rpx">
          <img :src="i.image" style="width:100%;height:100%" class="radius" mode="aspectFill"/>
        </div>
        <div class="padding-xs">
          <div class="margin-bottom-sm">{{i.create_time_text}}</div>
          <div class="flex align-center" @click="onDel(i, inx)">
            <div class="cu-avatar round margin-right-sm" :style="{backgroundImage:`url(${i.user.avatar})`}"></div>
            <div class="flex-sub text-cut">{{i.user.username}}</div>
            <div class="cuIcon-delete margin-left-xs text-red"></div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  onLoad() {
    this.getData()
  },
  data() {
    return {
      page: 1,
      list: [],
      isLoading: false,
      isEnd: false
    }
  },
  methods: {
    getData() {
      let d = {
        page: this.page
      }
      this.isLoading = true
      this.$showLoading()
      this.$get(`/api/v1/video/manage`, d)
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
    onDel(i, inx) {
      this.$showModal({
        content: `您确定要删除这条记录么?`,
        successCb: _ => {
          this.$del(`/api/v1/video/delete`, {
            id: i.id
          })
            .then(r => {
              this.list.splice(inx, 1)
              this.$toast('数据删除成功')
            })
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