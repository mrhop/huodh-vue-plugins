<template>
  <div :class="['panel-total col',panelWrapperClass]">
    <div class="panel-wrapper">
      <header>
        <slot name="header"></slot>
      </header>
      <main>
        <slot></slot>
      </main>
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
        panelWrapperClass: 'col-sm-' + (this.col ? this.col : 12)
      }
    },
    props: ['col'],
    methods: {}
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
  }
</style>
