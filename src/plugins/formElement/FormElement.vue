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
      v-else-if="options.type==='file'"
      type="file" class="form-control" :name="options.name" ref="formElementEl"/>
    <input
      v-else-if="options.type==='password'"
      type="password" class="form-control" :name="options.name"
      v-model="elementValue" ref="formElementEl" :readonly="options.locked"/>
    <input
      v-else-if="options.type==='number'"
      type="number" class="form-control" :name="options.name"
      v-model="elementValue" ref="formElementEl" :placeholder="options.placeholder" :readonly="options.locked"/>
    <select v-else-if="options.type==='select'" class="form-control" :name="options.name"
            v-model="elementValue" ref="formElementEl" :placeholder="options.placeholder">
      <option v-for="(selectItem, selectItemKey) in options.items" :key="selectItemKey" :value="selectItem.value">
        {{selectItem.label}}
      </option>
    </select>
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
    <p v-if="options.validatedMsg">{{options.validatedMsg}}</p>
  </div>
</template>
<script>
  export default {
    name: 'form-element',
    data () {
      return {
        elementValue: this.options.defaultValue || ((this.options.type === 'checkbox') ? [] : '')
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
          delete this.options.defaultValue
          if (this.dataFromParent) {
            delete this.dataFromParent[this.options.name]
          }
        }
        if (this.callback && typeof this.callback === 'function') {
          this.callback(this.$refs.formElementEl)
        }
      }
    },
    watch: {
      elementValue: function () {
        this.dealWithData()
      },
      options: function () {
        if (!this.options.validatedMsg) {
          this.elementValue = this.options.defaultValue || ((this.options.type === 'checkbox') ? [] : '')
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  @import "../../scss/import.scss";

  .form-control {
    border: 1px solid #aaa;
  }

  .form-element.has-error {
    p {
      margin: 0;
      font-size: 0.8em;
      color: $brand-danger;
    }
  }
</style>
