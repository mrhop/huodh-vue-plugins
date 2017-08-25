<template>
  <li class="tree-item">
    <p>
      <input :id="'tree-item-'+name+'-'+itemData.id" type="checkbox" :name="name" :value="itemData.id"
             v-model="selectedValue.selected"
             @click="treeClick">
      <span v-if="iconClass" v-on:click="clickToggle" :class="iconClass"/>
      <label :for="'tree-item-'+name+'-'+itemData.id">{{itemData.title}}</label>
    </p>
    <ul v-if="itemData.children" v-show="showChildren">
      <treeItem v-for="item in itemData.children" :itemData="item" :name="name"
                :selectedValue="selectedValue" v-on:click="clickTransfer" :key="item.id"/>
    </ul>
  </li>
</template>
<script>
  export default {
    name: 'treeItem',
    data () {
      return {
        iconClass: null,
        showChildren: false
      }
    },
    created: function () {
      this.initTreeItem()
    },
    props: ['itemData', 'name', 'selectedValue'],
    methods: {
      initTreeItem () {
        if (this.itemData.children) {
          this.iconClass = 'glyphicon glyphicon-folder-close'
        }
      },
      clickToggle (event) {
        this.showChildren = !this.showChildren
        if (this.showChildren) {
          this.iconClass = 'glyphicon glyphicon-folder-open'
        } else {
          this.iconClass = 'glyphicon glyphicon-folder-close'
        }
      },
      treeClick (event) {
        this.recursiveChildren(this.itemData, event.target.checked)
        this.$emit('click', event.target.checked)
      },
      recursiveChildren (itemData, flag) {
        if (itemData.children) {
          for (let key in itemData.children) {
            if (flag) {
              if (this.selectedValue.selected.indexOf(itemData.children[key].id) < 0) {
                this.selectedValue.selected.push(itemData.children[key].id)
                itemData.children[key].refresh = !itemData.children[key].refresh
              }
            } else {
              let index = this.selectedValue.selected.indexOf(itemData.children[key].id)
              if (index >= 0) {
                this.selectedValue.selected.splice(index, 1)
                itemData.children[key].refresh = !itemData.children[key].refresh
              }
            }
            this.recursiveChildren(itemData.children[key], flag)
          }
        }
      },
      judgeChildren (itemData) {
        let flag = false
        for (let key in itemData.children) {
          if (this.selectedValue.selected.indexOf(itemData.children[key].id) >= 0) {
            flag = true
            break
          }
        }
        return flag
      },
      clickTransfer: function (args) {
        if (args !== undefined) {
          if (args) {
            if (this.selectedValue.selected.indexOf(this.itemData.id) < 0) {
              this.selectedValue.selected.push(this.itemData.id)
              this.itemData.refresh = !this.itemData.refresh
              this.$emit('click', args)
              return
            }
          } else {
            if (!this.judgeChildren(this.itemData)) {
              let index = this.selectedValue.selected.indexOf(this.itemData.id)
              this.selectedValue.selected.splice(index, 1)
              this.itemData.refresh = !this.itemData.refresh
              this.$emit('click', args)
              return
            }
          }
        }
        this.$emit('click')
      }
    },
    watch: {
      itemData: {
        handler: function (val, oldVal) {
          this.$forceUpdate()
        },
        deep: true
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  @import "../../scss/import.scss";

  li.tree-item {
    > p {
      margin-bottom: 3px;
      cursor: pointer;
      a {
        display: inline-block;
      }
    }
    ul {
      padding-left: 30px;
      list-style: none;
      font-size: 15px;
      font-weight: bold;
    }
  }
</style>
