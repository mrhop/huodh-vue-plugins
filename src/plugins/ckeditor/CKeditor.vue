<template>
  <textarea class="form-control ckeditor"
            :rows="options.rows||defaultRows"
            :id="id" name="options.name"
            :defaultValue="defaultValue" :readonly="options.locked">
  </textarea>
</template>
<script>
  import config from './Config'
  export default {
    name: 'v-ckeditor',
    data () {
      return {
        defaultValue: this.options.defaultValue,
        defaultRows: 10,
        id: 'ckeditor-' + (this.options.id || new Date().getTime())
      }
    },
    props: ['options'],
    /* eslint-disable no-undef */
    mounted () {
      CKEDITOR.replace(this.id, this.options && this.options.config || config)
      if (this.options.defaultValue) {
        CKEDITOR.instances[this.id].setData(this.options.defaultValue)
      }
      CKEDITOR.instances[this.id].on('change', function () {
        let data = CKEDITOR.instances[this.id].getData()
        this.$emit('inputChange', CKEDITOR.instances[this.id], data)
      }.bind(this))
    },
    updated () {
      CKEDITOR.instances[this.id].setData(this.options.defaultValue)
    },
    beforeDestroy () {
      CKEDITOR.instances[this.id].destroy()
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  @import "../../scss/import.scss";

  .cke_inner {
    textarea {
      color: #000
    }
  }
</style>
