<template>
  <div>
    <BankSelect ref="BankSelection"
                :bank-type-list="bankTypeList"
                :bank-list="bankList"
                @bankTypeChanged="handleBankTypeChanged"
                @dataBeginSelect="dataBeginSelect"
                @dataEndSelect="dataEndSelect"
                @queryClick="handleBankStatQuery"
                @BankTypeClose="handleBankTypeClose"
                @BankChanged="handleBankChanged"
                @BankClose="handleBankClose" />
    <Card style="margin-top: 5px">
      <div>
        <tree-map ref="bankOverviewMap"
                    @mapClick="mapClickId"
                     style="height: 500px" />
      </div>
    </Card>
  </div>
</template>

<script>
import { TreeMap } from '_c/charts'
import { getTreeData } from '@/api/home-stat'

import { ChartHorizBar } from '_c/charts'
import { ChartBar } from '_c/charts'
import { ChartPie } from '_c/charts'
import { RosePie } from '_c/charts'
import BankSelect from '@/components/selection/BankSelect.vue'
import { getBankTypeList } from '@/api/bank-stat'
import { getBankList } from '@/api/bank-stat'
import { getMultiStat } from '@/api/bank-stat'
import { getCustTableData } from '@/api/bank-stat'
// import { getGroupRank } from '@/api/bank-stat'
import Tables from '_c/tables'

