import modal from './plugins/modal/Modal.vue'
import panel from './plugins/panel/Panel.vue'
import tab from './plugins/tab/Tab.vue'
import tree from './plugins/tree/Tree.vue'
import vform from './plugins/vform/VForm.vue'
import vtable from './plugins/vtable/VTable.vue'
import generateStore from './store/index'
import config from './plugins/config'

export default {
  generateStore,
  config,
  modal,
  panel,
  tab,
  tree,
  vform,
  vtable
}
