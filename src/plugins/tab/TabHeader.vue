<template>
  <ul class="tab-header">
    <li v-for="(item, key, index) in items" :class="['tab-header-item',item.show ? 'selected' : '']" :key="key">
      <a v-on:click="clickToggle(key)"><span v-if="item.iconClass"
                                             :class="item.iconClass"/><span>{{item.title}}</span></a>
    </li>
  </ul>
</template>
<script>
  export default {
    name: 'v-table-header',
    props: ['items'],
    methods: {
      clickToggle (key) {
        this.items.forEach(function (item, index) {
          if (index === key) {
            item.show = true
          } else {
            item.show = false
          }
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  @import "../../scss/import.scss";
  .tab-header{
    list-style: none;
    padding-left: 0;
    background: $base-background;
    text-transform: capitalize;
    margin-bottom: 0;
    li{
      display: inline-block;
      padding: 5px 5px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      &.selected{
        background: darken($base-background,30%);
      }
    }
  }
</style>
