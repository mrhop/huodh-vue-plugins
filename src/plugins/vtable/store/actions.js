/**
 * Created by Donghui Huo on 2017/3/29.
 */
import {types, utilfuns} from './state'
// import Vue from 'vue'
export default {
  tableInit: function ({commit, state}, {id, listUrl, listAction}) {
    if (listUrl) {
      commit(types.TABLE_REQUEST, {
        [global.CALL_SERVER_PLUGIN]: {
          id,
          httpType: 'post',
          endpoint: listUrl,
          data: {pager: state.default.data.pager, init: true},
          types: {success_type: types.TABLE_SUCCESS, failure_type: types.TABLE_FAILURE}
        }
      })
    } else if (listAction) {
      var data = listAction({pager: state.default.data.pager, init: true})
      if (data) {
        commit(types.TABLE_SUCCESS, {id, data: data, callParameters: {pager: state.default.data.pager, init: true}})
      } else {
        commit(types.TABLE_FAILURE, {id, error: 'error from outside action'})
      }
    }
  },
  tableRefreshList: function ({commit, state}, {id, listUrl, listAction}) {
    console.log('table - refresh')
    var dataLocal = utilfuns.getTable(id)
    if (dataLocal) {
      if (listUrl) {
        commit(types.TABLE_REQUEST, {
          [global.CALL_SERVER_PLUGIN]: {
            id,
            httpType: 'post',
            endpoint: listUrl,
            data: {pager: dataLocal.data.pager, filters: dataLocal.data.filters, sorts: dataLocal.data.sorts},
            types: {success_type: types.TABLE_SUCCESS, failure_type: types.TABLE_FAILURE}
          }
        })
      } else if (listAction) {
        var data = listAction({
          pager: dataLocal.data.pager,
          filters: dataLocal.data.filters,
          sorts: dataLocal.data.sorts
        })
        if (data) {
          commit(types.TABLE_SUCCESS, {id, data: data, callParameters: {}})
        } else {
          commit(types.TABLE_FAILURE, {id, error: 'error from outside action'})
        }
      }
    } else {
      this.init({commit, state}, {id, listUrl, listAction})
    }
  },
  tableGetList: function ({commit, state}, {id, listUrl, listAction, pager, filters, sorts}) {
    // DO GET list 操作，根据分页，filters等,此时不需要 rule，仅需要返回数据即可
    console.log('table - get list')
    if (listUrl) {
      commit(types.TABLE_REQUEST, {
        [global.CALL_SERVER_PLUGIN]: {
          id,
          httpType: 'post',
          endpoint: listUrl,
          data: {pager, filters, sorts},
          types: {success_type: types.TABLE_SUCCESS, failure_type: types.TABLE_FAILURE}
        }
      })
    } else if (listAction) {
      var data = listAction({pager, filters, sorts})
      if (data) {
        commit(types.TABLE_SUCCESS, {id, data: data, callParameters: {}})
      } else {
        commit(types.TABLE_FAILURE, {id, error: 'error from outside action'})
      }
    }
  },
  tableDeleteRow: function ({commit, state}, {id, key, deleteUrl, deleteAction}) {
    // DO GET list 操作，根据分页，filters等,此时不需要 rule，仅需要返回数据即可
    console.log('table - delete row')
    if (deleteUrl) {
      commit(types.TABLE_DELETE_REQUEST, {
        [global.CALL_SERVER_PLUGIN]: {
          id,
          httpType: 'get',
          endpoint: deleteUrl,
          params: {key},
          types: {success_type: types.TABLE_DELETE_SUCCESS, failure_type: types.TABLE_DELETE_FAILURE}
        }
      })
    } else if (deleteAction) {
      var data = deleteAction({key})
      if (data === false) {
        commit(types.TABLE_DELETE_FAILURE, {id, error: 'error from outside action'})
      } else {
        commit(types.TABLE_DELETE_SUCCESS, {
          id,
          data: data,
          callParameters: {id, key, deleteUrl, deleteAction}
        })
      }
    }
  },
  clearTable: function ({commit}, {id}) {
    commit(types.CLEAR_TABLE, {id})
  }
}
