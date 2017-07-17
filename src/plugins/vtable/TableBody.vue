<template>
  <tbody class="table-body">
  <tableRow v-for="(row,key) in rows" :row="row" :index="key" :action="action" :hasSn="hasSn"
            :key="key" :header="header" :actions="actions" :editable="editable"
            :actionUrls="actionUrls" :tableId="tableId"/>
  </tbody>
</template>
<script>
  import tableRow from './TableRow.vue'

  export default {
    name: 'v-table-body',
    props: ['rows', 'action', 'header', 'actionUrls', 'actions', 'hasSn', 'editable', 'tableId'],
    components: {
      tableRow
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  @import "../../scss/import.scss";
</style>
