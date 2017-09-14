<template>
  <div :class="['panel-total col',panelWrapperClass]">
    <div class="panel-wrapper">
      <header @click="headerClick">
        <slot name="header"></slot>
      </header>
      <transition name="fade">
        <main v-show="bodyOpened">
          <slot></slot>
        </main>
      </transition>
      <footer>
        <slot name="footer"></slot>
      </footer>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'v-panel',
    data () {
      return {
        panelWrapperClass: 'col-sm-' + (this.col ? this.col : 12),
        bodyOpened: true
      }
    },
    props: ['col', 'canHide'],
    methods: {
      headerClick () {
        if (this.canHide) {
          this.bodyOpened = !this.bodyOpened
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  @import "../../scss/import.scss";

  .panel-total {
    .panel-wrapper {
      border: 2px solid $base-background;
      border-radius: 5px;
      margin: 0 0 20px;
      > header, > footer {
        background: $base-background;
        color: $brand-primary;
        padding: 0 15px;
        > * {
          margin-top: 0;
          margin-bottom: 0;
          line-height: 1.3;
        }
      }
      > header {
        text-transform: capitalize;
      }
      > footer {
        text-align: right;
      }
    }
    .fade-enter-active, .fade-leave-active {
      transition: all .3s;
    }

    .fade-enter-active, .fade-leave {
      opacity: 1;
    }

    .fade-enter, .fade-leave-active {
      opacity: 0;
    }
  }
</style>
