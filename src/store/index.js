/**
 * Created by Donghui Huo on 2017/3/28.
 */
import Vuex from 'vuex'
import table from '../plugins/vtable/store'
import form from '../plugins/vform/store'
import tree from '../plugins/tree/store'
import {default as defaultPlugins} from './plugins'
import lodash from 'lodash'
function generateStore ({additionalModules = {}, actions = {}, getters = {}, additionalPlugins = []} = {}) {
  return new Vuex.Store({
    actions,
    getters,
    modules: lodash.assign({
      // 此处应该是table。form，tree的结合
      table, form, tree
    }, additionalModules),
    plugins: defaultPlugins.concat(additionalPlugins)
  })
}
export {
  generateStore as default
}
