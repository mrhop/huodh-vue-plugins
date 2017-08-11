<template>
  <div :class="['form-element',options.validatedMsg?'has-error':'']">
    <input
      v-if="options.type==='hidden'"
      type="hidden" class="form-control" :name="options.name"
      v-model="elementValue" ref="formElementEl"/>
    <input
      v-if="options.type==='text'"
      type="text" class="form-control" :name="options.name" :placeholder="options.placeholder"
      v-model="elementValue" ref="formElementEl" :readonly="options.locked"/>
    <input
      v-if="options.type==='button'"
      type="button" class="form-control" :name="options.name"
      :value="elementValue" ref="formElementEl" @click="buttonClick"/>
    <div :class="['file-block',options.validatedMsg&&options.validatedMsg[options.name+n]?'file-error':'']"
         v-else-if="options.type==='file'||options.type==='image'" v-for="n in (options.quantity||1)">
      <input type="file" class="form-control" v-on:change="fileChange" :name="options.name" :data-index="options.name+n"
             ref="formElementEl"/>
      <a v-if="options.path&&options.path[n-1]" :href="options.path[n-1]" target="_blank">{{options.name+(options.quantity?n:'')}}</a>
      <p v-if="options.validatedMsg&&options.validatedMsg[options.name+n]">{{options.validatedMsg[options.name+n]}}</p>
    </div>
    <input
      v-else-if="options.type==='password'"
      type="password" class="form-control" :name="options.name"
      v-model="elementValue" ref="formElementEl" :placeholder="options.placeholder" :readonly="options.locked"/>
    <input
      v-else-if="options.type==='number'"
      type="number" class="form-control" :name="options.name"
      v-model="elementValue" ref="formElementEl" :placeholder="options.placeholder" :readonly="options.locked"/>
    <div class="select-block" v-else-if="options.type==='select'" @mouseenter="showSelectCancel = true"
         @mouseleave="showSelectCancel = false">
      <select class="form-control" :name="options.name"
              v-model="elementValue" ref="formElementEl" :placeholder="options.placeholder">
        <option v-for="(selectItem, selectItemKey) in options.items" :key="selectItemKey" :value="selectItem.value">
          {{selectItem.label}}
        </option>
      </select>
      <transition name="fade">
        <span class="cancel-btn" @click="clearSelect" v-show="showSelectCancel"/>
      </transition>
    </div>
    <label v-else-if="options.type==='radio' && !options.locked" class="radio-inline"
           v-for="(selectItem, selectItemKey) in options.items" :key="selectItemKey">
      <input type="radio" :name="options.name" :value="selectItem.value" v-model="elementValue"
             ref="formElementEl">
      {{selectItem.label}}
    </label>
    <label v-else-if="options.type==='radio' && options.locked" class="radio-inline"
           v-for="(selectItem, selectItemKey) in options.items" :key="selectItemKey">
      <input type="radio" :name="options.name" :value="selectItem.value"
             :checked="elementValue === selectItem.value"
             ref="formElementEl"
             v-on:click.prevent>
      {{selectItem.label}}
    </label>
    <label v-else-if="options.type==='checkbox' && !options.locked" class="checkbox-inline"
           v-for="(selectItem, selectItemKey) in options.items" :key="selectItemKey">
      <input type="checkbox" :name="options.name" :value="selectItem.value" v-model="elementValue"
             ref="formElementEl">
      {{selectItem.label}}
    </label>
    <label v-else-if="options.type==='checkbox' && options.locked" class="checkbox-inline"
           v-for="(selectItem, selectItemKey) in options.items" :key="selectItemKey">
      <input type="checkbox" :name="options.name" :checked="elementValue.includes(selectItem.value)"
             :value="selectItem.value" ref="formElementEl"
             v-on:click.prevent>
      {{selectItem.label}}
    </label>
    <textarea v-else-if="options.type==='textarea'" class="form-control" :name="options.name"
              :rows="options.rows?options.rows:3" v-model="elementValue" ref="formElementEl"
              :placeholder="options.placeholder" :readonly="options.locked"/>
    <datePicker v-else-if="options.type==='date'" :readonly="options.locked" :value="elementValue"
                v-on:input="dealWithDate" ref="formElementEl"/>
    <datePicker v-else-if="options.type==='daterange'" :range="true" :readonly="options.locked"
                :value="elementValue"
                v-on:input="dealWithDate" ref="formElementEl"/>
    <div class="tree-block" v-else-if="options.type==='tree'" @mouseenter="showSelectCancel = true"
         @mouseleave="showSelectCancel = false">
      <input
        type="text" class="form-control" :name="options.name" :placeholder="options.placeholder"
        v-model="treeValue" ref="formElementEl" :readonly="true" @click="showOrHideTree"/>
      <transition name="fade">
        <span class="cancel-btn" @click="clearSelect" v-show="showSelectCancel"/>
      </transition>
      <transition name="toggle">
        <treeForForm v-show="showTree" :treeData="options.treeData" v-on:click="dealWithTree"/>
      </transition>
    </div>
    <p v-if="options.validatedMsg&&options.type!=='file'&&options.type!=='image'">{{options.validatedMsg}}</p>
    <p v-if="(options.type==='file'||options.type==='image')&&options.validatedMsg&&options.validatedMsg[options.name]">
      {{options.validatedMsg[options.name]}}</p>
  </div>
