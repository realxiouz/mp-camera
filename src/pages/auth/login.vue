<template>
  <div style="height:100vh;" class="bg-white flex flex-direction column align-center">
    <div style="padding-top:180rpx;margin-bottom:20rpx;">
      <div style="width:200rpx;height:200rpx;"></div>
      <!-- <img src="http://static.81hbz.com/static/img/login.png" style="width:200rpx;height:200rpx;" /> -->
    </div>
    <!-- <div class="font16" style="color:#B41018;;margin-bottom:130rpx">您的生活补给站</div> -->
    
    <button open-type="getUserInfo" class="reset"
      @getuserinfo="onUserInfo"><div class="btn">微信一键登录</div></button>
    <div class="font12" style="color:#929292;">登录／注册即视为您同意<span style="color:#049CE3;" @click.stop="">《服务条款》</span></div>

  </div>
</template>

<script>
import { mapState, mapActions} from 'vuex'

export default {
  onLoad(opt) {
    this.getSessionKey()
      .then(r => {
        console.log('获取session_key success...')
      })
  },
  data() {
    return {
      iv: '',
      token: '',
      citycode: '',
    }
  },
  methods: {
		...mapActions('user', ['getSessionKey']),
    async onUserInfo(e) {
      console.log(e.detail)
      let {errMsg, iv, encryptedData, signature} = e.detail
      if (iv && encryptedData) {
        let d = {
          encryptedData,
          iv,
          signature,
          session_key: this.session_key
        }
        this.$post('api/v1/user/wxMiniProgramLogin', d)
          .then(r => {
            let { token, } = r.data
            this.$setStorage('token', token)
            this.$store.commit('user/setToken', token)
            this.$go(1, 'back')
          })
      } else {
        if (errMsg=='getUserInfo:fail auth deny') {
          this.$toast('为了正常使用小程序,请授权')
          return
        }
        this.$toast(errMsg || 'wx.getUserInfo->fail')
      }
    },
  },
  computed: {
    ...mapState('user', ['session_key'])
  }
}
</script>

<style>
.btn{
  width: 650rpx;
  height: 80rpx;
  line-height: 80rpx;
  border-radius: 40rpx;
  border: 1rpx solid #24DB5A;
  color: #24DB5A;
  margin-bottom: 40rpx;
}

.bind-wrap{
  width: 600rpx;
  background: #fff;
  border-radius: 16rpx;
}
button::after{
      border: none;
    }
button {
  padding: 0 ;
    font-size: inherit;
    line-height: inherit;
    background-color: transparent;
    color: inherit;
     margin: 0 ;
}
/* // button{
//   &.reset{
//     padding: 0 ;
//     font-size: inherit;
//     line-height: inherit;
//     background-color: transparent;
//     color: inherit;
//     margin: 0 ;
//     &::after{
//       border: none;
//     }
//   }
// } */
</style>