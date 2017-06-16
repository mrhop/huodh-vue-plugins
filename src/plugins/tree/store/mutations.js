/**
 * Created by Donghui Huo on 2017/3/29.
 */
import {types, utilfuns} from './state'
export default {
  [types.TREE_REQUEST] (state) {
  },
  [types.TREE_SUCCESS] (state, {id, data, callParameters}) {
    utilfuns.initTree(id, data)
  },
  [types.TREE_FAILURE] (state, {id, error}) {
    console.log('tree with id:' + id + 'init failed')
  },
  [types.TREE_ITEM_DELETE_REQUEST] (state) {
  },
  [types.TREE_ITEM_DELETE_SUCCESS] (state, {id, data, callParameters}) {
    utilfuns.deleteTreeItem(id, callParameters.params.id)
  },
  [types.TREE_ITEM_DELETE_FAILURE] (state, {id, error, callParameters}) {
    console.log('tree with id:' + id + 'delete item failed')
  }
}
