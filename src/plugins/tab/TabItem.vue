<template>
  <div ref="contentWrapEl">
  </div>
</template>
<script>
  import Vue from 'vue'
  export default {
    name: 'v-tab-item',
    data () {
      return {
        localKey: this.key
      }
    },
    props: ['item'],
    mounted () {
      this.appendContent()
    },
    methods: {
      appendContent: function () {
        const _this = this
        let promise
        if (this.item.url) {
          var itemUrl = this.$basePath + this.item.url
          this.item.content = {
            template: '<iframe style="width: 100%" src="' + itemUrl + '"></iframe>'
          }
        }
        if (this.item.content && !this.item.cachedData) {
          if (typeof this.item.content === 'string') {
          } else if (typeof this.item.content === 'function') {
            // do function
            promise = new Promise(this.item.content).then(function (Component) {
              return (_this.item.cachedData = Vue.extend(Component))
            })
          } else {
            promise = Promise.resolve(this.item.content).then(function (Component) {
              return (_this.item.cachedData = Vue.extend(Component))
            })
          }
        } else if (this.item.cachedData) {
          promise = Promise.resolve(this.item.cachedData)
        }
        if (!promise) {
          // string content
          this.$refs.contentWrapEl.innerHTML = this.item.content
        } else {
          promise.then(function (Component) {
            new Component().$mount(_this.$refs.contentWrapEl)
          })
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  @import "../../scss/import.scss";
</style>
