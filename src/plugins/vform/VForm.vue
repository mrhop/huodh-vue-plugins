<template>
  <div class="form-wrapper">
    <div class="actions" v-if="action&&action.backup">
      <div class="backup-action">
        <router-link v-if="actionUrls.backupUrl" class="btn btn-primary" :to="actionUrls.backupUrl">
          {{action.backup.label}}
        </router-link>
      </div>
    </div>
    <form class="form-horizontal" :id="'vform-'+id" method="post" :action="actionUrls&&actionUrls.directSaveUrl">
      <div v-for="(item,key) in items" :key="key">
        <div class="form-group" v-if="!Array.isArray(item)&&!item.hidden" v-show="item.type!='hidden'">
          <label :for="item.name" class="col-sm-2 control-label">{{item.label}}</label>
          <div class="col-sm-10">
            <formElement :formId="'vform-'+id" v-if="!item.hidden&&item.ruleChange" :options="item"
                         v-on:ruleChange="ruleChange"/>
            <formElement :formId="'vform-'+id" v-else-if="!item.hidden" :options="item"/>
          </div>
        </div>
        <div v-else-if="Array.isArray(item)" class="elements-inline">
          <div v-if="!subItem.hidden" v-show="subItem.type!='hidden'"
               :class="['form-group', subItem.validatedMsg?'has-error':'']"
               v-for="(subItem,subkey) in item" :key="subkey">
            <label :for="subItem.name" class="col-sm-2 control-label">{{subItem.label}}</label>
            <div class="col-sm-10">
              <formElement :formId="'vform-'+id" v-if="!subItem.hidden&&subItem.ruleChange" :options="subItem"
                           v-on:ruleChange="ruleChange"/>
              <formElement :formId="'vform-'+id" v-else-if="!subItem.hidden" :options="subItem"/>
            </div>
          </div>
        </div>
      </div>
      <!-- 此处是底部的actions -->
      <div class="form-group actions" v-if="action&&action.save">
        <div class="col-sm-offset-2 col-sm-10">
          <button type="submit" v-if="action.save&&saveButtonDisabled" disabled class="btn btn-primary"
                  v-on:click.prevent="saveForm">{{action.save.label}}
          </button>
          <button type="submit" v-if="action.save&&!saveButtonDisabled" class="btn btn-primary"
                  v-on:click.prevent="saveForm">{{action.save.label}}
          </button>
          <button type="reset" v-if="action.reset" class="btn btn-default"
                  v-on:click.prevent="resetForm">{{action.reset.label}}
          </button>
          <router-link v-if="action&&action.others&&actionUrls&&actionUrls[item.key]" :class="['others',item.key]"
                       v-for="(item,keyTemp) in action.others"
                       :key="keyTemp"
                       :to="{path:actionUrls[item.key],query:{key}}">{{item.label}}
          </router-link>
          <button v-if="action&&action.others&&actions&&actions[item.key]"
                  :class="['btn','btn-default','others',item.key]"
                  v-for="(item,keyTemp) in action.others"
                  :key="keyTemp"
                  v-on:click.prevent="actions[item.key].call(this,{key})">
            {{item.label}}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>
