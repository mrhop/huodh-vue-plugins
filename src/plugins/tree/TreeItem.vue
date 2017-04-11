<template>
  <li class="tree-item">
    <a v-if="children" v-on:click="clickToggle"><span v-if="iconClass" :class="iconClass"/><span v-if="children">{{title}}</span></a>
    <router-link v-else :to="url"><span v-if="iconClass" :class="iconClass"/>{{title}}</router-link>
    <ul v-if="children" v-show="showChildren">
      <treeItem v-for="item in children" :itemData="item" :key="item.id"/>
    </ul>
  </li>
</template>
<script>
  export default {
    name: 'treeItem',
    data () {
      return {
        title: null,
        url: null,
        children: null,
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
        if (this.itemData) {
          this.title = this.itemData.title
          this.iconClass = this.itemData.iconClass
          if (!this.itemData.children) {
            this.url = this.itemData.url
          } else {
            this.children = this.itemData.children
          }
        }
      },
      clickToggle (event) {
        this.showChildren = !this.showChildren
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  @import "../../scss/import.scss";

  li.tree-item {
    > a {
      display: block;
      cursor: pointer;
      margin-bottom: 3px;
    }
    ul {
      padding-left: 20px;
      list-style: none;
      font-size: 15px;
      font-weight: bold;
    }
  }

</style>
