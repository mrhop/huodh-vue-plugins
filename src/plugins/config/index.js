/**
 * Created by Donghui Huo on 2017/3/24.
 */
import Modal from '../modal/Modal.vue'

export default {
  install (Vue, options) {
    Vue.cacheData = {}
    Vue.createModal = function (options) {
      if (!document.getElementById('modal-wrapper')) {
        var node = document.createElement('div')
        node.setAttribute('id', 'modal-wrapper')
        document.body.appendChild(node)
      }
      let Component = Vue.cacheData.Modal
      if (!Component) {
        Vue.cacheData.Modal = Vue.extend(Modal)
      }
      Component = Vue.cacheData.Modal
      new Component(options).$mount('#modal-wrapper')
    }
    Vue.generateFormData = function (data) {
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
      return formData
    }
    Vue.prototype.$basePath = global.basePath ? global.basePath : ''
    Vue.prototype.$Vue = Vue
  }
}
