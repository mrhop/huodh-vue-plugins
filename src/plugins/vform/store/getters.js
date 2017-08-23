/**
 * Created by Donghui Huo on 2017/3/29.
 */
import {utilfuns} from './state'
export default{
  formItems: (state, getters) => (id) => {
    let data = utilfuns.getForm(id)
    return data.rules.items
  },
  data: (state, getters) => (id) => {
    let data = utilfuns.getForm(id)
    return data.data
  },
  formAction: (state, getters) => (id) => {
    let data = utilfuns.getForm(id)
    return data.rules.action
  },
  formError: (state, getters) => (id) => {
    let data = utilfuns.getForm(id)
    return data.error || ''
  },
  formSuccess: (state, getters) => (id) => {
    let data = utilfuns.getForm(id)
    return data.success || false
  }
}
