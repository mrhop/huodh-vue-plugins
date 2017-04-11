<template>
  <transition name="fade-down">
    <div v-if="available" :class="['modal',this.type]" ref="modalWrapEl" @click="closeModal">
      <div class="modal-dialog" @click.stop>
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="closeModal"><span
              aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">{{header}}</h4>
          </div>
          <div class="modal-body">
            <div ref="contentWrapEl"></div>
          </div>
          <div v-if="showFooter" class="modal-footer">
            <button v-if="!confirmModal" :class="['btn', 'btn-'+type]" @click="closeModal">关闭</button>
            <button v-if="confirmModal" :class="['btn', 'btn-'+type]" @click="closeModal">取消</button>
            <button v-if="confirmModal" @click="confirm" :class="['btn', 'btn-'+type]">确认</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
  import Vue from 'vue'
  export default {
    name: 'v-modal',
    data () {
      return {
        available: false,
        type: this.$options.modalData.type ? this.$options.modalData.type : 'default',
        header: this.$options.modalData.header,
        showFooter: this.$options.modalData.showFooter === undefined || this.$options.modalData.showFooter,
        confirmModal: this.$options.modalData.isConfirmModal,
        confirmCallback: this.$options.confirmCallback
      }
    },
    mounted () {
      this.available = true
    },
    updated () {
      if (this.available) {
        this.appendContent()
      } else {
        this.$destroy()
      }
    },
    methods: {
      appendContent () {
        const _this = this
        let promise
        if (this.$options.modalData.content && !this.$options.modalData.cachedData) {
          if (typeof this.$options.modalData.content === 'string') {
          } else if (typeof this.$options.modalData.content === 'function') {
            // do function
            promise = new Promise(this.$options.modalData.content).then(function (Component) {
              return (_this.$options.modalData.cachedData = Vue.extend(Component))
            })
          } else {
            promise = Promise.resolve(this.$options.modalData.content).then(function (Component) {
              return (_this.$options.modalData.cachedData = Vue.extend(Component))
            })
          }
        } else if (this.$options.modalData.cachedData) {
          promise = Promise.resolve(this.$options.modalData.cachedData)
        }
        if (!promise) {
          // string content
          this.$refs.contentWrapEl.innerHTML = this.$options.modalData.content
        } else {
          promise.then(function (Component) {
            new Component().$mount(_this.$refs.contentWrapEl)
          })
        }
      },
      closeModal () {
        this.available = false
      },
      confirm () {
        if (this.confirmCallback && typeof this.confirmCallback === 'function') {
          this.confirmCallback()
        }
        this.closeModal()
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  @import "../../scss/import.scss";

  .modal {
    display: block;
    .modal-dialog {
      .modal-content {
        .modal-header {
          color: #fff;
          border-top-left-radius: 6px;
          border-top-right-radius: 6px;
        }
      }
    }
    &.default {
      .modal-dialog {
        .modal-content {
          .modal-header {
            color: #000000;
          }
        }
      }
    }
    &.primary {
      .modal-dialog {
        .modal-content {
          .modal-header {
            background: $brand-primary;
          }
        }
      }
    }
    &.success {
      .modal-dialog {
        .modal-content {
          .modal-header {
            background: $brand-success;
          }
        }
      }
    }
    &.info {
      .modal-dialog {
        .modal-content {
          .modal-header {
            background: $brand-info;
          }
        }
      }
    }
    &.danger {
      .modal-dialog {
        .modal-content {
          .modal-header {
            background: $brand-danger;
          }
        }
      }
    }
  }

  .fade-down-enter-active, .fade-down-leave-active {
    transition: all .4s;
  }

  .fade-down-enter-active, .fade-down-leave {
    transform: none;
    opacity: 1;
  }

  .fade-down-enter, .fade-down-leave-active {
    opacity: 0;
    transform: translate3d(0, -20%, 0);
  }

</style>
