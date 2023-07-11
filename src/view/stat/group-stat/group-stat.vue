<template>
  <div>
    <Card>
      <row>
        <i-col span="4">
          <label>起始月份：</label>
          <Date-picker :value="monthBegin"
                       type="month"
                       style="width: 120px"
                       @on-change="dataBeginSelect" />
        </i-col>
        <i-col span="4">
          <label>结束月份：</label>
          <Date-picker :value="monthEnd"
                       type="month"
                       style="width: 120px"
                       @on-change="dataEndSelect" />
        </i-col>
        <i-col span="14">
          <label>集团：</label>
          <Select v-model="custValue"
                  :remote-method="getSecondNodeListByTypeAndName"
                  :loading="secondNodeLoading"
                  :max-tag-count="1"
                  filterable
                  style="width: 250px"
                  placeholder="全部"
                  multiple
                  @on-change="handleCustChanged">
            <Option v-for="item in custList"
                    :value="item.label"
                    :key="item.value">{{ item.label }}</Option>
          </Select>
          <Button type="text"
                  icon="md-list"
                  shape="circle"
                  @click="custDrawer = true" />
          <Drawer :closable="false"
                  v-model="custDrawer"
                  title="选中公司"
                  width="356">
            <Button type="primary"
                    icon="md-refresh"
                    shape="circle"
                    style="display: block; margin-bottom: 10px"
                    @click="clearCustSelect">重置</Button>
            <Tag v-for="item in tag_custList"
                 :key="item.value"
                 :name="item.label"
                 closable
                 @on-close="handleCustClose">{{ item.label }}</Tag>
          </Drawer>
        </i-col>
        <i-col span="2">
          <Button style="float: right"
                  type="primary"
                  @click="handleCustStatQuery">查询</Button>
        </i-col>
      </row>
    </Card>
    <Card style="margin-top: 5px">
      <div>
        <ec-tree-map ref="custOverviewMap"
                    @mapClick="mapClickName"
                     style="height: 500px" />
      </div>
    </Card>
    <Card class="row"
          style="margin-top: 5px">
      <div class="column">
        <chart-pie ref="bankbusiOverview"
                   :value="busiData"
                   :text="busiTitle"
                   style="height: 500px" />
      </div>
      <div class="column">
        <chart-bar ref="bankindustryOverview"
                   :value="industryData"
                   :text="industryTitle"
                   :grid="cstGrid"
                   style="height: 500px" />
      </div>
    </Card>
    <Card class="row"
          style="margin-top: 5px">
      <div class="column">
        <chart-horiz-bar ref="bankassureOverview"
                         :value="assureData"
                         :text="assureTitle"
                         style="height: 500px" />
      </div>
      <div class="column">
        <chart-pie ref="bankLoanOverview"
                   :value="LoanData"
                   :text="LoanTitle"
                   style="height: 500px" />
      </div>
    </Card>
    <Card style="margin-top: 5px">
      <div>
      <Tables :searchcolumns="searchcolumns"
                    :columns="columns2"
                    v-model="tableData2"
                    toolbar-enable
                    editable
                    border
                    searchable
                    operation-enable
                    stripe
                    toolbar-place="top"
                    @on-search="handleCustSearch"
                    @on-clear="handleCustClear">
              <div slot="footer"
                   style="float: right; margin-right: 10px">
                <Page :total="totalNum2"
                      :current="currentPage2"
                      :page-size="pageSize2"
                      :transfer="true"
                      show-elevator
                      show-sizer
                      show-total
                      @on-change="handlePageChange2"
                      @on-page-size-change="handlePageSizeChange2" />
              </div>
            </Tables>
      </div>
    </Card>
    <BackTop />

    <Spin v-if="spinShow"
          size="large"
          fix />
  </div>
</template>

<script>
import { EcTreeMap } from '_c/charts'
import { ChartHorizBar } from '_c/charts'
import { ChartBar } from '_c/charts'
import { ChartPie } from '_c/charts'
import { RosePie } from '_c/charts'
import { getGroupList } from '@/api/group-stat'
import { getMultiStat } from '@/api/group-stat'
import { getTreeData } from '@/api/group-stat'
import Tables from '_c/tables'
import { getGroupTableData } from '@/api/group-stat'

