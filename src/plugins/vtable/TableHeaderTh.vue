<template>
  <th>
    <a v-if="item.sortable" @click.stop="sortChange"><span>{{item.title}}</span><span
      :class="['sort','glyphicon' ,sortOrderType]"></span></a>
    <span v-else>{{item.title}}</span>
  </th>
</template>
<script>
  import lodash from 'lodash'
  import {mapActions} from 'vuex'
  export default {
    name: 'v-table-header',
    data () {
      return {
        sortOrderType: ''
      }
    },
    props: ['item', 'pager', 'filters', 'sorts', 'actionUrls', 'tableId'],
    methods: lodash.assignIn({
      sortChange () {
        if (this.sorts[this.item.name]) {
          this.sorts[this.item.name] = this.sorts[this.item.name] === 'asc' ? 'desc' : 'asc'
          this.sortOrderType = this.sorts[this.item.name] === 'asc' ? 'glyphicon-menu-up' : 'glyphicon-menu-down'
        } else {
          this.sorts[this.item.name] = this.sorts[this.item.name] = 'asc'
          this.sortOrderType = 'glyphicon-menu-up'
        }
        lodash.debounce(function () {
          let pager = this.pager
          let filters = this.filters
          let sorts = this.sorts
          this.tableGetList({id: this.tableId, listUrl: this.actionUrls.listUrl, pager, filters, sorts})
        }.bind(this), 500)()
      }
    }, mapActions([
      'tableGetList'
    ]))
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  @import "../../scss/import.scss";

  th {
    position: relative;
    border-bottom: 1px solid #ccc;
    padding: 2px;
    &.theader-actions {
      text-align: right;
      padding-right: 8px;
    }
    a {
      cursor: pointer;
    }
  }
</style>
