<template>
  <div class="tab-wrapper">
    <TabHeader :items="data"></TabHeader>
    <TabBody :items="data"></TabBody>
  </div>
</template>
<script>
  import TabHeader from './TabHeader.vue'
  import TabBody from './TabBody.vue'
  export default {
    name: 'v-tab',
    props: ['data'],
    components: {TabHeader, TabBody}
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  @import "../../scss/import.scss";
</style>
