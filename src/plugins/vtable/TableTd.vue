<template>
  <td @click="itemClick"><span v-show="!showEdit" v-html="dataFormated"/><span
    v-if="editable&&headerItem.editable&&!headerItem.literal"
    v-show="showEdit"><formElement
    :dataFromParent="dataChanged" :options="headerItem"/><button @click.stop="itemEdit(true)">确定</button><button
    @click.stop="itemEdit(false)">取消</button></span></td>
</template>
<script>
  import axios from 'axios'
  import lodash from 'lodash'
  import Vue from 'vue'
  import formElement from '../formElement/FormElement.vue'
  export default {
    name: 'v-table-row',
    data () {
      return {
        itemLocal: this.item,
        dataChanged: {},
        showEdit: false,
        dataFormated: this.dataFormat(this.item),
        headerItem: this.getHeaderItem()
      }
    },
    props: ['rowKey', 'item', 'tdKey', 'header', 'hasSn', 'actions', 'editable'],
    methods: {
      itemEdit (flag) {
        if (flag) {
          if (!this.headerItem.validatedMsg) {
            if (this.actions && this.actions.edit) {
              var returnData = this.actions.edit({
                key: this.rowKey,
                data: this.dataChanged,
                headerItem: this.headerItem
              })
              if (returnData !== false) {
                if (returnData instanceof Object && returnData.axiosConfig) {
                  let _this = this
                  axios.request(returnData.axiosConfig).then(function (response) {
                    if (response.data && response.data.error) {
                      console.log(response.data.error + 'from table td editing')
                      Vue.set(_this.headerItem, 'defaultValue', this.itemLocal)
                    } else if (response.data && response.data.success) {
                      if (_this.headerItem.type === 'file' || _this.headerItem.type === 'image') {
                        _this.itemLocal = response.data.success.data
                      } else {
                        _this.itemLocal = _this.headerItem.defaultValue
                      }
                    }
                    _this.showEdit = false
                    _this.$emit('editedColumn', _this.itemLocal, _this.tdKey)
                  }).catch(function (error) {
                    console.log(error + 'from table td editing')
                    Vue.set(_this.headerItem, 'defaultValue', this.itemLocal)
                    _this.showEdit = false
                  })
                } else {
                  if (this.headerItem.type === 'file' || this.headerItem.type === 'image') {
                    this.itemLocal = returnData
                  } else {
                    this.itemLocal = this.headerItem.defaultValue
                  }
                  this.showEdit = false
                }
              } else {
                Vue.set(this.headerItem, 'defaultValue', this.itemLocal)
                this.showEdit = false
              }
            } else {
              this.itemLocal = this.headerItem.defaultValue
              this.showEdit = false
            }
          }
        } else {
          Vue.set(this.headerItem, 'defaultValue', this.itemLocal)
          this.showEdit = false
        }
      },
      itemClick () {
        if (!this.showEdit && this.editable && this.headerItem.editable) {
          if (this.headerItem.type !== 'file' && this.headerItem.type !== 'image') {
          }
          this.showEdit = true
        }
      },
      close (e) {
        if (!this.$el.contains(e.target) && this.showEdit) {
          this.showEdit = false
          Vue.set(this.headerItem, 'defaultValue', this.itemLocal)
        }
      },
      dataFormat (item) {
        let headerItem = this.header[this.hasSn ? (this.tdKey + 1) : this.tdKey]
        if (headerItem && item !== undefined && item !== null && !item.literal) {
          switch (headerItem.type) {
            case 'date':
              let dateTmp = new Date(+item)
              return `${dateTmp.getFullYear()}-${('0' + (dateTmp.getMonth() + 1)).slice(-2)}-${('0' + dateTmp.getDate()).slice(-2)}`
            case 'datetime':
              let dateTimeTmp = new Date(+item)
              return `${dateTimeTmp.getFullYear()}-${('0' + (dateTimeTmp.getMonth() + 1)).slice(-2)}-${('0' + dateTimeTmp.getDate()).slice(-2)} ${('0' + dateTimeTmp.getHours()).slice(-2)}:${('0' + dateTimeTmp.getMinutes()).slice(-2)}:${('0' + dateTimeTmp.getSeconds()).slice(-2)}`
            case 'file':
              var returnFiles = ``
              if (item instanceof Array) {
                for (let index in item) {
                  let fileName = item[index].replace(/^.*[/\\]+(.*)\??.*$/, '$1')
                  returnFiles += `<a href='${item[index]}' target="_blank">${fileName}</a>`
                }
              } else {
                let fileName = item.replace(/^.*[/\\]+(.*)\??.*$/, '$1')
                returnFiles += `<a href='${item}' target="_blank">${fileName}</a>`
              }
              return returnFiles
            case 'image':
              var returnImages = ``
              if (item instanceof Array) {
                for (let index in item) {
                  let fileName = item[index].replace(/^.*[/\\]+(.*)\??.*$/, '$1')
                  returnImages += `<a href='${item[index]}' target="_blank">${fileName}<img src='${item[index]}'/></a>`
                }
              } else {
                let fileName = item.replace(/^.*[/\\]+(.*)\??.*$/, '$1')
                returnImages += `<a href='${item}' target="_blank">${fileName}<img src='${item}'/></a>`
              }
              return returnImages
            case 'checkbox':
              if (headerItem.items) {
                var itemTemp = []
                for (var index in headerItem.items) {
                  if (item.indexOf(headerItem.items[index].value) > -1) {
                    itemTemp.push(headerItem.items[index].label)
                  }
                }
                return lodash.flatten(itemTemp)
              } else {
                return lodash.flatten(item)
              }
            case 'select':
            case 'radio':
              if (headerItem.items) {
                for (var index1 in headerItem.items) {
                  if (item === headerItem.items[index1].value) {
                    return headerItem.items[index1].label
                  }
                }
                return item
              } else {
                return item
              }
            default:
              return item
          }
        }
        return item
      },
      getHeaderItem () {
        let returnTmp = lodash.cloneDeep(this.header[this.hasSn ? (this.tdKey + 1) : this.tdKey])
        if (this.item) {
          Vue.set(returnTmp, 'defaultValue', this.item)
        }
        return returnTmp
      }
    },
    components: {formElement},
    watch: {
      item: function () {
        this.itemLocal = this.item
        this.headerItem.defaultValue = this.item
        this.headerItem.init = true
        this.dataFormated = this.dataFormat(this.itemLocal)
      }
    },
    mounted () {
      this.$nextTick(function () {
        window.addEventListener('click', this.close)
      })
    },
    beforeDestroy () {
      window.removeEventListener('click', this.close)
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  @import "../../scss/import.scss";

  td {
    position: relative;
    border-bottom: 1px solid #ccc;
    padding: 2px;
    a {
      display: block;
      margin-bottom: 5px;
      img {
        display: block;
        visibility: hidden;
        height: 1px;
        @include transition(all 400ms)
      }
      &:hover {
        img {
          display: block;
          height: 50px;
          visibility: visible;
        }
      }
    }
    &.td-actions {
      text-align: right;
      a {
        margin-right: 5px;
      }
    }
  }
</style>
