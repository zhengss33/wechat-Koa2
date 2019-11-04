<template>
  <transition name="swing">
    <div class="snackbar" v-if="open">
      <div class="snackbar-content">
        <slot name="body"></slot>
        <slot name="action" @click="$emit('update:open', false)"></slot>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    open: {
      default: false
    }
  },
  watch: {
    'open': function (newVal, oldVal) {
      if (newVal) {
        var timer = setTimeout(() => {
          this.$emit('update:open', false)
          clearTimeout(timer)
        }, 3 * 1000)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~static/scss/colors.scss';
$snackbar-padding: 24px;

.snackbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
  display: flex;
  justify-content: center;
  .snackbar-content {
    flex-grow: 0;
    min-height: 48px;
    min-width: calc(320px - #{$snackbar-padding});
    padding: 0 $snackbar-padding;
    display: flex;
    align-items: center;
    justify-content: space-between;
    line-height: 24px;
    font-size: 16px;
    background-color: $grey-900;
    color: #fff;
    .action {
      margin-left: 24px;
      color: $amber;
    }
  }
}

.swing-enter-active, .swing-leave-active {
  transition: all 200ms;
}

.swing-enter, .swing-leave-active {
  opacity: .3;
  transform: translateY(100%);
}
</style>
