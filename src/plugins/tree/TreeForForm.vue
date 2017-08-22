<template>
  <div class="tree-wrapper" v-if="treeDataLocal">
    <ul v-if="isArray">
      <treeItemForForm v-on:click="clickTransfer" v-for="item in treeDataLocal" :itemData="item" :key="item.id"/>
    </ul>
    <ul v-else-if="treeDataLocal.title">
      <treeItemForForm v-on:click="clickTransfer" :itemData="treeDataLocal"/>
    </ul>
  </div>
</template>
<script>
  // 首先尝试将delete走通，然后是add和edit,最后考虑数据的处理，先考虑完成modal，然后考虑action，state，最终有可能需要将tree data也处理进入state
  import axios from 'axios'
  import lodash from 'lodash'
  import treeItemForForm from './TreeItemForForm.vue'
  export default {
    name: 'tree',
    data () {
      return {
        id: new Date().getTime() + Math.ceil(Math.random() * 100000),
        currentItemId: null,
        treeDataLocal: {},
        isArray: false
      }
    },
    watch: {
      treeData: function (val, oldVal) {
        this.formatTreeData(val)
      },
      treeDataLocal: function () {
        if (this.treeDataLocal) {
          if (lodash.isArray(this.treeDataLocal)) {
            this.isArray = true
            return
          }
        }
        this.isArray = false
      }
    },
    props: {
      treeData: {},
      editable: {
        default: false
      },
      actions: {
        default: function () {
          return {}
        }
      }
    },
    methods: {
      getTreeData: function (treeData) {
        var vm = this
        axios.get(treeData)
          .then(function (response) {
            vm.treeDataLocal = response.data
          })
          .catch(function (error) {
            console.log('error' + error)
          })
      },
      clickTransfer: function (args) {
        this.$emit('click', args)
      },
      formatTreeData (treeData) {
        if (treeData) {
          if (typeof treeData === 'string') {
            this.getTreeData(treeData)
          } else {
            this.treeDataLocal = treeData
          }
        } else if (this.actions && this.actions.tree) {
          this.treeDataLocal = this.actions.tree()
        }
      }
    },
    components: {
      treeItemForForm
    },
    created: function () {
      this.formatTreeData(this.treeData)
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
