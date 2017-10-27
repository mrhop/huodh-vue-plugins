<template>
  <div class="chart-wrapper" :style="styleObject">
    <canvas ref="chartInstance" :id="id"/>
  </div>
</template>
<script>
  import Chart from 'chart.js'
  export default {
    name: 'v-chart',
    data () {
      return {
        id: 'chart-' + (this.chartId || new Date().getTime()),
        chart: undefined,
        styleObject: {
          width: this.chartWidth || '100%',
          background: this.chartBackground || '#ddd'
        }
      }
    },
    props: ['chartConfig', 'chartId', 'chartTrigger', 'chartWidth', 'chartBackground'],
    /* eslint-disable no-undef */
    mounted () {
      this.chart = new Chart(this.$refs.chartInstance, this.chartConfig)
    },
    updated () {
    },
    beforeDestroy () {
      this.chart.destroy()
    },
    watch: {
      chartTrigger: function (val, oldVal) {
        this.chart.data = this.chartConfig.data
        this.chart.update()
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">

</style>
