<template>
  <li class="tree-item">
    <p @mouseenter="showEditable = true" @mouseleave="showEditable = false">
      <span v-if="iconClass" :class="iconClass" @click.prevent="clickToggle"/>
      <router-link v-if="itemData.url" @click.native="treeClick" :to="itemData.url"><span class="item-text">{{itemData.title}}</span>
      </router-link>
      <a v-else @click.prevent="treeClick"><span class="item-text">{{itemData.title}}</span></a>
      <transition name="fade">
        <span v-if="editable" class="editable-span" v-show="showEditable"><a
          v-if="actionUrls&&actionUrls.addUrl||actions&&actions.add"
          class="glyphicon glyphicon-plus"
          @click.prevent.stop="addCurrent"/><a
          v-if="actionUrls&&actionUrls.editUrl||actions&&actions.edit" class="glyphicon glyphicon-edit"
          @click.prevent.stop="editCurrent"/><a
          v-if="(itemData.deletable||itemData.deletable===undefined)&&(actionUrls&&actionUrls.deleteUrl||actions&&actions.delete)"
          class="glyphicon glyphicon-trash"
          @click.prevent.stop="deleteCurrent"/></span>
      </transition>
    </p>
    <ul v-if="itemData.children&&itemData.children.length" v-show="showChildren">
      <treeItem v-for="item in itemData.children" :itemData="item"
                v-on:click="clickTransfer"
                :key="item.id" :editable="editable"
                :actionUrls="actionUrls" :actions="actions" v-on:addItem="addItem" v-on:editItem="editItem"
                v-on:deleteItem="deleteItem"/>
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
    props: ['itemData', 'editable', 'actionUrls', 'actions'],
    methods: {
      initTreeItem () {
        if (this.editable && this.itemData.children) {
          this.iconClass = 'icon glyphicon glyphicon-folder-close'
        } else {
          this.iconClass = this.itemData.iconClass ? 'icon ' + this.itemData.iconClass : null
        }
      },
      clickToggle () {
        if (this.itemData.children) {
          this.showChildren = !this.showChildren
          if (this.editable) {
            if (this.showChildren) {
              this.iconClass = 'icon glyphicon glyphicon-folder-open'
            } else {
              this.iconClass = 'icon glyphicon glyphicon-folder-close'
            }
          }
        }
      },
      treeClick () {
        if (this.itemData.emitClick !== false) {
          this.$emit('click', this.itemData.emitClickArgs ? this.itemData.emitClickArgs : null)
        }
        this.clickToggle()
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
      cursor: pointer;
      margin-bottom: 3px;
      .icon {
        margin-right: 3px;
      }
    }
    ul {
      padding-left: 30px;
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
