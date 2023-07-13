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
          <Select v-model="systemName"
                  :remote-method="loadSystemList"
                  filterable
                  style="width: 280px">
            <Option v-for="item in systemList"
                    :value="item.label"
                    :key="item.label">{{ item.label }}</Option>
          </Select>
        </i-col>
        <i-col span="8">
          <Button
            style="float: right"
            type="primary"
            @click="handleProfileStatQuery">查询</Button>
        </i-col>
      </row>
    </Card>
    <!-- 系统概况 -->
    <Card class="overview" style="margin-top: 5px">
      <div class="title">
        <p>{{ systemTitle }}</p>
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
                 name="nm_event"/>
        <!-- 历史漏洞tab -->
        <TabPane label="历史漏洞"
                 name="nm_vul">
          <!-- 表格 -->
          <div>
            <tables
              :searchcolumns="searchcolumns"
              :columns="columns"
              v-model="vulntableData"
              toolbar-enable
              editable
              border
              searchable
              operation-enable
              stripe
              toolbar-place="top"
              @on-clear="handleClear"
              @on-search="handleSearch">
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
                  @on-page-size-change="handlePageSizeChange"/>
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

import Tables from '_c/tables'
import { getSystemList } from '@/api/profile-stat'
import { getVulnerabilityTable } from '@/api/profile-stat'

export default {
  name: 'Profile',
  components: {
    Tables
  },
  data() {
    return {
      systemList: [],
      systemName: '',
      systemTitle: '',
      columns: [
        {
          title: '序号',
          key: 'id'
        },
        {
          title: '漏洞名称',
          key: 'title'
        },
        {
          title: '漏洞描述',
          key: 'description'
        },
        {
          title: '漏洞等级',
          key: 'severity'
        },
        {
          title: '漏洞来源',
          key: 'discResource'
        },
        {
          title: '漏洞分类',
          key: 'category'
        },
        {
          title: '业务功能场景',
          key: 'funcScene'
        },
        {
          title: '漏洞发现时间',
          key: 'discDate'
        },
        {
          title: '修复状态',
          key: 'repaireStatus'
        },
        {
          title: '修复日期',
          key: 'repairedDate'
        },
        {
          title: '漏洞发现人',
          key: 'discoverer'
        },
        {
          title: '备注',
          key: 'remarks'
        }
      ],
      vulntableData: [],
      currentPage: 1,
      pageSize: 10,
      tableMoney: 0,
      searchcolumns: ['category', 'title'],
      searchKey: '',
      searchValue: ''
    }
  },
  mounted() {
    this.loadSystemList()
    this.systemName = '个人网银系统'
    this.systemTitle = this.systemName
    this.refreshVulnTable()
  },
  methods: {
    loadSystemList() {
      getSystemList().then((res) => {
        this.systemList = []
        var data = res.data
        for (var i = 0; i < data.length; i++) {
          this.systemList.push({
            value: data[i].syscode,
            label: data[i].sysname
          })
        }
      })
    },
    handleProfileStatQuery() {
      if (this.systemName === '') {
        this.$Message.warning({
          content: '系统为必选项!',
          duration: 10,
          closable: true
        })
        return
      }
      this.systemTitle = this.systemName
      this.refreshVulnTable()
    },
    refreshVulnTable() {
      getVulnerabilityTable(
        this.systemName,
        this.searchKey,
        this.searchValue,
        this.currentPage,
        this.pageSize
      ).then((res) => {
        this.vulntableData = []
        var data = res.data.records
        this.totalNum = res.data.total
        for (var i = 0; i < data.length; i++) {
          this.vulntableData.push({
            id: data[i].rn + this.pageSize * (this.currentPage - 1),
            title: data[i].title,
            description: data[i].description,
            severity: data[i].severity,
            discResource: data[i].discResource,
			      category: data[i].category,
            funcScene: data[i].funcScene,
            disc_date: data[i].discDate,
            repaireStatus: data[i].repaireStatus,
            repairedDate: data[i].repairedDate,
			      discoverer: data[i].discoverer,
            remarks: data[i].remarks
          })
        }
      })
    },
    handlePageChange(pageNum) {
      this.currentPage = pageNum
      this.refreshVulnTable()
    },
    handlePageSizeChange(pageSize) {
      this.pageSize = pageSize
      this.refreshVulnTable()
    },
    handleClear(val) {
      if (val === '') {
        (this.searchKey = ''), (this.searchValue = ''), this.refreshVulnTable()
      }
    },
    handleSearch(val) {
      (this.searchKey = val.searchKey),
      (this.searchValue = val.searchValue),
      (this.currentPage = 1),
      this.refreshVulnTable()
      // console.log(this.searchKey);
      // console.log(this.searchValue);
    }
  }
}
</script>
