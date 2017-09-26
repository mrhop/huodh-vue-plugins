<template>
  <div class="table-wrapper">
    <div class="actions">
      <div class="page-size" v-if="feature&&feature.pager">
        每页记录：
        <select v-model="pageSize" class="form-control" v-on:change="pageSizeChange">
          <option value="10" :selected="pageSize===10">10</option>
          <option value="15" :selected="pageSize===15">15</option>
          <option value="20" :selected="pageSize===20">20</option>
          <option value="25" :selected="pageSize===25">25</option>
          <option value="30" :selected="pageSize===30">30</option>
        </select>
      </div>
      <div class="add-item" v-if="action&&action.add&&(actionUrls&&actionUrls.addUrl||actions&&actions.addAction)">
        <router-link class="btn btn-primary" v-if="actionUrls&&actionUrls.addUrl" :to="actionUrls.addUrl">添加记录
        </router-link>
        <a class="btn btn-primary" v-if="actions&&actions.addAction"
           @click.prevent="addRedirectAction">添加记录
        </a>
      </div>
    </div>
    <div class="table-responsive">
      <table>
        <tableHeader :header="headerConst" :action="action" :feature="feature" :pager="pager" :filters="filters"
                     :sorts="sorts"
                     :actionUrls="actionUrls" :actions="actions" :tableId="id"/>
        <tableBody :rows="rows" :action="action" :actions="actions" :editable="editable" :header="header"
                   :actionUrls="actionUrls"
                   :hasSn="hasSn"
                   :tableId="id" v-on:editedColumn="editedColumn"/>
        <tableFooter :feature="feature" :pager="pager" :totalCount="totalCount" :actionUrls="actionUrls"
                     :totalPage="totalPage" :currentPage="currentPage"
                     :colspan="header.length+1"/>
      </table>
    </div>
    <div class="pager-bottom" v-if="feature.pager&&pager">
      <ul class="pagination">
        <li v-if="currentPage>1">
          <a href="#" aria-label="Previous" v-on:click.prevent="currentPageChange(currentPage-1)">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        <li v-for="n in totalPage" :class="currentPage===n?'active':''"><a href="#"
                                                                           v-on:click.prevent="currentPageChange(n)">{{n}}</a>
        </li>
        <li v-if="currentPage<totalPage">
          <a href="#" aria-label="Next" v-on:click.prevent="currentPageChange(currentPage+1)">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import lodash from 'lodash'
  import {mapActions} from 'vuex'
  import tableHeader from './TableHeader.vue'
  import tableBody from './TableBody.vue'
  import tableFooter from './TableFooter.vue'

  export default {
    name: 'v-table',
    computed: {
      header () {
        return this.$store.getters.tableHeader(this.id)
      },
      headerConst () {
        return this.$store.getters.tableHeaderConst(this.id)
      },
      action () {
        return this.$store.getters.tableAction(this.id)
      },
      feature () {
        return this.$store.getters.tableFeature(this.id)
      },
      rows () {
        return this.$store.getters.tableRows(this.id)
      },
      totalCount () {
        return this.$store.getters.tableTotalCount(this.id)
      },
      pager () {
        return this.$store.getters.tablePager(this.id)
      },
      pageSize () {
        return this.$store.getters.tablePageSize(this.id)
      },
      filters () {
        return this.$store.getters.tableFilters(this.id)
      },
      sorts () {
        return this.$store.getters.tableSorts(this.id)
      },
      hasSn () {
        return this.$store.getters.tableHasSn(this.id)
      },
      totalPage () {
        return this.$store.getters.tableTotalPage(this.id)
      },
      currentPage () {
        return this.$store.getters.tableCurrentPage(this.id)
      },
      deleteRowSuccess () {
        return this.$store.getters.tableDeleteRowSuccess(this.id)
      }
    },
    components: {tableHeader, tableBody, tableFooter},
    props: ['id', 'keepAlive', 'actionUrls', 'actions', 'editable', 'reInit'],
    methods: lodash.assignIn({
      pageSizeChange (event) {
        let pager = {
          currentPage: 1,
          pageSize: parseInt(event.target.value)
        }
        let filters = this.filters
        let sorts = this.sorts
        this.tableGetList({
          id: this.id,
          listUrl: this.actionUrls && this.actionUrls.listUrl,
          listAction: this.actions && this.actions.list,
          pager,
          filters,
          sorts
        })
      },
      currentPageChange (currentPage) {
        console.log('currentPage' + currentPage)
        let pager = {
          currentPage,
          pageSize: this.pageSize
        }
        let filters = this.filters
        let sorts = this.sorts
        this.tableGetList({
          id: this.id,
          listUrl: this.actionUrls && this.actionUrls.listUrl,
          listAction: this.actions && this.actions.list,
          pager,
          filters,
          sorts
        })
      },
      addRedirectAction () {
        this.actions && this.actions.addAction()
      },
      editedColumn () {
        this.tableInit({
          id: this.id,
          listUrl: this.actionUrls && this.actionUrls.listUrl,
          listAction: this.actions && this.actions.list
        })
      }
    }, mapActions([
      'tableInit',
      'tableGetList',
      'tableRefreshList',
      'clearTable'
    ])),
    beforeMount () {
      console.log('before mount')
      this.clearTable({'id': this.id})
      this.tableInit({
        id: this.id,
        listUrl: this.actionUrls && this.actionUrls.listUrl,
        listAction: this.actions && this.actions.list
      })
    },
    destoryed () {
      if (!this.keepAlive) {
        this.clearTable({'id': this.id})
      }
    },
    watch: {
      deleteRowSuccess: function () {
        if (this.deleteRowSuccess) {
          this.tableRefreshList({
            id: this.id,
            listUrl: this.actionUrls && this.actionUrls.listUrl,
            listAction: this.actions && this.actions.list
          })
        }
      },
      actionUrls: {
        handler: function (val, oldVal) {
          if (val.listUrl && val.listUrl !== oldVal.listUrl) {
            console.log('do init')
            this.tableInit({
              id: this.id,
              listUrl: this.actionUrls && this.actionUrls.listUrl,
              listAction: this.actions && this.actions.list
            })
          }
        },
        deep: true
      },
      actions: {
        handler: function (val, oldVal) {
          if ((val.list && val.list !== oldVal.list) || (val.reinit)) {
            console.log('do init')
            val.reinit = false
            this.tableInit({
              id: this.id,
              listUrl: this.actionUrls && this.actionUrls.listUrl,
              listAction: this.actions && this.actions.list
            })
          }
        },
        deep: true
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  @import "../../scss/import.scss";

  .table-wrapper {
    margin: 15px;
    .actions {
      width: 100%;
      overflow: hidden;
      margin-bottom: 10px;
      .page-size {
        float: left;
        select {
          display: inline-block;
          width: 100px;
          margin-left: 5px;
        }
      }
      .add-item {
        float: right;
      }
    }
    .table-responsive {
      overflow-x: visible;
      table {
        width: 100%;
      }
    }
    .pager-bottom {
      text-align: center;
      .pagination {
        > li {
          > span, > a {
            z-index: 0;
            border-color: #ccc;
            &:hover {
              color: #fff;
              background-color: $brand-primary;
            }
          }
        }
      }
    }
  }
</style>
