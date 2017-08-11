/**
 * Created by Donghui Huo on 2017/3/29.
 */
import Vue from 'vue'
import lodash from 'lodash'
import {types, utilfuns} from './state'
export default {
  [types.TABLE_REQUEST] (state) {
  },
  [types.TABLE_SUCCESS] (state, {id, data, callParameters}) {
    if (callParameters.init || callParameters.data && callParameters.data.init) {
      if (data.rules && data.rules.header) {
        Vue.set(data.rules, 'headerConst', lodash.cloneDeep(data.rules.header))
        for (var key in data.rules.header) {
          if (data.rules.header[key].editable) {
            if (data.rules.header[key].type === 'checkbox') {
              Vue.set(data.rules.header[key], 'defaultValue', [])
            } else if (data.rules.header[key].type === 'file' || data.rules.header[key].type === 'image') {
              Vue.set(data.rules.header[key], 'defaultValue', {})
            } else {
              Vue.set(data.rules.header[key], 'defaultValue', undefined)
            }
          }
        }
      }
    }
    utilfuns.setTable(id, data, {operation: 'getTable'})
  },
  [types.TABLE_FAILURE] (state, {id, error}) {
    console.log('到达error这里')
    // 应该给出一个modal的提示
  },
  [types.TABLE_DELETE_REQUEST] (state) {
  },
  [types.TABLE_DELETE_SUCCESS] (state, {id, data, callParameters}) {
    utilfuns.setTable(id, {}, {operation: 'deleteRow'})
  },
  [types.TABLE_DELETE_FAILURE] (state, {id, error}) {
    console.log('到达error这里')
    // 应该给出一个modal的提示
  },
  [types.CLEAR_TABLE] (state, {id}) {
    utilfuns.deleteTable(id)
  }
}
