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
    data: {},
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
  FORM_RESET_REQUEST: 'FORM_RESET_REQUEST',
  FORM_RESET_SUCCESS: 'FORM_RESET_SUCCESS',
  FORM_RESET_FAILURE: 'FORM_RESET_FAILURE',
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
    lodash.remove(state.dataArray, function (item) {
      return item.id === id
    })
    lodash.remove(state.dataArrayInit, function (item) {
      return item.id === id
    })
    let dataLocal = lodash.assign({}, state.default, data, additionalParams)
    dataLocal.id = id
    state.dataArray.push(lodash.cloneDeep(dataLocal))
    state.dataArrayInit.push(lodash.cloneDeep(dataLocal))
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
        if (!Array.isArray(item) && item.name === itemTemp.name) {
          lodash.assign(item, itemTemp)
          delete item.validatedMsg
        } else if (Array.isArray(item)) {
          for (var k in item) {
            var subItem = item[k]
            if (subItem.name === itemTemp.name) {
              lodash.assign(subItem, itemTemp)
              delete subItem.validatedMsg
            }
          }
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
