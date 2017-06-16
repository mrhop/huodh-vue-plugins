/**
 * Created by Donghui Huo on 2017/3/29.
 */
import {utilfuns} from './state'
export default{
  treeData: (state, getters) => (id) => {
    let data = utilfuns.getTree(id)
    return data
  }
}
