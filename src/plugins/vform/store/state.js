/**
 * Created by Donghui Huo on 2017/3/29.
 */
import lodash from 'lodash'
import Vue from 'vue'
const state = {
  dataArray: [],
  dataArrayInit: []
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
const validateInternal = function (itemData, validateRules, type, item) {
  var tmpData
  if (itemData !== null && itemData !== undefined) {
    if (typeof itemData === 'number' || typeof itemData === 'boolean') {
      itemData = itemData + ''
    }
    if (typeof itemData === 'string') {
      tmpData = itemData
      // tmpData = itemData.replace(/(^\s*)|(\s*$)/g, '')
    } else if (itemData instanceof Array && itemData.length > 0) {
      tmpData = JSON.stringify(itemData)
    } else if (itemData instanceof Object) {
      tmpData = itemData
    }
  }
  tmpData = tmpData || ''
  let isEmpty = true
  if (type !== 'file' && type !== 'image') {
    isEmpty = lodash.isEmpty(itemData)
  } else {
    for (let key in tmpData) {
      if (tmpData[key]) {
        isEmpty = false
        break
      }
    }
  }
  if (item.required !== false || !isEmpty) {
    if (type !== 'file' && type !== 'image') {
      for (var index in validateRules) {
        let validateRule = validateRules[index]
        let regExp = new RegExp(validateRule.regex)
        if (!regExp.test(tmpData)) {
          return validateRule.errorMsg
        }
      }
      return null
    } else {
      var errorFileMsg = {}
      if (validateRules) {
        for (var index1 in validateRules) {
          let validateRule = validateRules[index1]
          let regExp = new RegExp(validateRule.regex)
          for (var key in tmpData) {
            if (tmpData[key] && !errorFileMsg[key] && !regExp.test(tmpData[key][0].name)) {
              errorFileMsg[key] = validateRule.errorMsg
            }
          }
        }
      }
      if (isEmpty) {
        errorFileMsg[item.name] = '不能为空'
        return errorFileMsg
      }
      if (item.maxSize && lodash.isEmpty(errorFileMsg) && !lodash.isEmpty(itemData)) {
        for (var fileIndex in itemData) {
          if (itemData[fileIndex] && itemData[fileIndex][0] instanceof File) {
            if (itemData[fileIndex][0].size > item.maxSize) {
              errorFileMsg[fileIndex] = '超过大小上限:' + item.maxSize + '字节'
            }
          }
        }
      }
      return lodash.isEmpty(errorFileMsg) ? null : errorFileMsg
    }
  }
}
const setDefaultValues = function (items, tempForm) {
  for (var key in items) {
    if (items[key].hidden === undefined || items[key].hidden === null) {
      items[key].hidden = false
    }
    if (items[key].locked === undefined || items[key].locked === null) {
      items[key].locked = false
    }
    items[key].validatedMsg = undefined
    if (!items[key].hidden && tempForm && tempForm.length > 0 && tempForm[0].rules.items.length > 0) {
      items[key].init = true
    }
    if (items[key].type === 'file' || items[key].type === 'image') {
      items[key].defaultValue = {}
      for (var i = 1; i <= (items[key].quantity || 1); i++) {
        items[key].defaultValue[items[key].name + i] = null
      }
    } else if (items[key].type === 'tree') {
      items[key].defaultValue = items[key].defaultValue || undefined
      items[key].defaultLabel = items[key].defaultLabel || undefined
      items[key].treeData = items[key].treeData || undefined
    } else if (items[key].type === 'tree-checkbox') {
      items[key].defaultValue = items[key].defaultValue || []
      items[key].treeData = items[key].treeData || undefined
    } else {
      if (items[key].type === 'checkbox') {
        if (!items[key].items) {
          items[key].items = []
        }
        if (!items[key].defaultValue) {
          items[key].defaultValue = []
        }
      } else if (items[key].type === 'select' || items[key].type === 'radio') {
        if (!items[key].items) {
          items[key].items = []
        }
        if (!items[key].defaultValue) {
          items[key].defaultValue = undefined
        }
      } else if (items[key].defaultValue === undefined || items[key].defaultValue === null) {
        items[key].defaultValue = undefined
      }
    }
  }
}
const setDefaultValue = function (item) {
  if (item.hidden === undefined || item.hidden === null) {
    item.hidden = false
  }
  if (item.locked === undefined || item.locked === null) {
    item.locked = false
  }
  item.validatedMsg = undefined
  item.init = true
  if (item.type === 'file' || item.type === 'image') {
    item.defaultValue = {}
    for (var i = 1; i <= (item.quantity || 1); i++) {
      item.defaultValue[item.name + i] = null
    }
  } else if (item.type === 'tree') {
    item.defaultValue = item.defaultValue || undefined
    item.defaultLabel = item.defaultLabel || undefined
    item.treeData = item.treeData || undefined
  } else if (item.type === 'tree-checkbox') {
    item.defaultValue = item.defaultValue || []
    item.treeData = item.treeData || undefined
  } else {
    if (item.type === 'checkbox') {
      if (!item.items) {
        item.items = []
      }
      if (!item.defaultValue) {
        item.defaultValue = []
      }
    } else if (item.type === 'select' || item.type === 'radio') {
      if (!item.items) {
        item.items = []
      }
      if (!item.defaultValue) {
        item.defaultValue = undefined
      }
    } else if (item.defaultValue === undefined || item.defaultValue === null) {
      item.defaultValue = undefined
    }
  }
}
const utilfuns = {
  getForm (id) {
    let data = state.dataArray.find(i => i.id === id)
    if (!data) {
      data = {
        rules: {
          items: [],
          action: {}
        },
        error: '',
        success: '',
        data: {},
        operation: 'getForm'
      }
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
      let dataLocal = lodash.cloneDeep(data)
      let items = dataLocal.rules.items
      for (var key in items) {
        if (!items[key].hidden) {
          items[key].init = true
        }
      }
      state.dataArray.push(dataLocal)
    }
  },
  initForm (id, data, additionalParams) {
    let tempForm = lodash.remove(state.dataArray, function (item) {
      return item.id === id
    })
    lodash.remove(state.dataArrayInit, function (item) {
      return item.id === id
    })
    let dataLocal = lodash.assign({}, {
      rules: {
        items: [],
        action: {}
      },
      error: '',
      success: '',
      data: {},
      operation: 'getForm'
    }, additionalParams)
    lodash.assign(dataLocal.rules, data.rules)
    let items = dataLocal.rules.items
    setDefaultValues(items, tempForm)
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
          item.init = true
          Vue.set(item, 'validatedMsg', undefined)
          lodash.assign(item, itemTemp)
        } else if (Array.isArray(item)) {
          for (var k in item) {
            var subItem = item[k]
            if (subItem.name === itemTemp.name) {
              subItem.init = true
              Vue.set(subItem, 'validatedMsg', undefined)
              lodash.assign(subItem, itemTemp)
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
  },
  validateFormClient: function (items) {
    let returnFlag = true
    let multipart = false
    let data = {}
    let validateSub = function (item) {
      if (item.validatedMsg) {
        returnFlag = false
      } else {
        if (item.type === 'file' || item.type === 'image') {
          multipart = true
        }
        // locked 也需要校验!item.locked &&
        if (!item.hidden && (item.validate && item.validate.length > 0 || item.type === 'file' || item.type === 'image')) {
          let validatedMsg = validateInternal(item.defaultValue, item.validate, item.type, item)
          if (validatedMsg) {
            Vue.set(item, 'validatedMsg', validatedMsg)
            returnFlag = false
          } else {
            if (item.defaultValue !== undefined) {
              data[item.name] = item.defaultValue
            }
          }
        } else {
          if (item.defaultValue !== undefined) {
            data[item.name] = item.defaultValue
          }
        }
      }
    }
    items.forEach(function (item) {
      if (Array.isArray(item)) {
        item.forEach(function (subitem) {
          validateSub(subitem)
        })
      } else {
        validateSub(item)
      }
    })
    return {items, data, returnFlag, multipart}
  },
  validateSub: function (item) {
    if (!item.locked && !item.hidden && (item.validate && item.validate.length > 0 || item.type === 'file' || item.type === 'image')) {
      let validatedMsg = validateInternal(item.defaultValue, item.validate, item.type, item)
      if (validatedMsg) {
        Vue.set(item, 'validatedMsg', validatedMsg)
      }
    }
  }
}
export {
  state as default,
  setDefaultValues,
  setDefaultValue,
  types,
  utilfuns
}
