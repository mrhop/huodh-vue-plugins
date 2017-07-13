<template>
  <td @click="itemClick"><span v-show="!showEdit">{{dataFormated}}</span><span v-if="editable&&headerItem.editable"
                                                                               v-show="showEdit"><formElement
    :dataFromParent="dataChanged" :options="headerItem"/><button @click.stop="itemEdit(true)">确定</button><button
    @click.stop="itemEdit(false)">取消</button></span></td>
</template>
<script>
  import formElement from '../formElement/FormElement.vue'
  import Vue from 'vue'
  export default {
    name: 'v-table-row',
    data () {
      return {
        dataChanged: {},
        showEdit: false,
        itemLocal: this.item
      }
    },
    computed: {
      headerItem () {
        return this.header[this.hasSn ? (this.tdKey + 1) : this.tdKey]
      },
      dataFormated () {
        let headerItem = this.header[this.hasSn ? (this.tdKey + 1) : this.tdKey]
        if (headerItem) {
          switch (headerItem.type) {
            case 'date':
              if (this.itemLocal) {
                var dateTmp = new Date(+this.itemLocal)
                return `${dateTmp.getFullYear()}-${('0' + (dateTmp.getMonth() + 1)).slice(-2)}-${('0' + dateTmp.getDate()).slice(-2)}`
              } else {
                return ''
              }
            case 'file':
              if (this.itemLocal) {
                var returnFiles = ``
                for (let index in this.itemLocal) {
                  let fileName = this.itemLocal[index].replace(/^.*[/\\]+(.*)\??.*$/, '$1')
                  returnFiles += `<a href='${this.itemLocal[index]}' target="_blank">${fileName}</a>`
                }
                return returnFiles
              } else {
                return ''
              }
            case 'image':
              if (this.itemLocal) {
                var returnImages = ``
                for (let index in this.itemLocal) {
                  let fileName = this.itemLocal[index].replace(/^.*[/\\]+(.*)\??.*$/, '$1')
                  returnImages += `<a href='${this.itemLocal[index]}' target="_blank">${fileName}<img src='${this.itemLocal[index]}'/></a>`
                }
                return returnImages
              } else {
                return ''
              }
            default:
              return this.itemLocal
          }
        }
        return this.itemLocal
      }
    },
    props: ['rowKey', 'item', 'tdKey', 'header', 'hasSn', 'actions', 'editable'],
    methods: {
      itemEdit (flag) {
        if (flag) {
          if (this.actions && this.actions.edit) {
            var returnData = this.actions.edit({key: this.rowKey, data: this.dataChanged})
            if (returnData !== false) {
              this.itemLocal = this.headerItem.defaultValue
              delete this.headerItem.defaultValue
              this.showEdit = false
            }
          } else {
            this.itemLocal = this.headerItem.defaultValue
            delete this.headerItem.defaultValue
            this.showEdit = false
          }
        } else {
          delete this.headerItem.defaultValue
          this.showEdit = false
        }
      },
      itemClick () {
        if (!this.showEdit && this.editable && this.headerItem.editable) {
          Vue.set(this.headerItem, 'defaultValue', this.itemLocal)
          this.showEdit = true
        }
      },
      close (e) {
        if (!this.$el.contains(e.target)) {
          this.showEdit = false
        }
      }
    },
    components: {formElement},
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
