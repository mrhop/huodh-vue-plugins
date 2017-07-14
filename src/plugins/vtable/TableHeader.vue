<template>
  <thead class="table-header" v-if="header">
  <tr>
    <th v-for="(item, key) in header" :key="key">
      <a><span>{{item.title}}</span></a>
    </th>
    <th class="theader-actions">操作</th>
  </tr>
  <tr v-if="feature&&feature.filter" class="form-group">
    <th v-for="(item, key) in header" :key="key">
      <formElement v-if="item.filter" :dataFromParent="filters" :options="item"
                   :callback="filtersChange.bind(this)"
                   :key="key"/>
    </th>
    <th></th>
  </tr>
  </thead>
</template>
<script>
  import lodash from 'lodash'
  import {mapActions} from 'vuex'
  import formElement from '../formElement/FormElement.vue'
  export default {
    name: 'v-table-header',
    data () {
      return {
        pageSize: this.pager ? this.pager.pageSize : 15
      }
    },
    props: ['header', 'action', 'feature', 'pager', 'filters', 'actionUrls', 'tableId'],
    methods: lodash.assignIn({
      filtersChange (target) {
        lodash.debounce(function () {
          let pager = this.pager
          let filters = this.filters
          this.tableGetList({id: this.tableId, listUrl: this.actionUrls.listUrl, pager, filters})
        }.bind(this), 500)()
      }
    }, mapActions([
      'tableGetList'
    ])),
    components: {formElement}
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  @import "../../scss/import.scss";

  thead.table-header {
    tr {
      th {
        position: relative;
        border-bottom: 1px solid #ccc;
        padding: 2px;
        &.theader-actions {
          text-align: right;
          padding-right: 8px;
        }
      }
    }
  }
</style>
