<template>
  <li class="tree-item">
    <p @mouseenter="showEditable = true" @mouseleave="showEditable = false">
      <a v-if="itemData.children&&itemData.children.length" v-on:click="clickToggle"><span v-if="!editable&&iconClass"
                                                                                           :class="iconClass"/><span
        v-if="editable&&!showChildren" class="glyphicon glyphicon-folder-close"/><span
        v-if="editable&&showChildren" class="glyphicon glyphicon-folder-open"/><span>{{itemData.title}}</span></a>
      <router-link v-else-if="itemData.url" :to="itemData.url"><span v-if="iconClass" :class="iconClass"/>{{itemData.title}}
      </router-link>
      <a v-else-if="itemData.emitClick" @click.prevent="treeClick"><span v-if="iconClass"
                                                                         :class="iconClass"/>{{itemData.title}}</a>
      <span v-else><span v-if="iconClass" :class="iconClass"/>{{itemData.title}}</span>
      <transition name="fade">
        <span v-if="editable" class="editable-span" v-show="showEditable"><a v-if="actionUrls&&actionUrls.addUrl"
                                                                             class="glyphicon glyphicon-plus"
                                                                             @click.prevent="addCurrent"/><a
          v-if="actionUrls&&actionUrls.editUrl" class="glyphicon glyphicon-edit" @click.prevent="editCurrent"/><a
          v-if="actionUrls&&actionUrls.deleteUrl" class="glyphicon glyphicon-trash"
          @click.prevent="deleteCurrent"/></span>
      </transition>
    </p>
    <ul v-if="itemData.children&&itemData.children.length" v-show="showChildren">
      <treeItem v-for="item in itemData.children" :itemData="item"
                v-on:click="clickTransfer"
                :key="item.id" :editable="editable"
                :actionUrls="actionUrls" v-on:addItem="addItem" v-on:editItem="editItem" v-on:deleteItem="deleteItem"/>
    </ul>
  </li>
</template>
<script>
  export default {
    name: 'treeItem',
    data () {
      return {
        iconClass: null,
        showChildren: false,
        showEditable: false
      }
    },
    created: function () {
      this.initTreeItem()
    },
    props: ['itemData', 'editable', 'actionUrls'],
    methods: {
      initTreeItem () {
        if (this.itemData) {
          this.iconClass = this.itemData.iconClass
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
      },
      addCurrent: function () {
        this.$emit('addItem', this.itemData.id)
      },
      addItem: function (id) {
        this.$emit('addItem', id)
      },
      editCurrent: function () {
        this.$emit('editItem', this.itemData)
      },
      editItem: function (itemData) {
        this.$emit('editItem', itemData)
      },
      deleteCurrent: function () {
        this.$emit('deleteItem', this.itemData.id)
      },
      deleteItem: function (id) {
        this.$emit('deleteItem', id)
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  @import "../../scss/import.scss";

  li.tree-item {
    > p {
      margin-bottom: 3px;
      .glyphicon {
        margin-right: 3px;
      }
      a {
        cursor: pointer;
      }
    }
    ul {
      padding-left: 20px;
      list-style: none;
      font-size: 15px;
      font-weight: bold;
    }
    .fade-enter, .fade-leave-active {
      opacity: 0;
      transform: scale3d(0, 0, 0);
    }
    .fade-enter-active, .fade-leave-active {
      transition: all ease .1s;
    }
  }
</style>
