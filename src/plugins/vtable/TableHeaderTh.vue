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
    props: ['item', 'sorts'],
    methods: lodash.assignIn({
      sortChange () {
        if (this.sorts[this.item.name]) {
          this.sorts[this.item.name] = this.sorts[this.item.name] === 'asc' ? 'desc' : 'asc'
        } else {
          this.sorts[this.item.name] = this.sorts[this.item.name] = 'asc'
        }
        this.$emit('sortIt')
      }
    }, mapActions([
      'tableGetList'
    ])),
    computed: {
      sortOrderType () {
        if (this.sorts[this.item.name]) {
          return this.sorts[this.item.name] === 'asc' ? 'glyphicon-menu-up' : 'glyphicon-menu-down'
        } else {
          return ''
        }
      }
    }
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
