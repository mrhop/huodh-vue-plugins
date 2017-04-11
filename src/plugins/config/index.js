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
    Vue.prototype.$basePath = global.basePath ? global.basePath : ''
    Vue.prototype.$Vue = Vue
  }
}