export default {
  name: 'GroupStat',
  components: {
    EcTreeMap,
    ChartBar,
    ChartPie,
    ChartHorizBar,
    RosePie,
    getGroupList,
    getMultiStat,
    getTreeData,
    Tables,
    // getCustTableData
  },
  data() {
    return {
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
          title: '集团名称',
          key: 'groupName'
        },
        {
          title: '公司名称',
          key: 'customerName'
        },
        {
          title: '贷款合计金额',
          key: 'money'
        },
        {
          title: '贷款笔数',
          key: 'num'
        }
      ],
      tableData2: [],
      totalNum2: 0,
      currentPage2: 1,
      pageSize2: 10,
      searchcolumns: ['groupName','customerName'],
      searchKey: '',
      searchValue: '',
      monthBegin: '',
      monthEnd: '',
      groupList: [],
      tag_custList: [],
      custDrawer: false,
      custList: [],
      busiData: [],
      LoanData: [],
      assureData: [],
      industryData: [],
      LoanTitle: '贷款发放方式贷款金额',
      assureTitle: '担保方式贷款金额',
      busiTitle: '业务品种贷款金额',
      industryTitle: '行业类型贷款金额',
      custValue: [],
      groupValue: [],
      cstGrid: [{ left: 130, right: 30, bottom: 160 }],
      visibleMin: 7000,
      spinShow: false,
      secondNodeLoading: false
    }
  },
  mounted() {
    // this.$refs.bankOverview.refresh()
    var now = new Date()
    var defaultMon = 'YYYYMM'
    var currYear = now.getFullYear()
    var defaultBegin = currYear+'01'
    var currMonth = now.getMonth() // 获取上个月月份
    defaultMon = defaultMon.replace('YYYY', currYear)
    defaultMon = defaultMon.replace(
      'MM',
      currMonth > 9 ? currMonth : '0' + currMonth
    )
    if(currMonth < 1) {
      defaultBegin = currYear - 1 + '01'
      defaultMon = currYear - 1 + '12' 
    }
    this.getStartMonth(defaultBegin, defaultMon)
    this.updateCustData()
    this.refreshCustTable()
    this.updateTreeData()
  },
  methods: {
    mapClickName(params){
      if (!params.data.children){
        this.$Message.warning({
          content: '仅能点击查看集团!',
          duration: 10,
          closable: true
        })
        return
      }
      this.custValue = []
      this.custList = []
      this.custList.push({
        value:params.data.name,
        label:params.data.name})
      this.custValue.push(params.data.name)
      this.updateCustData()
      this.groupValue.push(params.data.name)
      this.refreshCustTable()
    },
    handleCustClear(val) {
      if (val === '') {
        this.searchKey = ''
        this.refreshCustTable()
      }
    },
    handleCustSearch(val) {
      this.searchKey = val.searchKey
      this.searchValue = val.searchValue
      this.currentPage2 = 1
      this.refreshCustTable()
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
    //集团下客户明细表格
    refreshCustTable() {
      getGroupTableData(
        this.monthBegin,
        this.monthEnd,
        this.groupValue,
        this.searchKey,
        this.searchValue,
        this.currentPage2,
        this.pageSize2
      ).then((res) => {
        this.tableData2 = []
        var data = res.data.records
        this.totalNum2 = res.data.total
        for (var i = 0; i < data.length; i++) {
          this.tableData2.push({
            rank: data[i].rank,
            groupName: data[i].groupName,
            customerName: data[i].customerName,
            money: data[i].amt.toFixed(2) + ' 万元',
            num: data[i].count + ' 笔'
          })
        }
      })
    },//////
    getSecondNodeListByTypeAndName(name) {
      this.secondNodeLoading = true
      getGroupList(this.monthBegin, this.monthEnd, name, 10).then((res) => {
        // console.log(res)
        // this.custList = [];
        var data = res.data
        // this.custValue = "";
        this.custList = []
        this.custList = this.tag_custList
        for (var i = 0; i < data.length; i++) {
          if (this.custList.some((val, index) => {
            return val.value === data[i].groupId && val.label === data[i].customerName
          })) continue
          this.custList.push({
            value: data[i].groupId,
            label: data[i].customerName
          })
        }
        this.secondNodeLoading = false
      })
    },
    getStartMonth(start, end) {
      this.monthBegin = start
      this.monthEnd = end
    },
    clearCustSelect() {
      this.tag_custList = []
      this.custValue = ''
    },
    handleCustStatQuery() {
      // console.log(this.monthBegin, this.monthEnd)
      if (this.monthBegin > this.monthEnd) {
        this.$Message.warning({
          content: '开始日期不能大于结束日期!',
          duration: 10,
          closable: true
        })
        return
      }
      this.updateCustData()
      this.groupValue = this.custValue
      this.refreshCustTable()
    },
    dataBeginSelect(data) {
      this.monthBegin = data.replace('-', '')
    },
    dataEndSelect(data) {
      this.monthEnd = data.replace('-', '')
    },
    handleCustChanged() {
      this.tag_custList = []
      var values = this.custValue
      values.forEach((v, i) => {
        this.custList.some((val, index) => {
          if (val.label === v) {
            this.tag_custList.push(val)
            return true
          }
        })
      })
      // console.log(this.custList)
      // console.log(this.tag_custList)
    },
    handleCustClose(event, name) {
      let pos = 0
      this.tag_custList.some((v, i) => {
        if (v.label === name) {
          pos = i
          return true
        }
      })
      this.tag_custList.splice(pos, 1)
      const index = this.custValue.indexOf(name)
      this.custValue.splice(index, 1)
    },
    //集团概要图
    updateCustData() {
      this.spinShow = true
      // console.log(this.custValue)
      getMultiStat(this.monthBegin, this.monthEnd, this.custValue).then(
        (res) => {
          this.LoanData = []
          this.assureData = []
          this.industryData = []
          this.busiData = []
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
              }
            })
            this.$refs.bankLoanOverview.refresh(this.LoanData)
            this.$refs.bankassureOverview.refresh(this.assureData)
            this.$refs.bankindustryOverview.refresh(this.industryData)
            this.$refs.bankbusiOverview.refresh(this.busiData)
          }
        }
      ).finally(() => { this.spinShow = false })
    },
    updateTreeData(){
    getTreeData(this.monthBegin, this.monthEnd, this.custValue).then(
        (res) => {
          if (res) {
            // console.log(res)
            var totalAmt = 0 // 时间区间内的总贷款金额
            res.data.forEach((v, i) => {
              totalAmt += v.value
            })
            this.$refs.custOverviewMap.refresh(
              res.data,
              totalAmt.toFixed(2),
              this.visibleMin
            )
          }
        }
      )
    }
  }
}
</script>

<style lang="less">
@import "./group-stat.less";
</style>
