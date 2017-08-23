/**
 * Created by Donghui Huo on 2017/3/29.
 */
import lodash from 'lodash'
import Vue from 'vue'

const state = {
  dataArray: []
}
const types = {
  TABLE_REQUEST: 'TABLE_REQUEST',
  TABLE_SUCCESS: 'TABLE_SUCCESS',
  TABLE_FAILURE: 'TABLE_FAILURE',
  TABLE_DELETE_REQUEST: 'TABLE_DELETE_REQUEST',
  TABLE_DELETE_SUCCESS: 'TABLE_DELETE_SUCCESS',
  TABLE_DELETE_FAILURE: 'TABLE_DELETE_FAILURE',
  TABLE_RULE_CHANGE_REQUEST: 'TABLE_RULE_CHANGE_REQUEST',
  TABLE_RULE_CHANGE_SUCCESS: 'TABLE_RULE_CHANGE_SUCCESS',
  TABLE_RULE_CHANGE_FAILURE: 'TABLE_RULE_CHANGE_FAILURE',
  CLEAR_TABLE: 'CLEAR_TABLE'
}
const utilfuns = {
  getTable (id) {
    let data = state.dataArray.find(i => i.id === id)
    if (!data) {
      data = {
        rules: {
          header: [],
          headerConst: [],
          action: {},
          feature: {}
        },
        data: {
          rows: [],
          totalCount: 0,
          pager: {
            pageSize: 10,
            currentPage: 1
          },
          filters: {},
          sorts: {}
        },
        operation: 'getTable',
        init: true
      }
      data.id = id
      state.dataArray.push(data)
    }
    return data
  },
  setTable (id, data, additionalParams) {
    let dataLocal = state.dataArray.find(i => i.id === id)
    if (!dataLocal) {
      dataLocal = lodash.assign({}, {
        rules: {
          header: [],
          headerConst: [],
          action: {},
          feature: {}
        },
        data: {
          rows: [],
          totalCount: 0,
          pager: {
            pageSize: 10,
            currentPage: 1
          },
          filters: {},
          sorts: {}
        },
        operation: 'getTable',
        init: true
      }, data, additionalParams)
      dataLocal.id = id
      state.dataArray.push(dataLocal)
    } else {
      lodash.assign(dataLocal.rules, data.rules)
      lodash.assign(dataLocal.data, data.data)
      lodash.assign(dataLocal, additionalParams)
    }
    return dataLocal
  },
  deleteTable (id) {
    let dataLocal = lodash.remove(state.dataArray, function (i) {
      return i.id === id
    })
    return dataLocal ? dataLocal[0] : null
  },
  resetRefreshTableBody (id) {
    let dataLocal = lodash.remove(state.dataArray, function (i) {
      return i.id === id
    })
    let data = state.dataArray.find(i => i.id === id)
    if (data) {
      Vue.set(dataLocal, 'refreshTableBody', false)
    }
  },
  changeTableRule (id, data, additionalParams) {
    let dataLocal = state.dataArray.find(i => i.id === id)
    let header = dataLocal.rules.header
    let headerConst = dataLocal.rules.headerConst
    for (var i in headerConst) {
      let item = headerConst[i]
      let itemForRow = header[i]
      for (var j in data) {
        let itemTemp = data[j]
        if (item.name === itemTemp.name) {
          Vue.set(item, 'init', true)
          Vue.set(item, 'validatedMsg', undefined)
          lodash.assign(item, itemTemp)
          Vue.set(itemForRow, 'init', true)
          Vue.set(itemForRow, 'validatedMsg', undefined)
          lodash.assign(itemForRow, itemTemp)
        }
      }
    }
  }
}
export {
  state as default,
  types,
  utilfuns
}
