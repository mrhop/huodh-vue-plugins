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
      return
    } else {
      const {id, endpoint, httpType = 'get', types: {success_type, failure_type}, data = {}, params = {}, multipart = false} = callParameters
      var config = {
        url: endpoint,
        method: httpType.toLowerCase(),
        params,
        data
      }
      if (multipart) {
        const formData = new FormData()
        if (data) {
          for (var key in data) {
            if (!data.hasOwnProperty(key)) {
              continue
            }
            var obj = data[key]
            if (obj && typeof obj === 'object') {
              for (var subKey in obj) {
                if (obj[subKey] && typeof obj[subKey] === 'object') {
                  var files = obj[subKey]
                  if (files) {
                    for (var i = 0; i < files.length; i++) {
                      var file = files[i]
                      formData.append(key, file)
                    }
                  }
                } else {
                  formData.append(key, obj[subKey])
                }
              }
            } else {
              formData.append(key, obj)
            }
          }
        }
        config = {
          headers: {'Content-Type': 'multipart/form-data'},
          url: endpoint,
          method: httpType.toLowerCase(),
          params,
          data: formData
        }
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
