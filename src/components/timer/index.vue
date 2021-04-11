<template>
  <div>
    <div class="text-gray text-sm" v-if="isEnd">报名已结束</div>
    <template v-else>
      <div class="flex">
        <div class="text-gray text-sm margin-right-sm">倒计时:</div>
        <div class="cu-tag sm radius bg-green">{{d}}天</div>
        <div class="cu-tag sm radius bg-green">{{h}}</div>
        <div class="cu-tag sm radius bg-green">{{m}}</div>
        <div class="cu-tag sm radius bg-green">{{s}}</div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  created() {
    this.startTimer()
  },
  beforeDestroy() {
    this.stopTimer()
  },
  data() {
    return {
      isEnd: false,
      t: null,
      h: '00',
      m: '00',
      s: '00',
      d: '00'
    }
  },
  props: {
    end: {
      type: Number
    }
  },
  methods: {
    startTimer() {
      let delta = this.end - new Date().valueOf()/1000
      if (delta <= 0) {
        this.isEnd = true
        this.$emit('done')
        return
      }
      this.t = setInterval(_ => {
        delta--
        if (delta<=0) {
          this.stopTimer()
          this.h = '00'
          this.m = '00'
          this.s = '00'
          this.isEnd = true
          this.$emit('done')
        } else {
          let d = Math.floor((delta / 60 / 60 / 24 ))
          let h = Math.floor((delta / 60 / 60) % 24)
          let m = Math.floor((delta / 60) % 60)
          let s = Math.floor(delta % 60)
          this.d = d
          this.h = h < 10 ? `0${h}` : h
          this.m = m < 10 ? `0${m}` : m
          this.s = s < 10 ? `0${s}` : s
        }
      }, 1000)
    },
    stopTimer() {
      this.t && clearInterval(this.t)
    }
  }
}
</script>