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
        for (var key in data.rules.header) {
          var items = data.rules.header
          if (items[key].editable || items[key].filter) {
            if (items[key].type === 'file' || items[key].type === 'image') {
              items[key].defaultValue = {}
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
        Vue.set(data.rules, 'headerConst', lodash.cloneDeep(data.rules.header))
      }
      data.init = false
    }
    utilfuns.setTable(id, data, {operation: 'getTable'})
  },
  [types.TABLE_FAILURE] (state, {id, error}) {
    console.log(error)
    utilfuns.getTable(id).error = error
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
  },
  [types.TABLE_RULE_CHANGE_REQUEST] (state) {
  },
  [types.TABLE_RULE_CHANGE_SUCCESS] (state, {id, data, callParameters}) {
    utilfuns.changeTableRule(id, data, {operation: 'changeRule'})
  },
  [types.TABLE_RULE_CHANGE_FAILURE] (state, {id, error}) {
    console.log(error)
    utilfuns.getTable(id).error = error
  }
}
