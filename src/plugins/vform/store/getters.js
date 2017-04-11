/**
 * Created by Donghui Huo on 2017/3/29.
 */
import {utilfuns} from './state'
export default{
  formItems: (state, getters) => (id) => {
    let data = utilfuns.getForm(id)
    return data.rules.items || state.default.rules.items
  },
  formAction: (state, getters) => (id) => {
    let data = utilfuns.getForm(id)
    return data.rules.action || state.default.rules.action
  },
  formError: (state, getters) => (id) => {
    let data = utilfuns.getForm(id)
    return data.error || ''
  },
  formSuccess: (state, getters) => (id) => {
    let data = utilfuns.getForm(id)
    return data.success || ''
  }
}
