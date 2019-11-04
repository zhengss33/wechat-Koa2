<template>
  <div class="cell">
    <span class="title">{{title}}</span>
    <span v-if="content">{{content}}</span>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    content: Number
  }
}
</script>

<style lang='scss'>
@import '~static/scss/colors.scss';
@import '~static/scss/mixin.scss';


.cell {
  width: 100%;
  font-size: 0;

  > * {
    vertical-align: middle;
    display: inline-block;
  }

  span {
    width: 50%;
    text-align: left;
    @include font-dpr(15px)
  }

  .material-icon {
    width: 50%;
    text-align: right;
    @include font-dpr(33px);
    color: $grey-800;
  }
}

</style>
