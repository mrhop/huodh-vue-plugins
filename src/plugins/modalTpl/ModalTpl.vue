<template>
  <transition name="fade-down">
    <div v-show="available" :class="['modal','huodh-vue-modal',this.type]" ref="modalWrapEl" @click="closeModal">
      <div class="modal-dialog" @click.stop>
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="closeModal"><span
              aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">
              <slot name="header"></slot>
            </h4>
          </div>
          <div class="modal-body">
            <slot name="body"></slot>
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
  // 完全使用tpl和slot的方式，通过传入值的方式决定show和not，然后是还有就是emit，这样就可以了，所以modaltpl还有form都需要一个emit
  export default {
    name: 'v-modal',
    data () {
      return {
        available: false
      }
    },
    props: {
      showFooter: {
        default: true
      },
      confirmModal: {
        default: false
      },
      type: {
        default: 'default'
      },
      trigger: {}
    },
    methods: {
      closeModal () {
        this.available = false
        this.$emit('closeEvent')
      },
      confirm () {
        this.available = false
        this.$emit('confirmEvent')
      }
    },
    watch: {
      trigger: function () {
        this.available = true
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  @import "../../scss/import.scss";

  .modal.huodh-vue-modal {
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
