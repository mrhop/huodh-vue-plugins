<template>
  <thead class="table-header" v-if="header">
  <tr>
    <tableHeaderTh v-for="(item, key) in header" :key="key" :item="item" :sorts="sorts"
                   v-on:sortIt="continuousInputCheck"/>
    <th class="theader-actions">操作</th>
  </tr>
  <tr v-if="feature&&feature.filter" class="form-group">
    <th v-for="(item, key) in header" :key="key">
      <formElement v-if="item.filter&&item.ruleChange" :dataFromParent="filters" :options="item"
                   :callback="continuousInputCheck.bind(this)"
                   v-on:ruleChange="ruleChange"
                   :key="key"/>
      <formElement v-else-if="item.filter" :dataFromParent="filters" :options="item"
                   :callback="continuousInputCheck.bind(this)"
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
  import tableHeaderTh from './TableHeaderTh.vue'
  export default {
    name: 'v-table-header',
    data () {
      return {
        pageSize: this.pager ? this.pager.pageSize : 15,
        sortOrderType: '',
        lastInputTime: new Date()
      }
    },
    props: ['header', 'action', 'feature', 'pager', 'filters', 'sorts', 'actionUrls', 'actions', 'tableId'],
    methods: lodash.assignIn({
      continuousInputCheck (target) {
        this.lastInputTime = new Date()
        lodash.debounce(function () {
          let date = new Date()
          if ((date.getTime() - this.lastInputTime.getTime()) > 499) {
            let pager = this.pager
            let filters = this.filters
            if (filters) {
              for (let key in filters) {
                if (filters.hasOwnProperty(key)) {
                  if (!filters[key] && filters[key] !== false) {
                    delete filters[key]
                  }
                }
              }
            }
            let sorts = this.sorts
            this.tableGetList({
              id: this.tableId,
              listUrl: this.actionUrls && this.actionUrls.listUrl,
              listAction: this.actions && this.actions.list,
              pager,
              filters,
              sorts
            })
          }
        }.bind(this), 500)()
      },
      ruleChange (parameters) {
        this.tableRuleChange({
          id: this.tableId,
          parameters: {changed: parameters, items: this.header},
          ruleChangeUrl: this.actionUrls && this.actionUrls.ruleChangeUrl,
          ruleChangeAction: this.actions && this.actions.ruleChange
        })
      }
    }, mapActions([
      'tableGetList',
      'tableRuleChange'
    ])),
    components: {tableHeaderTh, formElement}
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
