<template>
  <div class="form-wrapper">
    <div class="actions" v-if="action&&action.backup">
      <div class="backup-action">
        <router-link class="btn btn-primary" :to="actionUrls.backupUrl">{{action.backup.label}}</router-link>
      </div>
    </div>
    <form class="form-horizontal">
      <div class="form-group" v-for="(item,key) in items" :key="key" v-if="!item.hidden">
        <label :for="item.name" class="col-sm-2 control-label">{{item.label}}</label>
        <div class="col-sm-10">
          <formElement v-if="!item.hidden&&item.ruleChange" :options="item" v-on:ruleChange="ruleChange"/>
          <formElement v-else-if="!item.hidden" :options="item"/>
        </div>
      </div>
      <!-- 此处是底部的actions -->
      <div class="form-group" v-if="action&&action.save">
        <div class="col-sm-offset-2 col-sm-10">
          <button type="submit" v-if="action.save" class="btn btn-primary"
                  v-on:click.prevent="saveForm">{{action.save.label}}
          </button>
          <button type="reset" v-if="action.reset" class="btn btn-default"
                  v-on:click.prevent="resetForm">{{action.reset.label}}
          </button>
          <router-link v-if="action&&action.others" class="btn btn-default" v-for="(item,key) in action.others"
                       :key="key"
                       :to="{path:actionUrls[item.key],query:{key}}">{{item.label}}
          </router-link>
        </div>
      </div>
    </form>
  </div>
</template>
<script>
  import lodash from 'lodash'
  import {mapActions} from 'vuex'
  import formElement from '../formElement/FormElement.vue'

  export default {
    name: 'v-form',
    errorModalData: {
      type: 'danger',
      header: 'Form Error',
      showFooter: true
    },
    successModalData: {
      type: 'success',
      header: 'Form Success',
      showFooter: true
    },
    computed: {
      items () {
        return this.$store.getters.formItems(this.id)
      },
      action () {
        return this.$store.getters.formAction(this.id)
      },
      key () {
        return this.$route && this.$route.query ? this.$route.query.key : ''
      },
      error () {
        return this.$store.getters.formError(this.id)
      },
      success () {
        return this.$store.getters.formSuccess(this.id)
      }
    },
    components: {formElement},
    props: ['id', 'keepAlive', 'actionUrls'],
    methods: lodash.assignIn({
      resetForm () {
        this.formReset({id: this.id})
      },
      ruleChange (parameters) {
        if (this.actionUrls.ruleChangeUrl) {
          this.formRuleChange({id: this.id, parameters, ruleChangeUrl: this.actionUrls.ruleChangeUrl})
        }
      },
      saveForm () {
        this.formSave({id: this.id, key: this.key, saveUrl: this.actionUrls.saveUrl})
      },
      backup () {
        if (this.actionUrls.backupUrl) {
          // 成功保存完后返回backupurl
          this.$router.push(this.actionUrls.backupUrl)
        }
      }
    }, mapActions([
      'formInit',
      'formReset',
      'formRuleChange',
      'formSave',
      'clearForm',
      'removeFormError',
      'removeFormSuccess'
    ])),
    watch: {
      error: function () {
        if (this.error) {
          if (this.error.title) {
            this.$options.errorModalData.header = this.error.title
          }
          this.$options.errorModalData.content = this.error.message
        }
        this.$Vue.createModal({modalData: this.$options.errorModalData})
        this.removeFormError({id: this.id})
      },
      success: function () {
        if (this.success) {
          if (typeof this.success === 'object') {
            if (this.success.title) {
              this.$options.successModalData.header = this.success.title
            }
            this.$options.successModalData.content = this.success.message
            this.$Vue.createModal({modalData: this.$options.successModalData})
            this.removeFormSuccess({id: this.id})
          } else {
            this.removeFormSuccess({id: this.id})
            this.backup()
          }
        }
      }
    },
    created () {
      this.formInit({id: this.id, key: this.key, initUrl: this.actionUrls.initUrl})
    },
    destoryed () {
      if (!this.keepAlive) {
        this.clearForm({'id': this.id})
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  @import "../../scss/import.scss";

  .form-wrapper {
    margin: 15px;
    .actions {
      width: 100%;
      overflow: hidden;
      margin-bottom: 10px;
      .backup-action {
        float: right;
      }
    }
    .form-horizontal {
      // 内部的一些设置
    }
  }
</style>
