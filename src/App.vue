<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
@import "./assets/scss/base/_base.scss";
@import "./assets/scss/base/_normalize.scss";
@import "./assets/scss/base/_preset.scss";
@import "./assets/scss/_home.scss";
@import "./assets/scss/_group.scss";
</style>
