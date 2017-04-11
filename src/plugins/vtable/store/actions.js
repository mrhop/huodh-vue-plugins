/**
 * Created by Donghui Huo on 2017/3/29.
 */
import {types, utilfuns} from './state'
export default {
  tableInit: function ({commit, state}, {id, listUrl}) {
    console.log('table - get')
    commit(types.TABLE_REQUEST, {
      [global.CALL_SERVER_PLUGIN]: {
        id,
        httpType: 'post',
        endpoint: listUrl,
        data: {pager: state.default.data.pager, init: true},
        types: {success_type: types.TABLE_SUCCESS, failure_type: types.TABLE_FAILURE}
      }
    })
  },
  tableRefreshList: function ({commit, state}, {id, listUrl}) {
    console.log('table - refresh')
    var dataLocal = utilfuns.getTable(id)
    if (dataLocal) {
      commit(types.TABLE_REQUEST, {
        [global.CALL_SERVER_PLUGIN]: {
          id,
          httpType: 'post',
          endpoint: listUrl,
          data: {pager: dataLocal.data.pager, filters: dataLocal.data.filters},
          types: {success_type: types.TABLE_SUCCESS, failure_type: types.TABLE_FAILURE}
        }
      })
    } else {
      this.init({commit, state}, {id, listUrl})
    }
  },
  tableGetList: function ({commit, state}, {id, listUrl, pager, filters}) {
    // DO GET list 操作，根据分页，filters等,此时不需要 rule，仅需要返回数据即可
    console.log('table - get list')
    commit(types.TABLE_REQUEST, {
      [global.CALL_SERVER_PLUGIN]: {
        id,
        httpType: 'post',
        endpoint: listUrl,
        data: {pager, filters},
        types: {success_type: types.TABLE_SUCCESS, failure_type: types.TABLE_FAILURE}
      }
    })
  },
  tableDeleteRow: function ({commit, state}, {id, key, deleteUrl}) {
    // DO GET list 操作，根据分页，filters等,此时不需要 rule，仅需要返回数据即可
    console.log('table - delete row')
    commit(types.TABLE_DELETE_REQUEST, {
      [global.CALL_SERVER_PLUGIN]: {
        id,
        httpType: 'get',
        endpoint: deleteUrl,
        params: {key},
        types: {success_type: types.TABLE_DELETE_SUCCESS, failure_type: types.TABLE_DELETE_FAILURE}
      }
    })
  },
  clearTable: function ({commit}, {id}) {
    commit(types.CLEAR_TABLE, {id})
  }
}
