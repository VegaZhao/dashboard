<template>
  <div>
    <Row>
      <Col>
      <div v-if="searchable"
           class="search-con">
        <Select v-model="searchKey"
                class="search-col">
          <Option v-for="item in columns"
                  v-if="item.key !== 'handle'"
                  :value="item.key"
                  :key="`search-col-${item.key}`">{{ item.title }}</Option>
        </Select>
        <Input v-model="searchValue"
               clearable
               placeholder="输入关键字搜索"
               class="search-input"
               @on-change="handleClear">
        </Input>
        <Button class="search-btn"
                type="primary"
                @click="handleSearch">
          <Icon type="search" />&nbsp;&nbsp;搜索
        </Button>
      </div>
      <div v-if="operationEnable"
           class="search-con"
           style="float:right">
        <slot name="operation" />
      </div>
      </Col>
    </Row>
  </div>
</template>
<script>
import './index.less'
export default {
  name: 'TableToolbar',
  props: {
    columns: {
      type: Array,
      default() {
        return []
      }
    },
    searchable: {
      type: Boolean,
      default: true
    },
    operationEnable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      searchValue: '',
      searchKey: ''
    }
  },
  watch: {
    columns(columns) {
      this.searchKey = this.columns.length > 0 ? this.columns[0].key : ''
    }
  },
  methods: {
    handleClear(e) {
      this.$emit('on-clear', e.target.value)
    },
    handleSearch() {
      if (!this.searchKey) return
      const params = {}
      params.searchKey = this.searchKey
      params.searchValue = this.searchValue
      this.$emit('on-search', params)
    }
  }
}
</script>
