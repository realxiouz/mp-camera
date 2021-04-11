<template>
  <div>
    <div class="flex align-center" style="height:300rpx;padding: 0 30rpx;position:relative;">
      <img style="position:absolute;width:100%;height:100%;left:0;top:0;z-index:-5;" src="/static/img/bg.jpeg" alt="">
      <div style="width:120rpx;height:120rpx;border-radius:80rpx;overflow:hidden;"> 
        <open-data type="userAvatarUrl"></open-data>
      </div>
      <div class="text-xl margin-left" style="color:#fff;">
        <open-data type="userNickName"></open-data>
      </div>
      <div></div>
    </div>

    <div class="order-wrap">
      <div class="flex order-title align-center" @click="$go('/pages/order/list')">
        <div class="text-bold">我的订单</div>
        <div class="flex-sub"></div>
        <div class="text-sm text-gray">查看订单</div>
        <div class="cuIcon-right text-gray margin-left-xm"></div>
      </div>
      <div class="flex">
        <div class="flex-sub flex flex-direction align-center justify-center" style="height:160rpx;" @click="$go(`/pages/order/list?status=1`)">
          <div class="cuIcon-pay text-green" style="font-size:36px;"></div>
          <div class="text-gray text-sm margin-top-xm">待支付</div>
        </div>
        <div class="flex-sub flex flex-direction align-center justify-center" style="height:160rpx;" @click="$go(`/pages/order/list?status=2`)">
          <div class="cuIcon-copy text-red" style="font-size:36px;"></div>
          <div class="text-gray text-sm margin-top-xm">已报名</div>
        </div>
        <div class="flex-sub flex flex-direction align-center justify-center" style="height:160rpx;">
          <div class="cuIcon-group text-yellow" style="font-size:36px;"></div>
          <div class="text-gray text-sm margin-top-xm">人员管理</div>
        </div>
      </div>
    </div>
    <view class="cu-list menu" :class="[true?'sm-border':'',true?'card-menu margin-top':'']">
      <view class="cu-item arrow" @click="$toast('3月19日上线...')">
        <view class="content">
          <text class="cuIcon-location text-green"></text>
          <text class="text-grey">我的打卡</text>
        </view>
      </view>
      <view class="cu-item arrow" @click="$go(`/pages/coupon/list`)">
        <view class="content">
          <text class="cuIcon-present text-red"></text>
          <text class="text-grey">我的卡券</text>
        </view>
      </view>
      <view class="cu-item arrow" @click="$toast('3月19日上线...')">
        <view class="content">
          <text class="cuIcon-selection text-yellow"></text>
          <text class="text-grey">打卡积分榜</text>
        </view>
      </view>
    </view>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  onShow() {
    const page = this.$mp.page
    if (typeof page.getTabBar === 'function' &&  page.getTabBar()) {  
      page.getTabBar().setData({  
          selInx: 2
      })  
    }

    if (!this.token) {
      this.$showModal({
        content: '您还未登录,无法使用该功能,点击确定去登录~~~',
        successCb: _ => {
          this.$go(`/pages/auth/login`)
        }
      })
    }
  },

  computed: {
    ...mapState('user', ['token'])
  }
}
</script>

<style>
.order-wrap{
  margin: -80rpx 30rpx 0 30rpx;
  background: #fff;
  border-radius: 20rpx;
  padding: 0 30rpx;
}
.order-title{
  height: 80rpx;
  border-bottom: 1rpx solid #ddd;
}
</style>