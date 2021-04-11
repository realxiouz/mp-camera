<template>
  <div class="cu-modal" :class="{show: show, 'bottom-modal': isBottom}" @click.stop="close" catchtouchmove>
    <div class="cu-dialog" @click.stop>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean
    },
    isBottom: {
      type: Boolean,
      default: true
    },
    clickOut: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    close() {
      if (this.clickOut) {
        this.$emit('update:show', false)
      }
      
    }
  }
}
</script>
