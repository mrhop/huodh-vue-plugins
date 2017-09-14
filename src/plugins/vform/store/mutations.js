/**
 * Created by Donghui Huo on 2017/3/29.
 */
import {types, utilfuns} from './state'
export default {
  [types.FORM_REQUEST] (state) {
  },
  [types.FORM_SUCCESS] (state, {id, data, callParameters}) {
    utilfuns.initForm(id, data, {operation: 'initForm'})
  },
  [types.FORM_FAILURE] (state, {id, error}) {
    console.log('到达error这里')
    utilfuns.getForm(id).error = error
  },
  [types.FORM_RESET_REQUEST] (state) {
  },
  [types.FORM_RESET_SUCCESS] (state, {id, data, callParameters}) {
    if (data) {
      utilfuns.initForm(id, data, {operation: 'resetForm'})
    } else {
      utilfuns.resetForm(id)
    }
  },
  [types.FORM_RESET_FAILURE] (state, {id, error}) {
    console.log('到达error这里')
    utilfuns.getForm(id).error = error
  },
  [types.FORM_SAVE_REQUEST] (state) {
  },
  [types.FORM_SAVE_SUCCESS] (state, {id, data, callParameters}) {
    // 给出modal或者，直接返回到backup的url，根据是否有backup的action
    // 判断data的返回给出的错误信息或者无返回，或者返回正确，来给出正确或者错误的响应
    // 给出一个operation的变换，然后监听后，进行callback的处理
    if (data && data.error) {
      utilfuns.getForm(id).error = data.error
    } else if (data && data.success) {
      utilfuns.getForm(id).success = data.success
      utilfuns.getForm(id).data = callParameters.data
    } else {
      utilfuns.getForm(id).success = true
      utilfuns.getForm(id).data = callParameters.data
    }
  },
  [types.FORM_SAVE_FAILURE] (state, {id, items, error}) {
    console.log('到达error这里')
    if (items) {
      utilfuns.getForm(id).rules.items = items
      utilfuns.getForm(id).error = true
    } else if (error) {
      // 应该给出一个modal的提示，做出网络或者其他的错误提示
      utilfuns.getForm(id).error = error
    }
  },
  [types.FORM_RULE_CHANGE_REQUEST] (state) {
  },
  [types.FORM_RULE_CHANGE_SUCCESS] (state, {id, data, callParameters}) {
    utilfuns.changeFormRule(id, data, {operation: 'changeRule'})
  },
  [types.FORM_RULE_CHANGE_FAILURE] (state, {id, error}) {
    utilfuns.getForm(id).error = error
  },
  [types.CLEAR_FORM] (state, {id}) {
    utilfuns.deleteForm(id)
  },
  [types.REMOVE_FORM_ERROR] (state, {id}) {
    state.dataArray.find(i => i.id === id).error = ''
  },
  [types.REMOVE_FORM_SUCCESS] (state, {id}) {
    state.dataArray.find(i => i.id === id).success = false
  }
}
