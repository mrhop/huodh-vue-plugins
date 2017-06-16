/**
 * Created by Donghui Huo on 2017/3/29.
 */
import lodash from 'lodash'
import Vue from 'vue'

const state = {
  dataArray: []
}
const types = {
  TREE_REQUEST: 'TREE_REQUEST',
  TREE_SUCCESS: 'TREE_SUCCESS',
  TREE_FAILURE: 'TREE_FAILURE',
  TREE_ITEM_DELETE_REQUEST: 'TREE_ITEM_DELETE_REQUEST',
  TREE_ITEM_DELETE_SUCCESS: 'TREE_ITEM_DELETE_SUCCESS',
  TREE_ITEM_DELETE_FAILURE: 'TREE_ITEM_DELETE_FAILURE'
}
const utilfuns = {
  initTree (id, data) {
    let dataLocal = {}
    dataLocal.id = id
    dataLocal.data = data
    state.dataArray.push(lodash.cloneDeep(dataLocal))
  },
  getTree (id) {
    let data = state.dataArray.find(i => i.id === id)
    return data ? data.data : null
  },
  deleteTree (id) {
    let dataLocal = lodash.remove(state.dataArray, function (i) {
      return i.id === id
    })
    return dataLocal ? dataLocal[0] : null
  },
  deleteTreeItem (treeId, itemId) {
    let dataLocal = state.dataArray.find(i => i.id === treeId)
    let data = dataLocal.data
    if (lodash.isArray(data)) {
      this.deleteTreeItemInternal(data, itemId)
    } else if (data.children) {
      this.deleteTreeItemInternal(data.children, itemId)
    }
    lodash.assign(dataLocal, {operation: 'deleteTreeItem'})
  },
  deleteTreeItemInternal (data, itemId) {
    for (var index in data) {
      if (itemId === data[index].id) {
        data.splice(index, 1)
        return true
      } else if (data[index].children) {
        var flag = this.deleteTreeItemInternal(data[index].children, itemId)
        if (flag) {
          return flag
        }
      }
    }
  },
  addTreeItem (treeId, parentId, itemData) {
    let data = state.dataArray.find(i => i.id === treeId).data
    if (lodash.isArray(data)) {
      this.addTreeItemInternal(data, parentId, itemData)
    } else {
      if (data.id === parentId) {
        if (data.children) {
          data.children.push(itemData)
        } else {
          Vue.set(data, 'children', [itemData])
        }
      } else if (data.children) {
        this.addTreeItemInternal(data.children, parentId, itemData)
      }
    }
  },
  addTreeItemInternal (data, parentId, itemData) {
    for (var index in data) {
      if (parentId === data[index].id) {
        if (data[index].children) {
          data[index].children.push(itemData)
        } else {
          Vue.set(data[index], 'children', [itemData])
        }
        return true
      } else if (data[index].children) {
        var flag = this.addTreeItemInternal(data[index].children, parentId, itemData)
        if (flag) {
          return flag
        }
      }
    }
  },
  updateTreeItem (treeId, itemData) {
    let data = state.dataArray.find(i => i.id === treeId).data
    if (lodash.isArray(data)) {
      this.updateTreeItemInternal(data, itemData)
    } else {
      if (data.id === itemData.id) {
        data.title = itemData.title
      } else if (data.children) {
        this.updateTreeItemInternal(data.children, itemData)
      }
    }
  },
  updateTreeItemInternal (data, itemData) {
    for (var index in data) {
      if (itemData.id === data[index].id) {
        data[index].title = itemData.title
        return true
      } else if (data[index].children) {
        var flag = this.updateTreeItemInternal(data[index].children, itemData)
        if (flag) {
          return flag
        }
      }
    }
  }
}
export {
  state as default,
  types,
  utilfuns
}
