import modal from './plugins/modal/Modal.vue'
import modalTpl from './plugins/modalTpl/ModalTpl.vue'
import panel from './plugins/panel/Panel.vue'
import tab from './plugins/tab/Tab.vue'
import tree from './plugins/tree/Tree.vue'
import vform from './plugins/vform/VForm.vue'
import vtable from './plugins/vtable/VTable.vue'
import datePicker from './plugins/datePicker/DatePicker.vue'
import generateStore from './store/index'
import config from './plugins/config'

export default {
  generateStore,
  config,
  modal,
  modalTpl,
  panel,
  tab,
  tree,
  vform,
  vtable,
  datePicker
}
