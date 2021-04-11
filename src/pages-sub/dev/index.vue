<template>
  <div>
    <div class="cu-list grid col-3">
      <div class="cu-item" @click="$go(`/pages-sub/dev/auth`)">
        auth
      </div>
      <div class="cu-item" @click="onStore">vuex</div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    onStore() {
      console.log(this.$store.state)
    }
  }
}
</script>

<style>

</style>