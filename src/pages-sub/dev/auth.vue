<template>
  <div>
    <div style="width:200rpx;height:200rpx;">
      <open-data  type="userAvatarUrl" />
    </div>
    <div class="cu-btn bg-yellow" @click="onCode">getCode</div>
    <button open-type="getUserInfo" class="cu-btn bg-blue" @getuserinfo="onInfo">userInfo</button>
    <button open-type="getPhoneNumber" class="cu-btn bg-red" @getphonenumber="onPhone">phone-number</button>
    <div>
      <div class="cu-btn lg bg-pink" @click="onHttp">http</div>
    </div>

    <div>
      <div class="cu-btn lg bg-pink" @click="onTest">test</div>
    </div>

    <div>
      <div class="cu-btn lg bg-pink" @click="onJwt">jwt</div>
    </div>

    <div>
      <div class="cu-btn lg bg-pink" @click="onUsers">users</div>
    </div>

    <div>
      <div class="cu-btn lg bg-pink" @click="onLogs">log</div>
    </div>


    <div>
      <div class="cu-btn lg bg-pink" @click="onValidateJwt">Validate jwt</div>
    </div>

    <div>
      <div class="cu-btn lg bg-pink" @click="onUserMiddleWare">user middleware</div>
    </div>

      
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  onLoad() {
    // wx.checkSession()
    //   .then(r => {
    //     console.log(r)
    //   })
    //   .catch(e => {
    //     console.log(e)
    //   })
  },
  methods: {
    ...mapActions('user', ['getSessionKey']),
    async onInfo(e) {
      let {errMsg, iv, encryptedData} = e.detail
      console.log(e.detail)
      await this.getSessionKey()
      this.$post('auth/parseUserInfo', { iv, encryptedData })
        .then(r => {

        })
        .catch(e => {

        })
    },
    onPhone(e) {
      console.log(e.detail)
    },
    onCode() {
      // wx.login()
      //   .then(r => {
      //     console.log(r)
      //     // let { code } = r
      //     // this.$get('auth/code', {code})
      //     //   .then(r => {})
      //   })
      //   .catch(e => {
      //     console.log(e)
      //   })
    },
    onHttp() {
      this.$get('http://www.baidu.com')
        .then(r => {
          console.log(r)
        })
        .catch(e => {
          console.log(e)
        })
    },
    onTest() {
      this.$post('test/login', {openid: this.openId, password: '2'})
        .then(r => {})
    },
    onJwt() {
      this.$post('test/jwt')
        .then(r => {})
    },
    onUsers() {
      this.$get('test/users')
        .then(r => {

        })
    },

    onLogs() {
      this.$get('log')
      .then(r => {})
    },

    onValidateJwt() {
      this.$get('test/validateJwt')
        .then(r => {})
    },

    onUserMiddleWare() {
      this.$get('test/userMiddleware')
        .then(r => {})
    }
  },
  computed: {
		...mapState('user', ['openId'])
	},
}
</script>

<style>

</style>