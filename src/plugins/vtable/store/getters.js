/**
 * Created by Donghui Huo on 2017/3/29.
 */
import {utilfuns} from './state'
import lodash from 'lodash'
export default{
  tableHeader: (state, getters) => (id) => {
    let data = utilfuns.getTable(id)
    return data.rules.header
  },
  tableHeaderConst: (state, getters) => (id) => {
    let data = utilfuns.getTable(id)
    return data.rules.headerConst
  },
  tableAction: (state, getters) => (id) => {
    let data = utilfuns.getTable(id)
    return data.rules.action
  },
  tableFeature: (state, getters) => (id) => {
    let data = utilfuns.getTable(id)
    return data.rules.feature
  },
  tableRows: (state, getters) => (id) => {
    let data = utilfuns.getTable(id)
    return data.data.rows
  },
  tableTotalCount: (state, getters) => (id) => {
    let data = utilfuns.getTable(id)
    return data.data.totalCount
  },
  tablePager: (state, getters) => (id) => {
    let data = utilfuns.getTable(id)
    return data.data.pager
  },
  tablePageSize: (state, getters) => (id) => {
    let data = utilfuns.getTable(id)
    return data.data.pager.pageSize
  },
  tableFilters: (state, getters) => (id) => {
    let data = utilfuns.getTable(id)
    return data.data.filters
  },
  tableSorts: (state, getters) => (id) => {
    let data = utilfuns.getTable(id)
    return data.data.sorts
  },
  tableHasSn: (state, getters) => (id) => {
    let data = utilfuns.getTable(id)
    var snIndex = lodash.findIndex(data.rules.header, function (o) {
      return o.name === '#sn'
    })
    if (snIndex > -1) {
      return true
    } else {
      return false
    }
  },
  tableTotalPage: (state, getters) => (id) => {
    let data = utilfuns.getTable(id)
    return data.rules.feature && data.rules.feature.pager ? Math.ceil(data.data.totalCount / data.data.pager.pageSize) : 1
  },
  tableCurrentPage: (state, getters) => (id) => {
    let data = utilfuns.getTable(id)
    return data.rules.feature && data.rules.feature.pager ? data.data.pager.currentPage : 1
  },
  tableDeleteRowSuccess: (state, getters) => (id) => {
    let data = utilfuns.getTable(id)
    if (data.operation === 'deleteRow') {
      return true
    } else {
      return false
    }
  }
}