export default {
  name: 'HomeStat',
  components: {
    TreeMap,
    ChartBar,
    ChartPie,
    BankSelect,
    ChartHorizBar,
    RosePie,
    getBankTypeList,
    getBankList,
    getMultiStat,
    getTreeData,
    getCustTableData,
    // getGroupRank,
    Tables
  },
  data() {
    return {
      spinShow: false,
      columns2: [
        {
          title: '序号',
          key: 'rank',
          align: 'center',
          width: 200,
          render: (h, params) => {
          return h('span', (this.currentPage2 - 1) * this.pageSize2 + params.row._index + 1)
        }
        },
        {
          title: '客户名称',
          key: 'name'
        },
        {
          title: '贷款金额',
          key: 'money'
        },
        {
          title: '贷款笔数',
          key: 'num'
        }
      ],
      tableData1: [],
      totalNum1: 0,
      currentPage1: 1,
      pageSize1: 10,
      tableData2: [],
      totalNum2: 0,
      currentPage2: 1,
      pageSize2: 10,
      bankOrg: '',
      bankTypeValue: '',
      monthBegin: '',
      monthEnd: '',
      bankTypeList: [],
      bankList: [],
      busiData: [],
      LoanData: [],
      assureData: [],
      industryData: [],
      groupBarData: [],
      custBarData: [],
      treeData: [],
      LoanTitle: '贷款发放方式贷款金额',
      assureTitle: '担保方式贷款金额',
      busiTitle: '业务品种贷款金额',
      industryTitle: '行业类型贷款金额',
      groupBarTitle: '新发贷款客户排名',
      custBarTitle: '新发贷款客户排名',
      cstGrid: [{ left: 130, right: 30, bottom: 160 }],
      searchcolumns: ['name'],
      groupKey: '',
      groupValue: '',
      custKey: '',
      custValue: '',
      spinShow: false
    }
  },
  mounted() {
    this.getBankTypeList()
    this.getBankList()

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
    if(currMonth < 1) {
      defaultBegin = currYear - 1 + '01'
      defaultMon = currYear - 1 + '12' 
    }
    this.$refs.BankSelection.getStartMonth(defaultBegin, defaultMon)

    this.updateTreeMap()
    this.refreshCustTable()
    // this.refreshGroupTable()
  },
  methods: {
    mapClickId(params){
    //   this.$refs.BankSelection.bankOrg = []
    //   if(params.data.children){
    //     this.$refs.BankSelection.bankTypeValue.push(params.data.id)
    //     this.updateBankData()
    //     this.refreshCustTable()
    //   }else{
    //     this.$refs.BankSelection.bankOrg.push(params.data.id)
    //     this.updateBankData()
    //     this.refreshCustTable()
    //   }
    },
    updateTreeMap(){
      getTreeData(
        this.monthBegin,
        this.monthEnd,
        this.$refs.BankSelection.bankTypeValue,
        this.$refs.BankSelection.bankOrg
      ).then((res) => {
        console.log(res)
        if (res) {
          this.$refs.bankOverviewMap.refresh(res.data)
        }
      })
    },
    handleCustClear(val) {
      if (val === '') {
        this.custKey = ''
        this.custValue = ''
        this.refreshCustTable()
      }
    },
    handleCustSearch(val) {
      this.custKey = val.searchKey
      this.custValue = val.searchValue
      this.currentPage2 = 1
      this.refreshCustTable()
    },
    handleBankChanged() {
      this.$refs.BankSelection.tag_bankList = []
      var values = this.$refs.BankSelection.bankOrg
      if (values !== '') {
        values.forEach((v, i) => {
          this.bankList.forEach((x, j) => {
            if (x.value === v) {
              this.$refs.BankSelection.tag_bankList.push(x.label)
            }
          })
        })
      }
    },
    handleBankClose(name) {
      const index = this.$refs.BankSelection.tag_bankList.indexOf(name)
      this.$refs.BankSelection.tag_bankList.splice(index, 1)
      this.bankList.forEach((x, j) => {
        if (x.label === name) {
          var index2 = this.$refs.BankSelection.bankOrg.indexOf(x.value)
          this.$refs.BankSelection.bankOrg.splice(index2, 1)
        }
      })
    },
    handleBankTypeClose(name) {
      const index = this.$refs.BankSelection.tag_bankTypeList.indexOf(name)
      this.$refs.BankSelection.tag_bankTypeList.splice(index, 1)
      this.bankTypeList.forEach((x, j) => {
        if (x.label === name) {
          var index2 = this.$refs.BankSelection.bankTypeValue.indexOf(x.value)
          this.$refs.BankSelection.bankTypeValue.splice(index2, 1)
        }
      })
    },
    handleBankStatQuery() {
      if (this.monthBegin > this.monthEnd) {
        this.$Message.warning({
          content: '开始日期不能大于结束日期!',
          duration: 10,
          closable: true
        })
        return
      }
      this.updateTreeMap()
      this.updateBankData()
      this.custKey = ''
      this.custValue = ''
      this.groupKey = ''
      this.groupValue = ''
      this.refreshCustTable()
      // this.refreshGroupTable()
      // this.$refs.bankOverviewMap.refresh()
    },
    dataBeginSelect(monthBegin) {
      this.monthBegin = monthBegin.replace('-', '')
    },
    dataEndSelect(monthEnd) {
      this.monthEnd = monthEnd.replace('-', '')
    },
    rowClassName(row, index) {
      if (index === 1) {
        return 'demo-table-info-row'
      } else if (index === 3) {
        return 'demo-table-error-row'
      }
      return ''
    },
    handleClose() {
      this.show = false
    },
    bankType(model1) {
      this.model1 = model1
    },
    getBankTypeList() {
      getBankTypeList().then((res) => {
        if (res) {
          var data = res.data
          // this.bankTypeList.push({ value: "", label: "全部" });
          this.model1 = ''
          for (var i = 0; i < data.length; i++) {
            this.bankTypeList.push({
              value: data[i].type_id, //TYPE_ID
              label: data[i].type_name //TYPE_NAME
            })
          }
        }
      })
    },
    getBankList(bankTypeValue) {
      getBankList(bankTypeValue).then((res) => {
        if (res) {
          // this.bankOrg = ''
          this.bankList = []
          var data = res.data
          for (var i = 0; i < data.length; i++) {
            this.bankList.push({
              value: data[i].bank_id,//BANK_ID
              label: data[i].bank_name //BANK_NAME
            })
          }
        }
      })
    },
    handleBankTypeChanged(bankTypeValue) {
      this.getBankList(bankTypeValue)
      this.$refs.BankSelection.tag_bankTypeList = []
      var values = this.$refs.BankSelection.bankTypeValue
      values.forEach((v, i) => {
        this.bankTypeList.forEach((x, j) => {
          if (x.value === v) {
            this.$refs.BankSelection.tag_bankTypeList.push(x.label)
          }
        })
      })
    },
    refreshCustTable() {
      getCustTableData(
        this.monthBegin,
        this.monthEnd,
        0,
        0,
        0,
        0,
        this.$refs.BankSelection.bankTypeValue,
        this.$refs.BankSelection.bankOrg,
        this.custKey,
        this.custValue,
        this.currentPage2,
        this.pageSize2
      ).then((res) => {
        this.tableData2 = []
        var data = res.data.records
        this.totalNum2 = res.data.total
        for (var i = 0; i < data.length; i++) {
          this.tableData2.push({
            rank: data[i].rank,
            name: data[i].customerName,
            money: data[i].amt.toFixed(2) + ' 万元',
            num: data[i].count + ' 笔'
          })
        }
      })
    },
    handlePageChange2(pageNum) {
      this.currentPage2 = pageNum
      this.refreshCustTable()
    },
    handlePageSizeChange2(pageSize) {
      this.pageSize2 = pageSize
      this.currentPage2 = 1
      this.refreshCustTable()
    },
    updateBankData() {
      this.spinShow = true
        // console.log(this.$refs.BankSelection.bankTypeValue)
        // console.log(this.$refs.BankSelection.bankOrg)
      getMultiStat(
        this.monthBegin,
        this.monthEnd,
        this.$refs.BankSelection.bankTypeValue,
        this.$refs.BankSelection.bankOrg
      ).then((res) => {
        this.LoanData = []
        this.assureData = []
        this.industryData = []
        this.busiData = []
        this.treeData = []
        this.custBarData = []
        // this.groupBarData = []
        if (res) {
          res.data.forEach((v, i) => {
            if (v.dataDim === 'loanWay') {
              this.LoanData.push({
                name: v.typeDesc,
                value: v.balance.toFixed(2)
              })
            } else if (v.dataDim === 'assure') {
              this.assureData.push({
                name: v.typeDesc,
                value: v.balance.toFixed(2)
              })
            } else if (v.dataDim === 'business') {
              this.busiData.push({
                name: v.typeDesc,
                value: v.balance.toFixed(2)
              })
            } else if (v.dataDim === 'industry') {
              this.industryData.push({
                name: v.typeDesc,
                value: v.balance.toFixed(2)
              })
            } else if (v.dataDim === 'customer') {
              this.custBarData.push({
                name: v.typeDesc,
                value: v.balance.toFixed(2)
              })
            }
            // else if (v.dataDim === 'custGroup') {
            //   this.groupBarData.push({
            //     name: v.typeDesc,
            //     value: v.balance.toFixed(2)
            //   })
            // }
          })
          // this.$refs.bankLoanOverview.refresh(this.LoanData)
          // this.$refs.bankassureOverview.refresh(this.assureData)
          // this.$refs.bankindustryOverview.refresh(this.industryData)
          // this.$refs.bankbusiOverview.refresh(this.busiData)
          // this.$refs.custRankOverview.refresh(this.custBarData)
          // this.$refs.groupRankOverview.refresh(this.groupBarData)
        }
      })
    }
  }
}
</script>

<style lang="less">
@import "./home-stat.less";
</style>
