/**
 * Created by Donghui Huo on 2017/3/29.
 */
import lodash from 'lodash'
const state = {
  dataArray: [],
  dataArrayInit: [],
  default: {
    rules: {
      items: [],
      action: {}
    },
    error: '',
    success: '',
    operation: 'getForm'
  }
}
const types = {
  FORM_REQUEST: 'FORM_REQUEST',
  FORM_SUCCESS: 'FORM_SUCCESS',
  FORM_FAILURE: 'FORM_FAILURE',
  FORM_RULE_CHANGE_REQUEST: 'FORM_RULE_CHANGE_REQUEST',
  FORM_RULE_CHANGE_SUCCESS: 'FORM_RULE_CHANGE_SUCCESS',
  FORM_RULE_CHANGE_FAILURE: 'FORM_RULE_CHANGE_FAILURE',
  FORM_SAVE_REQUEST: 'FORM_SAVE_REQUEST',
  FORM_SAVE_SUCCESS: 'FORM_SAVE_SUCCESS',
  FORM_SAVE_FAILURE: 'FORM_SAVE_FAILURE',
  CLEAR_FORM: 'CLEAR_FORM',
  REMOVE_FORM_ERROR: 'REMOVE_FORM_ERROR',
  REMOVE_FORM_SUCCESS: 'REMOVE_FORM_SUCCESS'
}
const utilfuns = {
  getForm (id) {
    let data = state.dataArray.find(i => i.id === id)
    if (!data) {
      data = lodash.assign({}, state.default)
      data.id = id
      state.dataArray.push(data)
    }
    return data
  },
  resetForm (id) {
    let data = state.dataArrayInit.find(i => i.id === id)
    if (data) {
      lodash.remove(state.dataArray, function (i) {
        return i.id === id
      })
      state.dataArray.push(lodash.cloneDeep(data))
    }
  },
  initForm (id, data, additionalParams) {
    let dataLocal = state.dataArray.find(i => i.id === id)
    if (!dataLocal) {
      dataLocal = lodash.assign({}, state.default, data, additionalParams)
      dataLocal.id = id
      state.dataArray.push(dataLocal)
    } else {
      lodash.assign(dataLocal, data, additionalParams)
    }
    state.dataArrayInit.push(lodash.cloneDeep(dataLocal))
    return dataLocal
  },
  setForm (id, data, additionalParams) {
    let dataLocal = state.dataArray.find(i => i.id === id)
    lodash.assign(dataLocal, data, additionalParams)
    return dataLocal
  },
  changeFormRule (id, data, additionalParams) {
    let dataLocal = state.dataArray.find(i => i.id === id)
    for (var i in dataLocal.rules.items) {
      var item = dataLocal.rules.items[i]
      for (var j in data) {
        var itemTemp = data[j]
        if (item.name === itemTemp.name) {
          lodash.assign(item, itemTemp)
        }
      }
    }
    lodash.assign(dataLocal, additionalParams)
    return dataLocal
  },
  deleteForm (id) {
    let dataLocal = lodash.remove(state.dataArray, function (i) {
      return i.id === id
    })
    lodash.remove(state.dataArrayInit, function (i) {
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
