<template>
  <div class="tree-wrapper" v-if="treeDataLocal">
    <ul v-if="isArray">
      <treeItem v-for="item in treeDataLocal" :itemData="item" :key="item.id"/>
    </ul>
    <ul v-else-if="treeDataLocal.title">
      <treeItem :itemData="treeDataLocal"/>
    </ul>
  </div>
</template>
<script>
  import axios from 'axios'
  import lodash from 'lodash'
  import treeItem from './TreeItem.vue'
  export default {
    name: 'tree',
    data () {
      return {
        treeDataLocal: {},
        isArray: false
      }
    },
    watch: {
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
    props: ['treeData'],
    methods: {
      getTreeData: function () {
        var vm = this
        axios.get(this.treeData)
          .then(function (response) {
            vm.treeDataLocal = response.data
          })
          .catch(function (error) {
            console.log('error' + error)
          })
      }
    },
    components: {
      treeItem
    },
    created: function () {
      if (this.treeData && typeof this.treeData === 'string') {
        this.getTreeData()
      } else {
        this.treeDataLocal = this.treeData
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
