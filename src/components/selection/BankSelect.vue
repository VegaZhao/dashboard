<template>
  <Card>
    <row>
      <i-col span="4">
        <label>起始月份：</label>
        <Date-picker
          type="month"
          style="width: 120px"
          :value="monthBegin"
          @on-change="handleBegin"
        />
      </i-col>
      <i-col span="4">
        <label>结束月份：</label>
        <Date-picker
          type="month"
          style="width: 120px"
          :value="monthEnd"
          @on-change="handleEnd"
        />
      </i-col>
      <i-col span="7">
        <label>机构大类：</label>
        <Select
          v-model="bankTypeValue"
          style="width: 230px"
          placeholder="全部"
          @on-change="bankTypeSelect"
          filterable
          multiple
          :max-tag-count="1"
        >
          <Option
            v-for="item in bankTypeList"
            :value="item.value"
            :key="item.value"
            >{{ item.label }}</Option
          >
        </Select>
        <Button
          @click="bankTypeDrawer = true"
          type="text"
          icon="md-list"
          shape="circle"
        ></Button>
        <Drawer
          title="选中机构大类"
          :closable="false"
          v-model="bankTypeDrawer"
          width="356"
        >
          <Button
            type="primary"
            icon="md-refresh"
            shape="circle"
            style="display: block; margin-bottom: 10px"
            @click="clearBankTypeSelect"
            >重置</Button
          >
          <Tag
            v-for="(item, key) in tag_bankTypeList"
            :key="key"
            :name="item"
            closable
            @on-close="handleBankTypeClose"
            >{{ item }}</Tag
          >
        </Drawer>
      </i-col>
      <i-col span="7">
        <label>银行机构：</label>
        <Select
          v-model="bankOrg"
          style="width: 230px"
          placeholder="全部"
          @on-change="bankSelect"
          multiple
          filterable
          :max-tag-count="1"
        >
          <Option
            v-for="item in bankList"
            :value="item.value"
            :key="item.value"
            >{{ item.label }}</Option
          >
        </Select>
        <Button
          @click="bankDrawer = true"
          type="text"
          icon="md-list"
          shape="circle"
        ></Button>
        <Drawer
          title="选中银行机构"
          :closable="false"
          v-model="bankDrawer"
          width="356"
        >
          <Button
            type="primary"
            icon="md-refresh"
            shape="circle"
            style="display: block; margin-bottom: 10px"
            @click="clearBankSelect"
            >重置</Button
          >
          <Tag
            v-for="(item, key) in tag_bankList"
            :key="key"
            :name="item"
            closable
            @on-close="handleBankClose"
            >{{ item }}</Tag
          >
        </Drawer>
      </i-col>
      <i-col span="2">
        <Button style="float: right" type="primary" @click="handleClick"
          >查询</Button
        >
      </i-col>
    </row>
  </Card>
</template>
<script>
export default {
  props: {
    bankTypeList: {
      type: Array,
      default: null,
    },
    bankList: {
      type: Array,
      default: "",
    },
  },
  data() {
    return {
      bankTypeValue: [],
      bankOrg: [],
      monthBegin: "",
      monthEnd: "",
      bankTypeDrawer: false,
      bankDrawer: false,
      tag_bankTypeList: [],
      tag_bankList: []
    };
  },
  methods: {
    handleClick() {
      this.$emit("queryClick");
    },
    bankTypeSelect() {
      this.$emit("bankTypeChanged", this.bankTypeValue);
      this.bankOrg = "";
    },
    handleBegin(data) {
      this.monthBegin = data;
      this.$emit("dataBeginSelect", this.monthBegin);
    },
    handleEnd(data) {
      this.monthEnd = data;
      this.$emit("dataEndSelect", this.monthEnd);
    },
    getStartMonth(start, end) {
      this.monthBegin = start;
      this.monthEnd = end;
      this.$emit("dataBeginSelect", this.monthBegin);
      this.$emit("dataEndSelect", this.monthEnd);
    },
    bankSelect() {
      if (this.bankOrg.length === 0) {
        this.bankOrg = "";
      }
      this.$emit("BankChanged");
    },
    handleBankTypeClose(e, name) {
      this.$emit("BankTypeClose", name);
    },
    handleBankClose(e, name) {
      this.$emit("BankClose", name);
    },
    clearBankTypeSelect() {
      this.tag_bankTypeList = [];
      this.bankTypeValue = "";
    },
    clearBankSelect() {
      this.tag_bankList = [];
      this.bankOrg = "";
    }
  },
};
</script>
