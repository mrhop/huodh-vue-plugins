/**
 * Created by Donghui Huo on 2017/3/29.
 */
import {types, utilfuns} from './state'
export default {
  [types.TABLE_REQUEST] (state) {
  },
  [types.TABLE_SUCCESS] (state, {id, data, callParameters}) {
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
