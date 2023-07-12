<template>
  <div>
    <Card>
      <row>
        <i-col span="4">
          <label>起始月份：</label>
          <Date-picker :value="monthBegin"
                       type="month"
                       style="width: 120px"
                       @on-change="handleBegin" />
        </i-col>
        <i-col span="4">
          <label>结束月份：</label>
          <Date-picker :value="monthEnd"
                       type="month"
                       style="width: 120px"
                       @on-change="handleEnd" />
        </i-col>
        <i-col span="14">
          <label>公司：</label>
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
        <i-col span="2">
          <Button style="float: right"
                  type="primary"
                  @click="handleCustRelatQuery">查询</Button>
        </i-col>
      </row>
    </Card>
    <Card style="margin-top: 5px">
      <Tabs value="name2">
        <TabPane label="贷款机构"
                 name="name2">
          <Table :columns="columnsBank"
                 :data="loanBankData"
                 :row-class-name="rowClassName"
                 stripe>
            <div slot="footer"
                 style="float: right; margin-right: 10px">
              <Page :total="totalNumBk"
                    :current="currentPageBk"
                    :page-size="pageSizeBk"
                    :transfer="true"
                    show-elevator
                    show-sizer
                    show-total
                    @on-change="handlePageChangeBk"
                    @on-page-size-change="handlePageSizeChangeBk" />
            </div>
          </Table>
        </TabPane>
        <TabPane label="关联客户"
                 name="name1">
          <Table :columns="columnsCmp"
                 :data="relatedData"
                 stripe>
            <div slot="footer"
                 style="float: right; margin-right: 10px">
              <Page :total="totalNum"
                    :current="currentPage"
                    :page-size="pageSize"
                    :transfer="true"
                    show-elevator
                    show-sizer
                    show-total
                    @on-change="handlePageChange"
                    @on-page-size-change="handlePageSizeChange" />
            </div>
          </Table>
        </TabPane>
      </Tabs>
    </Card>
    <BackTop />
    <Spin v-if="spinShow"
          size="large"
          fix />
  </div>
</template>

<script>
import { getCustList } from '@/api/customer-stat'
import { getCustomerRelat } from '@/api/customer-stat'
import { getCustLoanBank } from '@/api/customer-stat'
import { getCustIssueMoneySum } from '@/api/customer-stat'
import { getRelatIssueMoneySum } from '@/api/customer-stat'

