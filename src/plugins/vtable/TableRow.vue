<template>
  <tr>
    <th v-if="hasSn">
      <router-link v-if="action&&action.detail" :to="{path:actionUrls.detailUrl,query:{key:row.key}}">{{rowNum}}
      </router-link>
      <span v-else>{{rowNum}}</span>
    </th>
    <!--<td v-for="(item,key) in row.value" :key="key" v-html="itemFormat(item,key)"></td>-->
    <tableTd v-for="(item,key) in row.value" v-if="hasSn?key<(header.length-1):key<header.length" :item="item"
             :key="key"
             :tdKey="key"
             :rowKey="row.key" :header="header"
             :hasSn="hasSn"
             :actions="actions" :editable="editable" v-on:editedColumn="editedColumn"></tableTd>
    <td class="td-actions">
      <router-link v-if="action&&action.update&&actionUrls&&actionUrls.infoUrl" class="btn btn-info"
                   :to="{path:actionUrls.infoUrl,query:{key:row.key}}">更新
      </router-link>
      <a class="btn btn-primary" v-if="action&&action.update&&actions&&actions.updateAction"
         @click.prevent="updateRow(row.key)">更新</a>
      <a v-if="action&&action.delete" class="btn btn-danger" v-on:click.prevent="deleteRow(row.key)">删除
      </a>
      <router-link v-if="action&&action.routes" class="btn btn-default"
                   v-for="(item,key) in (action&&action.routes||[])"
                   :key="key"
                   :to="{path:actionUrls[item.key],query:{key:row.key}}">{{item.label}}
      </router-link>
      <a v-if="action&&action.events" class="btn btn-default"
         v-for="(item,key) in (action&&action.events||[])"
         :key="key" @click.prevent="dealCustomEvent(row.key,item.key)">{{item.label}}
      </a>
    </td>
  </tr>
</template>
<script>
  import lodash from 'lodash'
  import {mapActions} from 'vuex'
  import tableTd from './TableTd.vue'

  export default {
    name: 'v-table-row',
    data () {
      return {
        rowNum: this.getRowNum(),
        deleteModal: {
          type: 'danger',
          header: '删除记录',
          showFooter: true,
          content: '确定要删除该条记录吗？',
          isConfirmModal: true
        }
      }
    },
    props: ['row', 'index', 'action', 'header', 'hasSn', 'actionUrls', 'actions', 'editable', 'tableId'],
    methods: lodash.assignIn({
      getRowNum () {
        return this.index + 1
      },
      editedColumn (data, key) {
        this.row.value[key] = data
        this.$emit('editedColumn')
      },
      updateRow (key, event) {
        // 首先给出确认modal，然后进行del的fun调用操作,开始modal的处理了,尝试使用下filter处理item的值
        this.actions.updateAction({key})
      },
      deleteRow (key, event) {
        // 首先给出确认modal，然后进行del的fun调用操作,开始modal的处理了,尝试使用下filter处理item的值
        this.$Vue.createModal({modalData: this.deleteModal, confirmCallback: this.deleteRowOnConfirmed.bind(this, key)})
      },
      deleteRowOnConfirmed (key) {
        this.tableDeleteRow({
          id: this.tableId,
          key,
          deleteUrl: this.actionUrls && this.actionUrls.deleteUrl,
          deleteAction: this.actions && this.actions.delete
        })
      },
      dealCustomEvent (key, methodName) {
        this.actions && this.actions[methodName](key)
      }
    }, mapActions([
      'tableDeleteRow'
    ])),
    components: {tableTd}
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  @import "../../scss/import.scss";

  tr {
    th, td {
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
    &:hover {
      background: #ccc;
    }
  }
</style>
