/**
 * Created by Donghui Huo on 2017/3/28.
 */
import axios from 'axios'
global.CALL_SERVER_PLUGIN = Symbol('CALL_SERVER_PLUGIN')
// 和服务器端的交互
const defaultCallPlugin = store => {
  store.subscribe(({type, payload}, state) => {
    // 此处不做state的更改，
    const callParameters = payload[global.CALL_SERVER_PLUGIN]
    if (!callParameters) {
      // 非前后台数据交互action
      console.log('yes, you jump out')
      return
    } else {
      console.log('yes, you are here1')
      const {id, endpoint, httpType = 'get', types: {success_type, failure_type}, data = {}, params = {}} = callParameters
      var config = {
        url: endpoint,
        method: httpType.toLowerCase(),
        params,
        data
      }
      axios.request(config).then(function (response) {
        store.commit(success_type, {id, data: response.data, callParameters})
      }).catch(function (error) {
        store.commit(failure_type, {id, error, callParameters})
      })
    }
  })
}
const plugins = [defaultCallPlugin]
export {
  plugins as default
}
