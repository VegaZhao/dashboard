<template>
  <row>
    <i-col span="6">
      <label>机构大类：</label>
      <Select v-model="model1" style="width:200px" placeholder="全部" filterable=true>
        <Option v-for="item in bankTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
    </i-col>
    <!-- <i-col span="6">
      <label>银行机构：</label>
      <Select v-model="model2" style="width:200px" placeholder="全部">
        <Option v-for="item in bankList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
    </i-col> -->
    <i-col span="8">
      <label>银行机构：</label>
      <Select style="width:300px" 
              placeholder="全部" 
              v-model="model2" 
              multiple 
              :max-tag-count="2" 
              :max-tag-placeholder="maxTagPlaceholder"
              filterable
      >
          <Option v-for="item in bankList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
    </i-col>
    <i-col span="4">
      <Button type="primary" @click="handleBankStatQuery">查询</Button>
    </i-col>
  </row>
</template>
<script>

export default {
  data() {
    return {
      bankTypeList: [
        {
          value: '00',
          label: '全部'
        },
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
          value: '00',
          label: '全部'
        },
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
  },
  methods: {
    maxTagPlaceholder (num) {
        return 'more '+ num;
    }
}
}
</script>
