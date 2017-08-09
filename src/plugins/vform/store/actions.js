/**
 * Created by Donghui Huo on 2017/3/29.
 */
import lodash from 'lodash'
import {types, utilfuns} from './state'
export default {
  formInit: function ({commit, state}, {id, key, initUrl, initAction, formRule}) {
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
    } else if (initAction) {
      var data = initAction({key})
      if (data) {
        utilfuns.initForm(id, data, {operation: 'initForm'})
      }
    } else if (formRule) {
      utilfuns.initForm(id, formRule, {operation: 'initForm'})
    }
  },
  formReset: function ({commit, state}, {id, resetUrl, resetAction}) {
    if (!resetUrl && !resetAction) {
      utilfuns.resetForm(id)
    } else if (resetUrl) {
      commit(types.FORM_RESET_REQUEST, {
        [global.CALL_SERVER_PLUGIN]: {
          id,
          httpType: 'get',
          endpoint: resetUrl,
          params: {key: id},
          types: {success_type: types.FORM_RESET_SUCCESS, failure_type: types.FORM_RESET_FAILURE}
        }
      })
    } else if (resetAction) {
      var data = resetAction({key: id})
      if (data) {
        commit(types.FORM_RESET_SUCCESS, {
          id, data, callParameters: {id, resetUrl, resetAction}
        })
      }
    }
  },
  formRuleChange: function ({commit, state}, {id, parameters, ruleChangeUrl, ruleChangeAction}) {
    if (ruleChangeUrl) {
      commit(types.FORM_RULE_CHANGE_REQUEST, {
        [global.CALL_SERVER_PLUGIN]: {
          id,
          httpType: 'post',
          endpoint: ruleChangeUrl,
          data: parameters,
          types: {success_type: types.FORM_RULE_CHANGE_SUCCESS, failure_type: types.FORM_RULE_CHANGE_FAILURE}
        }
      })
    } else if (ruleChangeAction) {
      var data = ruleChangeAction(parameters)
      if (data) {
        commit(types.FORM_RULE_CHANGE_SUCCESS, {
          id, data, callParameters: {id, parameters, ruleChangeUrl, ruleChangeAction}
        })
      }
    }
  },
  formSave: function ({commit, state}, {id, key, saveUrl, saveAction}) {
    let items = lodash.cloneDeep(utilfuns.getForm(id).rules.items)
    // 采用data抽取的方式
    // 稍后需要考虑multi type
    // 首先validate items
    // 同时给data赋值
    // 然后进行multi的确认，在plugin部分进行multi的处理
    var validated = utilfuns.validateFormClient(items)
    if (!validated.returnFlag) {
      // 校验失败
      commit(types.FORM_SAVE_FAILURE, {id, items})
    } else {
      if (saveUrl) {
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
      } else if (saveAction) {
        var data = saveAction({key, data: validated.data, multipart: validated.multipart})
        if (data) {
          commit(types.FORM_SAVE_SUCCESS, {
            id, data, callParameters: {id, saveUrl, saveAction, data: validated.data}
          })
        }
      }
    }
  },
  formValidate: function ({commit, state}, {id, key, saveUrl, saveAction}) {
    let items = lodash.cloneDeep(utilfuns.getForm(id).rules.items)
    var validated = utilfuns.validateFormClient(items)
    if (!validated.returnFlag) {
      // 校验失败
      commit(types.FORM_SAVE_FAILURE, {id, items})
    } else {
      return true
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