</template>
<script>
  import Vue from 'vue'
  import {utilfuns} from '../vform/store/state'
  import datePicker from '../datePicker/DatePicker.vue'
  import treeForForm from '../tree/TreeForForm.vue'
  export default {
    name: 'form-element',
    data () {
      return {
        elementValue: this.options.defaultValue,
        showSelectCancel: false,
        showTree: false,
        treeValue: this.options.defaultLabel || undefined,
        fromOuter: false
      }
    },
    props: ['dataFromParent', 'options', 'callback', 'formId'],
    methods: {
      dealWithData () {
        this.options.defaultValue = this.elementValue
        if (this.dataFromParent) {
          this.dataFromParent[this.options.name] = this.elementValue
        }
        if (!this.options.init) {
          Vue.set(this.options, 'validatedMsg', undefined)
          utilfuns.validateSub(this.options)
        } else {
          delete this.options.init
        }
        if (this.callback && typeof this.callback === 'function') {
          this.callback(this.$refs.formElementEl)
        }
        if (this.options.ruleChange) {
          this.$emit('ruleChange', {[this.options.name]: this.elementValue})
        }
      },
      dealWithDate (value) {
        var parts
        if (value) {
          if (this.options.type === 'date') {
            parts = value.split('-')
            this.elementValue = new Date(parts[0], parts[1] - 1, parts[2]).getTime()
          } else if (this.options.type === 'daterange') {
            var tempArr = []
            for (var index in value) {
              parts = value[index].split('-')
              tempArr.push(new Date(parts[0], parts[1] - 1, parts[2]).getTime())
            }
            this.elementValue = tempArr
          }
        } else {
          this.elementValue = undefined
        }
      },
      clearSelect () {
        this.elementValue = undefined
        this.treeValue = undefined
      },
      buttonClick () {
        if (this.options.ruleChange) {
          this.$emit('ruleChange', {[this.options.name]: this.elementValue})
        }
      },
      fileChange (event) {
        // do sth
        if (event.target.files.length > 0) {
          this.elementValue[event.target.getAttribute('data-index')] = event.target.files
        } else {
          delete this.elementValue[event.target.getAttribute('data-index')]
        }
        this.dealWithData()
      },
      showOrHideTree () {
        console.log('show or hide')
        this.showTree = !this.showTree
      },
      dealWithTree (data) {
        console.log('deal with tree')
        const {value, label} = data || {}
        if (value) {
          this.treeValue = label
          this.elementValue = value
        } else {
          this.treeValue = undefined
          this.elementValue = undefined
        }
        this.showTree = false
      },
      close (e) {
        if (!this.$el.contains(e.target)) {
          this.showTree = false
        }
      }
    },
    watch: {
      elementValue: function () {
        this.dealWithData()
      },
      options: {
        handler: function (val, oldVal) {
          if (val.init) {
            this.elementValue = val.defaultValue
            if (val.type === 'file' || val.type === 'image') {
              Array.from(document.querySelectorAll('#' + this.formId + ' ' + 'input[name=\'' + this.options.name + '\']')).forEach(function (val) {
                val.value = ''
                val.files = null
              })
            }
          }
        },
        deep: true
      }
    },
    mounted () {
      this.$nextTick(function () {
        if (this.options && this.options.type === 'tree') {
          window.addEventListener('click', this.close)
        }
      })
    },
    components: {datePicker, treeForForm}
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  @import "../../scss/import.scss";

  .form-element {
    &.has-error {
      p {
        margin: 0;
        font-size: 0.8em;
        color: $brand-danger;
      }
      .date-picker .input-wrapper {
        border-color: #a94442;
      }
      div.file-block {
        .form-control {
          border: 1px solid #ccc;
        }
        &.file-error {
          .form-control {
            border-color: #a94442;
          }
        }
      }
    }
    .form-control {
      border: 1px solid #aaa;
    }
    .select-block, .tree-block {
      .cancel-btn {
        cursor: pointer;
        border: none;
        height: 14px;
        width: 14px;
        background-image: url("./select-cancel.png");
        background-position: center;
        background-size: cover;
        position: absolute;
        right: 34px;
        top: 10px;
      }
    }
    .tree-block {
      position: relative;
      .cancel-btn {
        right: 10px;
      }
      .tree-wrapper {
        position: absolute;
        z-index: 4;
        width: 100%;
        border: 1px solid rgb(204, 204, 204);
        border-radius: 2px;
        background: rgb(255, 255, 255);
        box-shadow: 5px 5px 10px $base-background;
        a {
          color: #6ac1c9;
          &:hover {
            color: #0097a7;
          }
        }
      }
    }
    .toggle-enter, .toggle-leave-active {
      opacity: 0;
      transform: translateY(-10px);
    }
    .toggle-enter-active, .toggle-leave-active {
      transition: all ease .2s;
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
