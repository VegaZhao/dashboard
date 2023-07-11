<template>
  <Card>
    <row>
      <i-col span="8">
        <label>起始月份：</label>
        <DatePicker :value="monthBegin"
                    type="month"
                    style="width:250px"
                    @on-change="handleBegin" />
      </i-col>
      <i-col span="8">
        <label>结束月份：</label>
        <Date-picker :value="monthEnd"
                     type="month"
                     style="width:250px"
                     @on-change="handleEnd" />
      </i-col>
      <i-col span="8">
        <Button style="float:right"
                type="primary"
                @click="handleClick">查询</Button>
      </i-col>
    </row>
  </Card>
</template>

<script>

export default {
  data() {
    return {
      monthBegin: '',
      monthEnd: ''
    }
  },
  mounted() {

  },
  methods: {
    handleClick() {
      this.$emit('queryClick')
    },
    handleBegin(data) {
      this.monthBegin = data
      this.$emit('dataBeginSelect', this.monthBegin)
    },
    handleEnd(data) {
      this.monthEnd = data
      this.$emit('dataEndSelect', this.monthEnd)
    },
    getStartMonth(start,end) {
      this.monthBegin = start
      this.monthEnd = end
      this.$emit('dataBeginSelect', this.monthBegin)
      this.$emit('dataEndSelect', this.monthEnd)
    }
  }
}
</script>