<script>
  import Vue from 'vue'
  import lodash from 'lodash'
  import {mapActions} from 'vuex'
  import {setDefaultValue} from './store/state'
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
    data () {
      return {
        saveButtonDisabled: false
      }
    },
    computed: {
      items () {
        return this.$store.getters.formItems(this.id)
      },
      action () {
        return this.$store.getters.formAction(this.id)
      },
      key () {
        if (this.$route) {
          if (this.$route.query && this.$route.query.key) {
            return this.$route.query.key
          } else if (this.$route && this.$route.params && this.$route.params.key) {
            return this.$route.params.key
          }
        }
        return null
      },
      error () {
        return this.$store.getters.formError(this.id)
      },
      success () {
        return this.$store.getters.formSuccess(this.id)
      }
    },
    components: {formElement},
    props: {
      id: {},
      keepAlive: {},
      actionUrls: {
        default: function () {
          return {}
        }
      },
      actions: {
        default: function () {
          return {}
        }
      },
      formRule: {
        default: function () {
          return {}
        }
      },
      updateRule: {
        default: function () {
          return {}
        }
      }
    },
    methods: lodash.assignIn({
      resetForm () {
        this.formReset({
          id: this.id,
          resetUrl: this.actionUrls && this.actionUrls.resetUrl,
          resetAction: this.actions && this.actions.reset
        })
      },
      ruleChange (parameters) {
        this.formRuleChange({
          id: this.id,
          parameters: {changed: parameters, items: this.items},
          ruleChangeUrl: this.actionUrls && this.actionUrls.ruleChangeUrl,
          ruleChangeAction: this.actions && this.actions.ruleChange
        })
      },
      saveForm () {
        this.saveButtonDisabled = true
        if (this.actionUrls && this.actionUrls.saveUrl || this.actions && this.actions.save) {
          this.formSave({
            id: this.id,
            key: this.key,
            saveUrl: this.actionUrls && this.actionUrls.saveUrl,
            saveAction: this.actions && this.actions.save
          })
        } else {
          var flag = this.formValidate({
            id: this.id,
            key: this.key
          })
          if (flag) {
            flag.then(function (value) {
              if (value === true) {
                document.getElementById('vform-' + this.id).submit()
              }
            }.bind(this))
          }
        }
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
      'formValidate',
      'clearForm',
      'removeFormError',
      'removeFormSuccess'
    ])),
    watch: {
      error: function () {
        this.saveButtonDisabled = false
        if (this.error) {
          if (this.error.title) {
            this.$options.errorModalData.header = this.error.title
            if (this.error.message) {
              this.$options.errorModalData.content = this.error.message
            }
            this.$Vue.createModal({modalData: this.$options.errorModalData})
          }
          this.removeFormError({id: this.id})
        }
      },
      success: function () {
        this.saveButtonDisabled = false
        let data = this.$store.getters.data(this.id)
        if (this.success) {
          if (typeof this.success === 'object') {
            if (this.success.title || this.success.message) {
              this.$options.successModalData.header = this.success.title
              this.$options.successModalData.content = this.success.message
              this.$Vue.createModal({modalData: this.$options.successModalData})
            }
            if (this.success.data) {
              lodash.assign(data, this.success.data)
            }
            this.removeFormSuccess({id: this.id})
          } else {
            this.removeFormSuccess({id: this.id})
            this.backup()
          }
          this.$emit('afterSaved', data)
        }
      },
      actionUrls: {
        handler: function (val, oldVal) {
          if (val.initUrl && val.initUrl !== oldVal.initUrl) {
            console.log('do reinit')
            this.formInit({
              id: this.id,
              key: this.key,
              initUrl: this.actionUrls && this.actionUrls.initUrl,
              initAction: this.actions && this.actions.init,
              formRule: this.formRule
            })
          }
        },
        deep: true
      },
      actions: {
        handler: function (val, oldVal) {
          if ((val.init && val.init !== oldVal.init) || (val.reinit)) {
            val.reinit = false
            console.log('do reinit')
            this.formInit({
              id: this.id,
              key: this.key,
              initUrl: this.actionUrls && this.actionUrls.initUrl,
              initAction: this.actions && this.actions.init,
              formRule: this.formRule
            })
          }
        },
        deep: true
      },
      formRule: {
        handler: function (val, oldVal) {
          console.log('do reinit')
          this.formInit({
            id: this.id,
            key: this.key,
            initUrl: this.actionUrls && this.actionUrls.initUrl,
            initAction: this.actions && this.actions.init,
            formRule: this.formRule
          })
        },
        deep: true
      },
      updateRule: {
        handler: function (val, oldVal) {
          for (let index in this.items) {
            if (index < this.items.length) {
              if (val.hasOwnProperty(this.items[index].name)) {
                // 不能设置为null
                setDefaultValue(this.items[index])
                Vue.set(this.items[index], 'defaultValue', val[this.items[index].name])
//                Vue.delete(val, this.items[index].name)
              }
            }
          }
        },
        deep: true
      }
    },
    beforeMount () {
      this.clearForm({'id': this.id})
      this.formInit({
        id: this.id,
        key: this.key,
        initUrl: this.actionUrls && this.actionUrls.initUrl,
        initAction: this.actions && this.actions.init,
        formRule: this.formRule
      })
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
    overflow: visible;
    padding-bottom: 10px;
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
      @media(min-width: $screen-md-min) {
        div.elements-inline {
          margin-left: 17%;
          .form-group {
            margin-left: 0;
            margin-right: 0;
            display: inline-block;
            vertical-align: middle;
            &.has-error {
              margin-bottom: 0;
            }
            .col-sm-2, .col-sm-10 {
              width: auto;
              padding-left: 0;
              padding-right: 0;
            }
            .col-sm-2 {
              margin-right: 5px;
              margin-left: 10px;
            }
            &:first-child {
              .col-sm-2 {
                margin-left: 0;
              }
            }
          }
        }
      }
    }
  }
</style>
