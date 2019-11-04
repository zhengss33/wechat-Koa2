<template>
  <div id="app">
    <div id="main">
      <nuxt/>
    </div>
    <nav-bottom/>
  </div>
</template>

<script>
import NavBottom from '../components/NavBottom.vue'

export default {
  components: {
    NavBottom
  }
}
</script>

<style>
</style>
