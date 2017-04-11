<template>
  <tfoot>
  <tr>
    <td :colspan="colspan">共{{totalCount}}条数据，共{{totalPage}}页，当前第{{currentPage}}页</td>
  </tr>
  </tfoot>
</template>
<script>
  export default {
    name: 'v-table-footer',
    props: ['feature', 'pager', 'totalCount', 'actionUrls', 'colspan', 'totalPage', 'currentPage'],
    methods: {}
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  @import "../../scss/import.scss";

  tfoot {
    tr {
      td {
        border-bottom: 1px solid #ccc;
        padding: 2px;
        text-align: right;
        padding-right: 8px;
        line-height: 2;
      }
    }
  }
</style>
