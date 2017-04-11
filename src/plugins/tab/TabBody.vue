<template>
  <div class="tab-body">
    <div v-for="item in items" v-show="item.show">
      <TabItem :item="item"/>
    </div>
  </div>
</template>
<script>
  import TabItem from './TabItem.vue'
  export default {
    name: 'v-tab-body',
    props: ['items'],
    components: {
      TabItem
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  @import "../../scss/import.scss";
</style>
