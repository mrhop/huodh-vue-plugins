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
    <datePicker v-else-if="options.type==='date'" :readonly="options.locked" :value="elementValue"
                v-on:input="dealWithDate"/>
    <datePicker v-else-if="options.type==='daterange'" :range="true" :readonly="options.locked" :value="elementValue"
                v-on:input="dealWithDate"/>
    <p v-if="options.validatedMsg">{{options.validatedMsg}}</p>
  </div>
</template>
<script>
  import datePicker from '../datePicker/DatePicker.vue'
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
    },
    components: {datePicker}
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
