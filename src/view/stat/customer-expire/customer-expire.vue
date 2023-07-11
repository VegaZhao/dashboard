<template>
  <div>
    <Card>
      <row>
        <i-col span="8">
          <label>开始日期：</label>
          <DatePicker
            :value="dateBegin"
            type="date"
            style="width: 250px"
            @on-change="handleBegin"
          />
        </i-col>
        <i-col span="8">
          <label>结束日期：</label>
          <Date-picker
            :value="dateEnd"
            type="date"
            style="width: 250px"
            @on-change="handleEnd"
          />
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
    <Card style="margin-top: 5px">
      <chart-line
        ref="lineView"
        @lineClick="lineClickTable"
        :value="lineData"
        :text="lineTitle"
        style="height: 500px"
      />
      <div>
        <tables
          toolbar-enable
          editable
          border
          searchable
          operation-enable
          stripe
          toolbar-place="top"
          :row-class-name="rowClassName"
          :searchcolumns="searchcolumns"
          @on-clear="handleClear"
          @on-search="handleSearch"
          :columns="columns1"
          v-model="tableData"
        >
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
      columns1: [
        {
          title: "客户名称",
          key: "compname",
        },
        {
          title: "上报机构名称",
          key: "bankname",
        },
        {
          title: "发放日期",
          key: "loandate",
        },
        {
          title: "到期日期",
          key: "paydate",
        },
        {
          title: "贷款金额",
          key: "loanamt",
        },
      ],
      tableData: [],
      lineTitle: "客户贷款到期数量图",
      lineData: [],
      dateBegin: "",
      dateEnd: "",
      dueDate: "",
      totalNum: 0,
      currentPage: 1,
      pageSize: 10,
      tableMoney: 0,
      searchcolumns: ["compname", "loandate"],
      searchKey: "",
      searchValue: "",
    };
  },
  mounted() {
    var now = new Date();
    var defaultDay = "YYYY-MM-DD";
    var currYear = now.getFullYear();
    var currMonth = now.getMonth() + 1;
    var currDay = now.getDate();
    defaultDay = defaultDay.replace("YYYY", currYear);
    defaultDay = defaultDay.replace(
      "MM",
      currMonth > 9 ? currMonth : "0" + currMonth
    );
    defaultDay = defaultDay.replace("DD", currDay);
    this.dateBegin = defaultDay;
    var endDay = "YYYY-MM-DD";
    var currYear = now.getFullYear();
    var currMonth = now.getMonth() + 4;
    var currDay = now.getDate();
    endDay = endDay.replace("YYYY", currYear);
    endDay = endDay.replace("MM", currMonth > 9 ? currMonth : "0" + currMonth);
    endDay = endDay.replace("DD", currDay);
    this.dateEnd = endDay;
    this.updateLineData();
    this.refreshTable();
  },
  methods: {
    handleBegin(data) {
      this.dateBegin = data;
    },
    handleEnd(data) {
      this.dateEnd = data;
    },
    handleBankStatQuery() {
      if (this.dateBegin > this.dateEnd) {
        this.$Message.warning({
          content: "开始日期不能大于结束日期!",
          duration: 10,
          closable: true,
        });
        return;
      }
      this.updateLineData();
      this.refreshTable();
    },
    refreshTable() {
      this.sumTableMoney();
      getCustomerTable(
        this.dateBegin.replace(/-/g, ""),
        this.dateEnd.replace(/-/g, ""),
        this.dueDate,
        this.searchKey,
        this.searchValue,
        this.currentPage,
        this.pageSize
      ).then((res) => {
        this.tableData = [];
        var data = res.data.records;
        this.totalNum = res.data.total;
        this.tableData.push({
          compname: "合计",
          bankname: "-",
          loandate: "-",
          paydate: "-",
          loanamt: this.tableMoney + " 万元",
        });
        for (var i = 0; i < data.length; i++) {
          this.tableData.push({
            compname: data[i].customerName,
            bankname: data[i].bankName,
            loandate: data[i].startDate,
            paydate: data[i].dueDate,
            loanamt: data[i].issueMoney.toFixed(2) + " 万元",
          });
        }
      });
    },
    sumTableMoney() {
      getCustomerTableData(
        this.dateBegin.replace(/-/g, ""),
        this.dateEnd.replace(/-/g, ""),
        this.dueDate,
        this.searchKey,
        this.searchValue
      ).then((res) => {
        this.tableMoney = 0;
        // console.log(res);
        if (res) {
          this.tableMoney = res.data[0].amt.toFixed(2);
        }
        // console.log(this.tableMoney);
      });
    },
    updateLineData() {
      getCustomerLineData(
        this.dateBegin.replace(/-/g, ""),
        this.dateEnd.replace(/-/g, "")
      ).then((res) => {
        this.lineData = [];
        if (res) {
          res.data.forEach((v, i) => {
            this.lineData.push({
              time: v.dueDate,
              value: v.loanNum,
              money: v.loanBalance.toFixed(2),
            });
          });
          this.$refs.lineView.refresh(this.lineData);
        }
      });
    },
    lineClickTable(name) {
      this.dueDate = name;
      this.refreshTable();
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
    rowClassName(row, index) {
      if (index === 0) {
        return "demo-table-info-row";
      }
      return "";
    },
  },
};
</script>

<style>
.ivu-table .demo-table-info-row td {
  background-color: #dcdee2;
  color: #17233d;
}
</style>