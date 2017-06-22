/**
 * Created by Donghui Huo on 2017/3/29.
 */
import lodash from 'lodash'
import {types, utilfuns} from './state'
export default {
  formInit: function ({commit, state}, {id, key, initUrl, formRule}) {
    if (initUrl) {
      commit(types.FORM_REQUEST, {
        [global.CALL_SERVER_PLUGIN]: {
          id,
          httpType: 'get',
          endpoint: initUrl,
          params: {key},
          types: {success_type: types.FORM_SUCCESS, failure_type: types.FORM_FAILURE}
        }
      })
    } else {
      utilfuns.initForm(id, formRule, {operation: 'initForm'})
    }
  },
  formReset: function ({commit, state}, {id, resetUrl}) {
    if (!resetUrl) {
      utilfuns.resetForm(id)
    } else {
      commit(types.FORM_RESET_REQUEST, {
        [global.CALL_SERVER_PLUGIN]: {
          id,
          httpType: 'get',
          endpoint: resetUrl,
          params: {key: id},
          types: {success_type: types.FORM_RESET_SUCCESS, failure_type: types.FORM_RESET_FAILURE}
        }
      })
    }
  },
  formRuleChange: function ({commit, state}, {id, parameters, ruleChangeUrl}) {
    commit(types.FORM_RULE_CHANGE_REQUEST, {
      [global.CALL_SERVER_PLUGIN]: {
        id,
        httpType: 'post',
        endpoint: ruleChangeUrl,
        data: parameters,
        types: {success_type: types.FORM_RULE_CHANGE_SUCCESS, failure_type: types.FORM_RULE_CHANGE_FAILURE}
      }
    })
  },
  formSave: function ({commit, state}, {id, key, saveUrl}) {
    let items = lodash.cloneDeep(utilfuns.getForm(id).rules.items)
    // 采用data抽取的方式
    // 稍后需要考虑multi type
    // 首先validate items
    // 同时给data赋值
    // 然后进行multi的确认，在plugin部分进行multi的处理
    let validateFormClient = function (items) {
      let returnFlag = true
      let multipart = false
      let data = {}

      let validateInternal = function (itemData, validateRules, type, item) {
        var tmpData = null
        if (itemData != null && itemData !== undefined) {
          if (typeof itemData === 'number') {
            itemData = itemData + ''
          }
          if (typeof itemData === 'string') {
            tmpData = itemData.replace(/(^\s*)|(\s*$)/g, '')
          } else if (itemData instanceof Array && itemData.length > 0) {
            tmpData = JSON.stringify(itemData)
          } else if (itemData instanceof Object) {
            tmpData = itemData
          }
        }
        if (!tmpData) {
          tmpData = ''
        }
        if (type !== 'file') {
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
          if (item.required && lodash.isEmpty(itemData)) {
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
      let validateSub = function (item) {
        if (item.type === 'file') {
          multipart = true
        }
        if (!item.locked && !item.hidden && (item.validate && item.validate.length > 0 || item.type === 'file')) {
          let validatedMsg = validateInternal(item.defaultValue, item.validate, item.type, item)
          if (validatedMsg) {
            item.validatedMsg = validatedMsg
            returnFlag = false
          } else {
            data[item.name] = item.defaultValue
          }
        } else {
          data[item.name] = item.defaultValue
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
    }
    var validated = validateFormClient(items)
    if (!validated.returnFlag) {
      // 校验失败
      commit(types.FORM_SAVE_FAILURE, {id, items})
    } else {
      commit(types.FORM_SAVE_REQUEST, {
        [global.CALL_SERVER_PLUGIN]: {
          id,
          httpType: 'post',
          endpoint: saveUrl,
          params: {key},
          data: validated.data,
          multipart: validated.multipart,
          types: {success_type: types.FORM_SAVE_SUCCESS, failure_type: types.FORM_SAVE_FAILURE}
        }
      })
    }
  },
  clearForm: function ({commit}, {id}) {
    commit(types.CLEAR_FORM, {id})
  },
  removeFormError: function ({commit}, {id}) {
    commit(types.REMOVE_FORM_ERROR, {id})
  },
  removeFormSuccess: function ({commit}, {id}) {
    commit(types.REMOVE_FORM_SUCCESS, {id})
  }
}
