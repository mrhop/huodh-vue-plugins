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
    <div :class="['file-block',options.validatedMsg&&options.validatedMsg[options.name+n]?'file-error':'']"
         v-else-if="options.type==='file'" v-for="n in (options.quantity||1)">
      <input type="file" class="form-control" v-on:change="fileChange" :name="options.name" :data-index="options.name+n"
             ref="formElementEl"/>
      <a v-if="options.path&&options.path[n-1]" :href="options.path[n-1]" target="_blank">{{options.name+(options.quantity?n:'')}}</a>
      <p v-if="options.validatedMsg&&options.validatedMsg[options.name+n]">{{options.validatedMsg[options.name+n]}}</p>
    </div>
    <input
      v-else-if="options.type==='password'"
      type="password" class="form-control" :name="options.name"
      v-model="elementValue" ref="formElementEl" :readonly="options.locked"/>
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
        <img class="cancel-btn" src="./select-cancel.png" @click="clearSelect" v-show="showSelectCancel">
      </transition>
    </div>
    <label v-else-if="options.type==='radio' && !options.locked" class="radio-inline"
           v-for="(selectItem, selectItemKey) in options.items" :key="selectItemKey">
      <input type="radio" :name="options.name" :value="selectItem.value" v-model="elementValue" ref="formElementEl">
      {{selectItem.label}}
    </label>
    <label v-else-if="options.type==='radio' && options.locked" class="radio-inline"
           v-for="(selectItem, selectItemKey) in options.items" :key="selectItemKey">
      <input type="radio" :name="options.name" :value="selectItem.value" :checked="elementValue === selectItem.value"
             ref="formElementEl"
             v-on:click.prevent>
      {{selectItem.label}}
    </label>
    <label v-else-if="options.type==='checkbox' && !options.locked" class="checkbox-inline"
           v-for="(selectItem, selectItemKey) in options.items" :key="selectItemKey">
      <input type="checkbox" :name="options.name" :value="selectItem.value" v-model="elementValue" ref="formElementEl">
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
                v-on:input="dealWithDate"/>
    <datePicker v-else-if="options.type==='daterange'" :range="true" :readonly="options.locked" :value="elementValue"
                v-on:input="dealWithDate"/>
    <p v-if="options.validatedMsg&&options.type!=='file'">{{options.validatedMsg}}</p>
    <p v-if="options.type==='file'&&options.validatedMsg&&options.validatedMsg[options.name]">
      {{options.validatedMsg[options.name]}}</p>
  </div>
</template>
<script>
  import datePicker from '../datePicker/DatePicker.vue'
  export default {
    name: 'form-element',
    data () {
      return {
        elementValue: this.options.defaultValue || ((this.options.type === 'checkbox') ? [] : ((this.options.type === 'file') ? {} : '')),
        showSelectCancel: false
      }
    },
    props: ['dataFromParent', 'options', 'callback'],
    methods: {
      dealWithData () {
        delete this.options.validatedMsg
        if (this.elementValue) {
          this.options.defaultValue = this.elementValue
          if (this.dataFromParent) {
            this.dataFromParent[this.options.name] = this.elementValue
          }
        } else {
          this.options.defaultValue = ''
          if (this.dataFromParent) {
            this.dataFromParent[this.options.name] = ''
          }
        }
        if (this.callback && typeof this.callback === 'function') {
          this.callback(this.$refs.formElementEl)
        }
        if (this.options.ruleChange) {
          this.$emit('ruleChange', {[this.options.name]: this.options.defaultValue})
        }
      },
      dealWithDate (value) {
        var parts
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
      },
      clearSelect () {
        this.elementValue = ''
      },
      fileChange (event) {
        // do sth
        if (event.target.files.length > 0) {
          this.elementValue[event.target.getAttribute('data-index')] = event.target.files
        } else {
          delete this.elementValue[event.target.getAttribute('data-index')]
        }
        this.dealWithData()
        this.$forceUpdate()
      }
    },
    watch: {
      elementValue: function () {
        this.dealWithData()
      },
      options: function () {
        if (!this.options.validatedMsg) {
          this.elementValue = this.options.defaultValue || ((this.options.type === 'checkbox') ? [] : ((this.options.type === 'file') ? {} : ''))
        }
      }
    },
    components: {datePicker}
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
    .select-block {
      .cancel-btn {
        height: 14px;
        width: 14px;
        position: absolute;
        right: 34px;
        top: 10px;
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
