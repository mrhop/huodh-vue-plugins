/**
 * Created by Donghui Huo on 2017/3/29.
 */
import {types, utilfuns} from './state'
import Vue from 'vue'
export default {
  treeInit: function ({commit, state}, {id, initUrl, treeData}) {
    if (initUrl) {
      commit(types.TREE_REQUEST, {
        [global.CALL_SERVER_PLUGIN]: {
          id,
          httpType: 'get',
          endpoint: initUrl,
          types: {success_type: types.TREE_SUCCESS, failure_type: types.TREE_FAILURE}
        }
      })
    } else {
      utilfuns.initTree(id, treeData)
    }
  },
  treeDelete: function ({commit, state}, {id}) {
    utilfuns.deleteTree(id)
  },
  treeItemDelete: function ({commit, state}, {id, deleteUrl, deleteAction, itemId}) {
    if (deleteUrl) {
      commit(types.TREE_ITEM_DELETE_REQUEST, {
        [global.CALL_SERVER_PLUGIN]: {
          id,
          httpType: 'get',
          endpoint: deleteUrl,
          params: {id: itemId},
          types: {success_type: types.TREE_ITEM_DELETE_SUCCESS, failure_type: types.TREE_ITEM_DELETE_FAILURE}
        }
      })
    } else if (deleteAction) {
      var data = deleteAction({id: itemId})
      if (data) {
        commit(types.TREE_ITEM_DELETE_SUCCESS, {
          id, data, callParameters: {id, deleteUrl, deleteAction, itemId}
        })
      } else {
        commit(types.TREE_ITEM_DELETE_SUCCESS, {
          id, error: 'error from outside action', callParameters: {id, deleteUrl, deleteAction, itemId}
        })
      }
    }
  },
  treeItemAdd: function ({commit, state}, {id, parentId, itemData}) {
    utilfuns.addTreeItem(id, parentId, itemData)
  },
  treeItemUpdate: function ({commit, state}, {id, itemData}) {
    utilfuns.updateTreeItem(id, itemData)
  },
  removeTreeError: function ({commit}, {id}) {
    Vue.delete(utilfuns.getTree(id), 'error')
  }
}
