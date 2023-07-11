<style lang="less">
@import "~@/view/stat/stat.less";
@import "~@/view/stat/profile-stat/profile-stat.less";
</style>

<template>
  <div>
    <!-- 查询栏面板 -->
    <Card>
      <row>
        <i-col span="14">
          <label>系统名称：</label>
          <Select v-model="custValue"
                  :remote-method="getSecondNodeListByTypeAndName"
                  :loading="secondNodeLoading"
                  filterable
                  style="width: 280px">
            <Option v-for="item in custList"
                    :value="item.label"
                    :key="item.label">{{ item.label }}</Option>
          </Select>
        </i-col>
        <i-col span="8">
          <Button
            style="float: right"
            type="primary"
            @click="handleBankStatQuery"
            >查询</Button
          >
        </i-col>
      </row>
    </Card>
    <!-- 系统概况 -->
    <Card class="overview" style="margin-top: 5px">
      <div class="title">
        <p>{{systemName}}</p>
      </div>
      <div class="content">
        <div class="left">
          <ul>
            <li>等级保护级别:<span>三级</span></li>
            <li>开发负责人:<span>贾小铮</span></li>
            <li>交付保障负责人:<span>陈海山</span></li>
            <li>证书30内过期:<span>否</span></li>
          </ul>
        </div>
        <div class="middle">
          <ul>
            <li>历史漏洞数:<span>高危5个</span><span>中危7个</span><span>低危12个</span></li>
            <li>现存漏洞数:<span>高危1个</span><span>中危3个</span><span>低危6个</span></li>
            <li>历史安全事件:<span>2起</span></li>
            <li>本月安全事件:<span>0起</span></li>
          </ul>
        </div>
        <div class="right">
          <ul>
            <li>漏洞开源组件:<span>高危5个</span><span>中危7个</span><span>低危12个</span></li>
            <li>安全基线符合率:<span>85%</span></li>
          </ul>
        </div>
      </div>
    </Card>
    <!-- 内容面板 -->
    <Card style="margin-top: 5px">
      <Tabs value="nm_vul">
        
        <!-- 安全事件tab -->
        <TabPane label="安全事件"
                 name="nm_event">
        </TabPane>
        <!-- 历史漏洞tab -->
        <TabPane label="历史漏洞"
                 name="nm_vul">
          <!-- 表格 -->
          <div>
            <tables
              toolbar-enable
              editable
              border
              searchable
              operation-enable
              stripe
              toolbar-place="top"
              :searchcolumns="searchcolumns"
              @on-clear="handleClear"
              @on-search="handleSearch"
              :columns="columns_v"
              v-model="tableData_v"
            >
              <!-- 换页 -->
              <div slot="footer" style="float: right; margin-right: 10px">
                <Page
                  :total="totalNum"
                  :current="currentPage"
                  :page-size="pageSize"
                  :transfer="true"
                  show-elevator
                  show-sizer
                  show-total
                  @on-change="handlePageChange"
                  @on-page-size-change="handlePageSizeChange"
                />
              </div>
            </tables>
          </div>
        </TabPane>
      </Tabs>
    </Card>
    <BackTop />
  </div>
</template>

<script>
import { ChartLine } from "_c/charts";
import { getCustomerLineData } from "@/api/customer-expire";
import { getCustomerTable } from "@/api/customer-expire";
import { getCustomerTableData } from "@/api/customer-expire";
import Tables from "_c/tables";

export default {
  name: "CustExp",
  components: {
    ChartLine,
    Tables,
  },
  data() {
    return {
      systemName: '个人网银系统',
      columns_v: [
        {
          title: "序号",
          key: "id",
        },
        {
          title: "漏洞名称",
          key: "title",
        },
        {
          title: "漏洞描述",
          key: "description",
        },
        {
          title: "漏洞等级",
          key: "severity",
        },
        {
          title: "漏洞来源",
          key: "disc_resource",
        },
        {
          title: "漏洞分类",
          key: "category",
        },
        {
          title: "业务功能场景",
          key: "func_scene",
        },
        {
          title: "漏洞发现时间",
          key: "disc_date",
        },
        {
          title: "修复状态",
          key: "repaire_status",
        },
        {
          title: "修复日期",
          key: "repaired_date",
        },
        {
          title: "漏洞发现人",
          key: "discoverer",
        },
        {
          title: "备注",
          key: "remarks",
        },
      ],
      tableData_v: [1, '电子签章管理系统', '2022众测（第一轮次）', '未授权访问', '其他', '电子签章管理系统存在springboot未授权漏洞导致密钥泄露', 'springboot路径下存在未授权访问，能够下载其内存文件导致密钥泄露', '中危', '2022-11-14', '已修复', null, '安全厂商', null],
      currentPage: 1,
      pageSize: 10,
      tableMoney: 0,
      searchcolumns: ["title", "category"],
      searchKey: "",
      searchValue: "",
    };
  },
  mounted() {
    this.refreshTable();
  },
  methods: {
    handleBankStatQuery() {
      if (this.dateBegin > this.dateEnd) {
        this.$Message.warning({
          content: "开始日期不能大于结束日期!",
          duration: 10,
          closable: true,
        });
        return;
      }
      this.refreshTable();
    },
    refreshTable() {
      getCustomerTable(
        this.dateBegin.replace(/-/g, ""),
        this.dateEnd.replace(/-/g, ""),
        this.dueDate,
        this.searchKey,
        this.searchValue,
        this.currentPage,
        this.pageSize
      ).then((res) => {
        this.tableData_v = [1, '电子签章管理系统', '2022众测（第一轮次）', '未授权访问', '其他', '电子签章管理系统存在springboot未授权漏洞导致密钥泄露', 'springboot路径下存在未授权访问，能够下载其内存文件导致密钥泄露', '中危', '2022-11-14', '已修复', null, '安全厂商', null];
        this.tableData = [];
        var data = res.data.records;
      });
    },
    handlePageChange(pageNum) {
      this.currentPage = pageNum;
      this.refreshTable();
      this.currentPage = 1; //表更新后重置当前页
    },
    handlePageSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.refreshTable();
    },
    handleClear(val) {
      if (val === "") {
        (this.searchKey = ""), (this.searchValue = ""), this.refreshTable();
      }
    },
    handleSearch(val) {
      (this.searchKey = val.searchKey),
        (this.searchValue = val.searchValue),
        (this.currentPage = 1),
        this.refreshTable();
      // console.log(this.searchKey)
      // console.log(this.searchValue)
    },
  },
};
</script>
