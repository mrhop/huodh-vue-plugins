/**
 * Created by Donghui Huo on 2017/3/29.
 */
import lodash from 'lodash'
import {types, utilfuns} from './state'
export default {
  formInit: function ({commit, state}, {id, key, initUrl}) {
    console.log('form - get')
    commit(types.FORM_REQUEST, {
      [global.CALL_SERVER_PLUGIN]: {
        id,
        httpType: 'get',
        endpoint: initUrl,
        params: {key},
        types: {success_type: types.FORM_SUCCESS, failure_type: types.FORM_FAILURE}
      }
    })
  },
  formReset: function ({commit, state}, {id}) {
    console.log('form - reset')
    utilfuns.resetForm(id)
  },
  formSave: function ({commit, state}, {id, key, saveUrl}) {
    console.log('form - save')
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

      let validateInternal = function (itemData, validateRules) {
        var tmpData = null
        if (itemData != null && itemData !== undefined) {
          if (typeof itemData === 'number') {
            itemData = itemData + ''
          }
          if (typeof itemData === 'string') {
            tmpData = itemData.replace(/(^\s*)|(\s*$)/g, '')
          } else if (itemData instanceof Array && itemData.length > 0) {
            tmpData = JSON.stringify(itemData)
          } else if (typeof itemData === 'object') {
            tmpData = ''
            for (var key in itemData) {
              if (itemData[key].files) {
                tmpData += itemData[key].value.toLowerCase()
              }
            }
          }
        }
        if (!tmpData) {
          tmpData = ''
        }
        for (var index in validateRules) {
          let validateRule = validateRules[index]
          let regExp = new RegExp(validateRule.regex)
          if (!regExp.test(tmpData)) {
            return validateRule.errorMsg
          }
        }
        return null
      }
      items.forEach(function (item) {
        if (item.type === 'file') {
          multipart = true
        }
        if (!item.locked && item.validate && item.validate.length > 0) {
          let validatedMsg = validateInternal(item.defaultValue, item.validate)
          if (validatedMsg) {
            item.validatedMsg = validatedMsg
            returnFlag = false
          } else {
            data[item.name] = item.defaultValue
          }
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
