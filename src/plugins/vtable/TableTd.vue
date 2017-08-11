<template>
  <td @click="itemClick"><span v-show="!showEdit" v-html="dataFormated"/><span v-if="editable&&headerItem.editable"
                                                                               v-show="showEdit"><formElement
    :dataFromParent="dataChanged" :options="headerItem"/><button @click.stop="itemEdit(true)">确定</button><button
    @click.stop="itemEdit(false)">取消</button></span></td>
</template>
<script>
  import lodash from 'lodash'
  import Vue from 'vue'
  import formElement from '../formElement/FormElement.vue'
  export default {
    name: 'v-table-row',
    data () {
      return {
        dataChanged: {},
        showEdit: false,
        dataFormated: this.dataFormat(this.item)
      }
    },
    computed: {
      headerItem () {
        let returnTmp = lodash.cloneDeep(this.header[this.hasSn ? (this.tdKey + 1) : this.tdKey])
        if (this.item) {
          returnTmp.defaultValue = this.item
        }
        return returnTmp
      }
    },
    props: ['rowKey', 'item', 'tdKey', 'header', 'hasSn', 'actions', 'editable'],
    methods: {
      itemEdit (flag) {
        if (flag) {
          if (this.actions && this.actions.edit) {
            var returnData = this.actions.edit({key: this.rowKey, data: this.dataChanged, headerItem: this.headerItem})
            if (returnData !== false) {
              if (this.headerItem.type === 'file' || this.headerItem.type === 'image') {
                this.dataFormated = this.dataFormat(returnData)
              } else {
                this.dataFormated = this.dataFormat(this.headerItem.defaultValue)
              }
              this.showEdit = false
            }
          } else {
            this.dataFormated = this.dataFormat(this.headerItem.defaultValue)
            this.showEdit = false
          }
        } else {
          this.showEdit = false
        }
      },
      itemClick () {
        if (!this.showEdit && this.editable && this.headerItem.editable) {
          if (this.headerItem.type !== 'file' && this.headerItem.type !== 'image') {
            Vue.set(this.headerItem, 'defaultValue', this.item)
            Vue.set(this.headerItem, 'init', true)
          }
          this.showEdit = true
        }
      },
      close (e) {
        if (!this.$el.contains(e.target)) {
          this.showEdit = false
        }
      },
      dataFormat (item) {
        let headerItem = this.header[this.hasSn ? (this.tdKey + 1) : this.tdKey]
        if (headerItem && item !== undefined && item !== null) {
          switch (headerItem.type) {
            case 'date':
              var dateTmp = new Date(+item)
              return `${dateTmp.getFullYear()}-${('0' + (dateTmp.getMonth() + 1)).slice(-2)}-${('0' + dateTmp.getDate()).slice(-2)}`
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
      }
    },
    components: {formElement},
    watch: {
      item: function () {
        this.dataFormated = this.dataFormat(this.item)
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
