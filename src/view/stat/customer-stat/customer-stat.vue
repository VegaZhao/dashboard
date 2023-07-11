<template>
  <!-- @GroupChanged="handleGroupChanged"
@GroupClose="handleGroupClose"
:group-list="groupList" -->
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
          <label>公司：</label>
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
    <!-- <CustSelect ref="CustSelection"
                :cust-list="custList"
                @dataBeginSelect="dataBeginSelect"
                @dataEndSelect="dataEndSelect"
                @queryClick="handleCustStatQuery"
                @CustChanged="handleCustChanged"
                @CustClose="handleCustClose" /> -->
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
// import CustSelect from '@/components/selection/CustSelect.vue'
// import { getGroupList } from '@/api/customer-stat'
import { getCustList } from '@/api/customer-stat'
import { getMultiStat } from '@/api/customer-stat'
import { getTreeData } from '@/api/customer-stat'
// import { getGroupRank } from '@/api/bank-stat'

export default {
  name: 'CustStat',
  components: {
    EcTreeMap,
    ChartBar,
    ChartPie,
    ChartHorizBar,
    RosePie,
    getCustList,
    getMultiStat,
    getTreeData
  },
  data() {
    return {
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
      groupValue: '',
      custValue: [],
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

    // this.getGroupList()
    // this.getCustList();
    this.updateCustData()
    this.updateTreeData()
  },
  methods: {
    mapClickName(params){
      this.custValue = []
      this.custList = []
      this.custList.push({
        value:params.data.name,
        label:params.data.name})
      this.custValue.push(params.data.name)
      this.updateCustData()
    },
    getSecondNodeListByTypeAndName(name) {
      this.secondNodeLoading = true
      getCustList(this.monthBegin, this.monthEnd, name, 10).then((res) => {
        // console.log(res)
        // this.custList = [];
        var data = res.data
        // this.custValue = "";
        this.custList = []
        this.custList = this.tag_custList
        for (var i = 0; i < data.length; i++) {
          if (this.custList.some((val, index) => {
            return val.value === data[i].CUSTCODE && val.label === data[i].CUSTNAME
          })) continue
          this.custList.push({
            value: data[i].CUSTCODE,
            label: data[i].CUSTNAME
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
    },
    dataBeginSelect(data) {
      this.monthBegin = data.replace('-', '')
    },
    dataEndSelect(data) {
      this.monthEnd = data.replace('-', '')
    },
    // getGroupList() {
    //   // 以下函数来自于controller，用于调用后台的服务
    //   getGroupList(this.monthBegin, this.monthEnd).then((res) => {
    //     if (res) {
    //       this.groupList = []
    //       // this.custList = [];
    //       var data = res.data
    //       // 清空之前选中的值
    //       this.$refs.CustSelection.groupValue = ''
    //       for (var i = 0; i < data.length; i++) {
    //         this.groupList.push({
    //           value: data[i].GROUPID,
    //           label: data[i].GROUPNAME
    //         })
    //       }
    //       this.getCustList()
    //     }
    //   })
    // },
    // getCustList() {
    //   // 以下函数来自于controller，用于调用后台的服务
    //   getCustList(this.monthBegin, this.monthEnd).then((res) => {
    //     if (res) {
    //       this.custList = [];
    //       var data = res.data;
    //       this.custValue = "";
    //       for (var i = 0; i < data.length; i++) {
    //         this.custList.push({
    //           value: data[i].CUSTCODE,
    //           label: data[i].CUSTNAME,
    //         });
    //       }
    //     }
    //   });
    // },
    // handleGroupChanged() {
    //   this.getCustList()
    //   this.$refs.CustSelection.tag_groupList = []
    //   var values = this.$refs.CustSelection.groupValue
    //   values.forEach((v, i) => {
    //     this.groupList.forEach((x, j) => {
    //       if (x.label === v) {
    //         this.$refs.CustSelection.tag_groupList.push(x.label)
    //       }
    //     })
    //   })
    // },
    // handleGroupClose(name) {
    //   const index = this.$refs.CustSelection.tag_groupList.indexOf(name)
    //   this.$refs.CustSelection.tag_groupList.splice(index, 1)
    //   this.groupList.forEach((x, j) => {
    //     if (x.label === name) {
    //       var index2 = this.$refs.CustSelection.groupValue.indexOf(x.label)
    //       this.$refs.CustSelection.groupValue.splice(index2, 1)
    //     }
    //   })
    // },
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
    updateCustData() {
      this.spinShow = true
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
@import "./customer-stat.less";
</style>
