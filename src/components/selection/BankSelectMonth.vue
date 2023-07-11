<template>
  <row>
    <i-col span="4">
      <label>起始月份：</label>
      <Date-picker type="month" style="width: 100px"/>
    </i-col>
    <i-col span="4">
      <label>结束月份：</label>
      <Date-picker type="month" style="width: 100px"/>
    </i-col>
    <i-col span="4">
      <Button type="primary">查询</Button>
    </i-col>
  </row>
</template>
<script>

export default {
  data() {
    return {
      bankTypeList: [
        {
          value: '01',
          label: '政策性银行'
        },
        {
          value: '02',
          label: '大型银行'
        },
        {
          value: '03',
          label: '股份制银行'
        },
        {
          value: '04',
          label: '城商行'
        },
        {
          value: '05',
          label: '农村金融机构'
        },
        {
          value: '06',
          label: '非银机构'
        },
        {
          value: '07',
          label: '外资银行'
        }
      ],
      bankList: [
        {
          value: 'New York',
          label: 'New York'
        },
        {
          value: 'London',
          label: 'London'
        },
        {
          value: 'Sydney',
          label: 'Sydney'
        },
        {
          value: 'Ottawa',
          label: 'Ottawa'
        },
        {
          value: 'Paris',
          label: 'Paris'
        },
        {
          value: 'Canberra',
          label: 'Canberra'
        }
      ],
      model1: '',
      model2: ''
    }
  }
}
</script>
