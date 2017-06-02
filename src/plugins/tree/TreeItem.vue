<template>
  <li class="tree-item">
    <a v-if="children" v-on:click="clickToggle"><span v-if="iconClass" :class="iconClass"/><span v-if="children">{{title}}</span></a>
    <router-link v-else-if="url" :to="url"><span v-if="iconClass" :class="iconClass"/>{{title}}</router-link>
    <a v-else-if="itemData.emitClick" @click.prevent="treeClick"><span v-if="iconClass"
                                                                       :class="iconClass"/>{{title}}</a>
    <p v-else><span v-if="iconClass" :class="iconClass"/>{{title}}</p>
    <ul v-if="children" v-show="showChildren">
      <treeItem v-for="item in children" :itemData="item" v-on:click="clickTransfer" :key="item.id"/>
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
        showChildren: false,
        dataLocal: null
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
          this.dataLocal = this.itemData.data
          if (!this.itemData.children) {
            this.url = this.itemData.url
            /* eslint no-eval: 0 */
          } else {
            this.children = this.itemData.children
          }
        }
      },
      clickToggle (event) {
        this.showChildren = !this.showChildren
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
    > a {
      display: block;
      cursor: pointer;
      margin-bottom: 3px;
    }
    > p {
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
