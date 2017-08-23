<template>
  <li class="tree-item">
    <p>
      <span v-if="iconClass" v-on:click="clickToggle" :class="iconClass"/>
      <router-link v-if="itemData.url" @click.native="treeClick" :to="itemData.url">{{itemData.title}}
      </router-link>
      <a v-else @click.prevent="treeClick">{{itemData.title}}</a>
    </p>
    <ul v-if="itemData.children" v-show="showChildren">
      <treeItem v-for="item in itemData.children" :itemData="item" v-on:click="clickTransfer" :key="item.id"/>
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
    props: ['itemData'],
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
      treeClick () {
        this.$emit('click', this.itemData.emitClickArgs ? this.itemData.emitClickArgs : null)
      },
      clickTransfer: function (args) {
        this.$emit('click', args)
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
