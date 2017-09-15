<template>
  <textarea class="form-control ckeditor"
            :rows="options.rows||defaultRows"
            :id="id" name="options.name"
            :defaultValue="defaultValue" :readonly="options.locked">
  </textarea>
</template>
<script>
  export default {
    name: 'v-ckeditor',
    data () {
      return {
        defaultValue: this.options.defaultValue,
        defaultRows: 10,
        ckeditorConfig: {
          language: 'zh-cn',
          uiColor: '#9AB8F3',
          toolbar: [
            {name: 'document', items: ['Print']},
            {name: 'clipboard', items: ['Undo', 'Redo']},
            {name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize']},
            {
              name: 'basicstyles',
              items: ['Bold', 'Italic', 'Underline', 'Strike', 'RemoveFormat', 'CopyFormatting']
            },
            {name: 'colors', items: ['TextColor', 'BGColor']},
            {name: 'align', items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock']},
            {name: 'links', items: ['Link', 'Unlink']},
            {
              name: 'paragraph',
              items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote']
            },
            {name: 'insert', items: ['Image', 'EmbedSemantic', 'Flash', 'Table', 'HorizontalRule', 'SpecialChar']},
            {name: 'tools', items: ['Maximize']},
            {name: 'document', items: ['Source']},
            {name: 'editing', items: ['Scayt']}
          ],
          // 考虑css的植入，从服务器来，basic部分的css，就像basic.css include bootstrap animated.css 等，就足够了
          // contentsCss: [ 'https://cdn.ckeditor.com/4.6.1/full-all/contents.css', 'mystyles.css' ],
          bodyClass: 'main-content',
          extraPlugins: 'tableresize,embedsemantic' + this.options.filebrowserBrowseUrl && ',uploadfile' + this.options.filebrowserImageBrowseUrl && ',uploadimage' + this.options.filebrowserFlashBrowseUrl && ',flash'
        },
        id: 'ckeditor-' + (this.options.id || new Date().getTime())
      }
    },
    props: ['options', 'value'],
    /* eslint-disable no-undef */
    mounted () {
      if (this.options.filebrowserBrowseUrl) {
        this.ckeditorConfig.filebrowserBrowseUrl = this.options.filebrowserBrowseUrl
      }
      if (this.options.filebrowserImageBrowseUrl) {
        this.ckeditorConfig.filebrowserImageBrowseUrl = this.options.filebrowserImageBrowseUrl
      }
      if (this.options.filebrowserFlashBrowseUrl) {
        this.ckeditorConfig.filebrowserFlashBrowseUrl = this.options.filebrowserFlashBrowseUrl
      }
      if (this.options.filebrowserUploadUrl) {
        this.ckeditorConfig.filebrowserUploadUrl = this.options.filebrowserUploadUrl
      }
      if (this.options.filebrowserImageUploadUrl) {
        this.ckeditorConfig.filebrowserImageUploadUrl = this.options.filebrowserImageUploadUrl
      }
      if (this.options.filebrowserFlashUploadUrl) {
        this.ckeditorConfig.filebrowserFlashUploadUrl = this.options.filebrowserFlashUploadUrl
      }
      CKEDITOR.replace(this.id, this.ckeditorConfig)
      CKEDITOR.instances[this.id].on('change', function () {
        let data = CKEDITOR.instances[this.id].getData()
        this.$emit('inputChange', CKEDITOR.instances[this.id], data)
      }.bind(this))
    },
    updated () {
      CKEDITOR.instances[this.id].setData(this.value)
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