export default {
  name: 'CustRelat',
  components: {
    getCustList,
    getCustLoanBank,
    getCustIssueMoneySum,
    getRelatIssueMoneySum
  },
  data() {
    return {
      spinShow: false,
      monthBegin: '',
      monthEnd: '',
      custValue: '',
      custList: [],
      columnsCmp: [
        {
          title: '客户名称',
          key: 'compname'
        },
        {
          title: '上报机构名称',
          key: 'bankname'
        },
        {
          title: '发放日期',
          key: 'loandate'
        },
        {
          title: '到期日期',
          key: 'paydate'
        },
        {
          title: '贷款金额',
          key: 'loanamt'
        }
      ],
      columnsBank: [
        {
          title: '上报机构名称',
          key: 'bankname'
        },
        {
          title: '发放日期',
          key: 'bloandate'
        },
        {
          title: '到期日期',
          key: 'bpaydate'
        },
        {
          title: '贷款金额',
          key: 'bloanamt'
        }
      ],
      relatedData: [],
      loanBankData: [],
      totalNum: 0,
      currentPage: 1,
      pageSize: 10,
      totalNumBk: 0,
      currentPageBk: 1,
      pageSizeBk: 10,
      bankSumAmt: 0,
      relatSumAmt: 0,
      secondNodeLoading: false

    }
  },
  mounted() {
    // selection default month
    var now = new Date()
    var defaultMon = 'YYYYMM'
    var currYear = now.getFullYear()
    var defaultBegin = currYear + '01'
    var currMonth = now.getMonth()
    defaultMon = defaultMon.replace('YYYY', currYear)
    defaultMon = defaultMon.replace(
      'MM',
      currMonth > 9 ? currMonth : '0' + currMonth
    )

    if (currMonth < 1) {
      defaultBegin = currYear - 1 + '01'
      defaultMon = currYear - 1 + '12'
    }
    this.monthBegin = defaultBegin
    this.monthEnd = defaultMon
    // this.getCustList()

    // this.$refs.bankOverview.refresh();
  },
  methods: {
    handleBegin(monthBegin) {
      this.monthBegin = monthBegin.replace('-', '')
      // this.getCustList()
    },
    handleEnd(monthEnd) {
      this.monthEnd = monthEnd.replace('-', '')
      // this.getCustList()
    },
    getSecondNodeListByTypeAndName(name) {
      this.secondNodeLoading = true
      getCustList(this.monthBegin, this.monthEnd, name, 10).then((res) => {
        console.log(res)
        this.custList = []
        var data = res.data
        for (var i = 0; i < data.length; i++) {
          this.custList.push({
            value: data[i].CUSTCODE,
            label: data[i].CUSTNAME
          })
        }
        this.secondNodeLoading = false
      })
    },

    handlePageChange(pageNum) {
      this.currentPage = pageNum
      this.handleCustRelatQuery()
    },
    handlePageSizeChange(pageSize) {
      this.pageSize = pageSize
      this.handleCustRelatQuery()
    },
    handlePageChangeBk(pageNum) {
      this.currentPageBk = pageNum
      this.handleCustRelatQuery()
    },
    handlePageSizeChangeBk(pageSize) {
      this.pageSizeBk = pageSize
      this.handleCustRelatQuery()
    },
    handleCustRelatQuery() {
      if (this.monthBegin > this.monthEnd) {
        this.$Message.warning({
          content: '开始日期不能大于结束日期!',
          duration: 10,
          closable: true
        })
        return
      }
      if (this.custValue === '') {
        this.$Message.warning({
          content: '公司为必选项!',
          duration: 10,
          closable: true
        })
        return
      }
      // 获取客户贷款金额汇总
      getCustIssueMoneySum(this.monthBegin, this.monthEnd, this.custValue).then(
        (res) => {
          if (res) {
            this.bankSumAmt = res.data[0].amt
          }
        }
      )
      // 获取关联客户贷款金额汇总
      getRelatIssueMoneySum(this.monthBegin, this.monthEnd, this.custValue).then(
        (res) => {
          if (res) {
            if (res.data.length === 0) { this.relatSumAmt = 0 } else { this.relatSumAmt = res.data[0].amt }
          }
        }
      )
      // 获取后台关联客户数据
      this.spinShow = true
      getCustomerRelat(
        this.monthBegin,
        this.monthEnd,
        this.custValue,
        this.currentPage,
        this.pageSize
      ).then((res) => {
        if (res) {
          this.relatedData = []
          var data = res.data.records
          this.totalNum = res.data.total
          this.relatedData.push({
            compname: '合计',
            bankname: '-',
            loandate: '-',
            paydate: '-',
            loanamt: this.relatSumAmt + ' 万元'
          })
          for (var i = 0; i < data.length; i++) {
            this.relatedData.push({
              compname: data[i].customerName,
              bankname: data[i].bankName,
              loandate: data[i].startDate,
              paydate: data[i].dueDate,
              loanamt: data[i].issueMoney.toFixed(2) + ' 万元'
            })
          }
        }
      }).finally(() => { this.spinShow = false })
      // 获取后台贷款银行数据
      getCustLoanBank(
        this.monthBegin,
        this.monthEnd,
        this.custValue,
        this.currentPageBk,
        this.pageSizeBk
      ).then((res) => {
        if (res) {
          this.loanBankData = []
          var data = res.data.records
          this.totalNumBk = res.data.total
          this.loanBankData.push({
            bankname: '合计',
            bloandate: '-',
            bpaydate: '-',
            bloanamt: this.bankSumAmt + ' 万元'
          })
          for (var i = 0; i < data.length; i++) {
            this.loanBankData.push({
              bankname: data[i].bankName,
              bloandate: data[i].startDate,
              bpaydate: data[i].dueDate,
              bloanamt: data[i].issueMoney.toFixed(2) + ' 万元'
            })
          }
        }
      })
    },
    rowClassName(row, index) {
      if (index === 0) {
        return 'demo-table-info-row'
      }
      return ''
    }
  }
}
</script>

<style>
.ivu-table .demo-table-info-row td{
        background-color: #dcdee2;
        color: #17233d;
    }
</style>
