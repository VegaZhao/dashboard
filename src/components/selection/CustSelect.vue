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
      <!-- <i-col span="7">
        <label>集团：</label>
        <Select
          v-model="groupValue"
          style="width: 250px"
          placeholder="全部"
          multiple
          filterable
          :max-tag-count="1"
          @on-change="handleGroupSelect"
        >
          <Option
            v-for="item in groupList"
            :value="item.label"
            :key="item.label"
            >{{ item.label }}</Option
          >
        </Select>
        <Button
          @click="groupDrawer = true"
          type="text"
          icon="md-list"
          shape="circle"
        ></Button>
        <Drawer
          title="选中集团"
          :closable="false"
          v-model="groupDrawer"
          width="356"
        >
          <Button
            type="primary"
            icon="md-refresh"
            shape="circle"
            style="display: block; margin-bottom: 10px"
            @click="clearGroupSelect"
            >重置</Button
          >
          <Tag
            v-for="(item, key) in tag_groupList"
            :key="key"
            :name="item"
            closable
            @on-close="handleGroupClose"
            >{{ item }}</Tag
          >
        </Drawer>
      </i-col> -->
      <i-col span="14">
        <label>公司：</label>
        <Select
          v-model="custValue"
          style="width: 250px"
          placeholder="全部"
          multiple
          filterable
          :max-tag-count="1"
          @on-change="handleCustSelect"
        >
          <Option
            v-for="item in custList"
            :value="item.label"
            :key="item.label"
            >{{ item.label }}</Option
          >
        </Select>
        <Button
          @click="custDrawer = true"
          type="text"
          icon="md-list"
          shape="circle"
        ></Button>
        <Drawer
          title="选中公司"
          :closable="false"
          v-model="custDrawer"
          width="356"
        >
          <Button
            type="primary"
            icon="md-refresh"
            shape="circle"
            style="display: block; margin-bottom: 10px"
            @click="clearCustSelect"
            >重置</Button
          >
          <Tag
            v-for="(item, key) in tag_custList"
            :key="key"
            :name="item"
            closable
            @on-close="handleCustClose"
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
    groupList: {
      type: Array,
      default: null,
    },
    custList: {
      type: Array,
      default: "",
    },
  },
  data() {
    return {
      groupValue: "",
      custValue: "",
      monthBegin: "",
      monthEnd: "",
      groupDrawer: false,
      custDrawer: false,
      tag_groupList: [],
      tag_custList: [],
    };
  },
  methods: {
    getStartMonth(start) {
      this.monthBegin = start;
      this.monthEnd = start;

      this.$emit("dataBeginSelect", this.monthBegin);
      this.$emit("dataEndSelect", this.monthEnd);

    },
    handleBegin(data) {
      this.monthBegin = data;
      this.$emit("dataBeginSelect", this.monthBegin);
    },
    handleEnd(data) {
      this.monthEnd = data;
      this.$emit("dataEndSelect", this.monthEnd);
    },
    handleClick() {
      this.$emit("queryClick");
    },
    // handleGroupSelect() {
    //   this.$emit("GroupChanged");
    // },
    handleCustSelect() {
      this.$emit("CustChanged");
    },
    // handleGroupClose(e, name) {
    //   this.$emit("GroupClose", name);
    // },
    handleCustClose(e, name) {
      this.$emit("CustClose", name);
    },
    // clearGroupSelect() {
    //   this.tag_groupList = [];
    //   this.groupValue = "";
    // },
    clearCustSelect() {
      this.tag_custList = [];
      this.custValue = "";
    },
  },
};
</script>
