<template>
  <tr>
    <th v-if="hasSn">
      <router-link v-if="action&&action.detail" :to="{path:actionUrls.detailUrl,query:{key:row.key}}">{{rowNum}}
      </router-link>
      <span v-else>{{rowNum}}</span>
    </th>
    <td v-for="(item,key) in row.value" :key="key">{{item}}</td>
    <td class="td-actions">
      <router-link v-if="action&&action.update" class="btn btn-info" :to="{path:actionUrls.infoUrl,query:{key:row.key}}">更新
      </router-link>
      <a v-if="action&&action.delete" class="btn btn-danger" v-on:click.prevent="deleteRow(row.key)">删除
      </a>
      <router-link v-if="action&&action.others" class="btn btn-default" v-for="(item,key) in action.others" :key="key"
                   :to="{path:actionUrls[item.key],query:{key:row.key}}">{{item.label}}
      </router-link>
    </td>
  </tr>
</template>
<script>
  import lodash from 'lodash'
  import {mapActions} from 'vuex'

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
    props: ['row', 'index', 'action', 'hasSn', 'actionUrls', 'tableId'],
    methods: lodash.assignIn({
      getRowNum () {
        return this.index + 1
      },
      deleteRow (key, event) {
        // 首先给出确认modal，然后进行del的fun调用操作,开始modal的处理了
        this.$Vue.createModal({modalData: this.deleteModal, confirmCallback: this.deleteRowOnConfirmed.bind(this, key)})
      },
      deleteRowOnConfirmed (key) {
        this.tableDeleteRow({id: this.tableId, key, deleteUrl: this.actionUrls.deleteUrl})
      }
    }, mapActions([
      'tableDeleteRow'
    ]))
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  @import "../../scss/import.scss";

  tr {
    th, td {
      border-bottom: 1px solid #ccc;
      padding: 2px;
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
