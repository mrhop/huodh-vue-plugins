<template>
  <div class="tab-wrapper" ref="tabWrapper">
    <header class="tab-header">
      <slot name="header"></slot>
    </header>
    <main class="tab-body">
      <slot></slot>
    </main>
  </div>
</template>
<script>
  export default {
    name: 'v-tab',
    methods: {
      headerClick (i, event) {
        let headerItems = this.$refs.tabWrapper.querySelectorAll('.tab-header > ul >li')
        for (let j in headerItems) {
          if (j < headerItems.length) {
            if (j !== i) {
              headerItems[j].removeAttribute('class')
            } else {
              headerItems[j].setAttribute('class', 'active')
            }
          }
        }
        let bodyItems = this.$refs.tabWrapper.querySelectorAll('.tab-body > ul > li')
        for (let k in bodyItems) {
          if (k < bodyItems.length) {
            if (k !== i) {
              bodyItems[k].removeAttribute('class')
            } else {
              bodyItems[k].setAttribute('class', 'active')
            }
          }
        }
        this.$emit('headerClick', i, event)
      }
    },
    mounted () {
      let headerItems = this.$refs.tabWrapper.querySelectorAll('.tab-header > ul >li')
      for (let i in headerItems) {
        if (i < headerItems.length) {
          headerItems[i].addEventListener('click', this.headerClick.bind(this, i))
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  @import "../../scss/import.scss";

  .tab-wrapper {
    .tab-header {
      > ul, > .ul {
        list-style: none;
        padding-left: 0;
        background: $base-background;
        text-transform: capitalize;
        margin-bottom: 0;
        > li, > .li {
          display: inline-block;
          padding: 5px 5px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          &.active {
            background: darken($base-background, 30%);
          }
        }
      }
    }
    .tab-body {
      > ul, > .ul {
        padding: 15px;
        > li, > .li {
          display: none;
          &.active {
            display: block;
          }
        }
      }
    }
  }
</style>
