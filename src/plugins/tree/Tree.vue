<template>
  <div class="tree-wrapper" v-if="treeDataLocal">
    <ul v-if="isArray">
      <treeItem v-on:click="clickTransfer" v-for="item in treeDataLocal" :itemData="item" :key="item.id"
                @addItem="addItemForm" @editItem="editItemForm" @deleteItem="doDeleteWarning" :editable="editable"
                :actionUrls="actionUrls"/>
    </ul>
    <ul v-else-if="treeDataLocal.title">
      <treeItem v-on:click="clickTransfer" :itemData="treeDataLocal" @addItem="addItemForm" @editItem="editItemForm"
                @deleteItem="doDeleteWarning" :editable="editable"
                :actionUrls="actionUrls"/>
    </ul>
    <modalTpl ref="modalAdd" v-if="editable&&actionUrls&&actionUrls.addUrl" :showFooter="false" type="primary"
              :trigger="addModalTrigger">
      <span slot="header">添加子节点</span>
      <vform slot="body" :formRule="addFormRule" :id="'addTreeItem'+id" :actionUrls="addFormUrls"
             v-on:afterSaved="addItem"></vform>
    </modalTpl>
    <modalTpl ref="modalEdit" v-if="editable&&actionUrls&&actionUrls.editUrl" :showFooter="false" type="primary"
              :trigger="editModalTrigger">
      <span slot="header">更新节点</span>
      <vform slot="body" :formRule="editFormRule" :id="'editTreeItem'+id" :actionUrls="editFormUrls"
             v-on:afterSaved="editItem"></vform>
    </modalTpl>
    <modalTpl v-if="editable&&actionUrls&&actionUrls.deleteUrl" :confirmModal="true" type="danger"
              :trigger="deleteModalTrigger" v-on:confirmEvent="deleteItem">
      <span slot="header">删除节点</span>
      <div slot="body">删除节点，同时也会删除其下属的子节点，确认要删除吗？</div>
    </modalTpl>
  </div>
</template>
<script>
  // 首先尝试将delete走通，然后是add和edit,最后考虑数据的处理，先考虑完成modal，然后考虑action，state，最终有可能需要将tree data也处理进入state
  import lodash from 'lodash'
  import {mapActions} from 'vuex'
  import treeItem from './TreeItem.vue'
  import modalTpl from '../modalTpl/ModalTpl.vue'
  import vform from '../vform/VForm.vue'
  export default {
    name: 'tree',
    data () {
      return {
        id: new Date().getTime() + Math.ceil(Math.random() * 100000),
        currentItemId: null,
        addFormUrls: this.editable && this.actionUrls && this.actionUrls.addUrl && {
          saveUrl: this.actionUrls.addUrl
        },
        addFormRule: this.editable && this.actionUrls && this.actionUrls.addUrl && {
          rules: {
            items: [
              {
                name: 'title',
                label: '标题',
                type: 'text',
                validate: [{
                  errorMsg: '不能为空',
                  regex: '^\\S+$'
                }],
                placeholder: '标题',
                locked: false
              },
              {
                name: 'parent',
                type: 'hidden',
                defaultValue: -1
              }
            ],
            action: {
              save: {
                label: '保存'
              }
            }
          }
        },
        addModalTrigger: false,
        editFormUrls: this.editable && this.actionUrls && this.actionUrls.editUrl && {
          saveUrl: this.actionUrls.editUrl
        },
        editFormRule: this.editable && this.actionUrls && this.actionUrls.editUrl && {
          rules: {
            items: [
              {
                name: 'title',
                label: '标题',
                type: 'text',
                validate: [{
                  errorMsg: '不能为空',
                  regex: '^\\S+$'
                }],
                placeholder: '标题',
                locked: false
              },
              {
                name: 'id',
                type: 'hidden',
                defaultValue: -1
              }
            ],
            action: {
              save: {
                label: '保存'
              }
            }
          }
        },
        editModalTrigger: false,
        deleteModalTrigger: false
      }
    },
    computed: {
      treeDataLocal () {
        return this.$store.getters.treeData(this.id)
      },
      isArray () {
        if (this.treeDataLocal) {
          if (lodash.isArray(this.treeDataLocal)) {
            this.isArray = true
            return true
          }
        }
        return false
      }
    },
    props: {
      treeData: {},
      editable: {
        default: false
      },
      actionUrls: {
        default: function () {
          return {}
        }
      }
    },
    methods: lodash.assignIn({
      addItemForm: function (id) {
        this.currentItemId = id
        this.addFormRule.rules.items[1].defaultValue = id
        this.addModalTrigger = !this.addModalTrigger
      },
      addItem: function (data) {
        console.log('do add')
        this.treeItemAdd({id: this.id, parentId: this.currentItemId, itemData: {id: data.id, title: data.title}})
        this.$refs.modalAdd.closeModal()
      },
      editItemForm: function (item) {
        this.currentItemId = item.id
        this.editFormRule.rules.items[0].defaultValue = item.title
        this.editFormRule.rules.items[1].defaultValue = item.id
        // do edit sth ,need to init the form data
        this.editModalTrigger = !this.editModalTrigger
      },
      editItem: function (data) {
        console.log('do edit')
        this.treeItemUpdate({id: this.id, itemData: {id: this.currentItemId, title: data.title}})
        this.$refs.modalEdit.closeModal()
      },
      doDeleteWarning: function (id) {
        this.currentItemId = id
        this.deleteModalTrigger = !this.deleteModalTrigger
      },
      deleteItem: function () {
        // 执行state的处理
        this.treeItemDelete({id: this.id, deleteUrl: this.actionUrls.deleteUrl, itemId: this.currentItemId})
      },
      clickTransfer: function (args) {
        this.$emit('click', args)
      }
    }, mapActions([
      'treeInit',
      'treeDelete',
      'treeItemDelete',
      'treeItemAdd',
      'treeItemUpdate'
    ])),
    components: {
      treeItem, modalTpl, vform
    },
    created: function () {
      if (this.treeData && typeof this.treeData === 'string') {
        this.treeInit({id: this.id, initUrl: this.treeData})
      } else {
        this.treeInit({id: this.id, treeData: this.treeData})
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  @import "../../scss/import.scss";

  .tree-wrapper {
    padding-top: 15px;
    color: $brand-primary;
    ul {
      padding-left: 20px;
      list-style: none;
      font-size: 15px;
      font-weight: bold;
    }
  }
</style>
