/**
 * Created by Donghui Huo on 2017/3/29.
 */
import lodash from 'lodash'
const state = {
  dataArray: [],
  default: {
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
      filters: {}
    },
    operation: 'getTable'
  }
}
const types = {
  TABLE_REQUEST: 'TABLE_REQUEST',
  TABLE_SUCCESS: 'TABLE_SUCCESS',
  TABLE_FAILURE: 'TABLE_FAILURE',
  TABLE_DELETE_REQUEST: 'TABLE_DELETE_REQUEST',
  TABLE_DELETE_SUCCESS: 'TABLE_DELETE_SUCCESS',
  TABLE_DELETE_FAILURE: 'TABLE_DELETE_FAILURE',
  CLEAR_TABLE: 'CLEAR_TABLE'
}
const utilfuns = {
  getTable (id) {
    let data = state.dataArray.find(i => i.id === id)
    if (!data) {
      data = lodash.assign({}, state.default)
      data.id = id
      state.dataArray.push(data)
    }
    return data
  },
  setTable (id, data, additionalParams) {
    let dataLocal = state.dataArray.find(i => i.id === id)
    if (!dataLocal) {
      dataLocal = lodash.assign({}, state.default, data, additionalParams)
      dataLocal.id = id
      state.dataArray.push(dataLocal)
    } else {
      lodash.assign(dataLocal, data, additionalParams)
    }
    return dataLocal
  },
  deleteTable (id) {
    let dataLocal = lodash.remove(state.dataArray, function (i) {
      return i.id === id
    })
    return dataLocal ? dataLocal[0] : null
  }
}
export {
  state as default,
  types,
  utilfuns
}
