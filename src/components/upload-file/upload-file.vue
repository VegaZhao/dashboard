<template>
  <div>
    <List>
      <ListItem v-for="(item,i) in uploadList"
                :key="i">
        <ListItemMeta :avatar="folderImg"
                      :title="item.name" />
        <template slot="action">
          <li v-if="item.uploadStatus === 0">
            <a href="javascript:void(0)"
               @click="handleRemove(item.name)">移除</a>
          </li>
          <li v-else-if="item.uploadStatus === 1">
            <Icon :size="25"
                  type="ios-checkmark-circle-outline"
                  style="color: #19be6b" />
          </li>
          <li v-else>
            <Icon :size="25"
                  type="ios-close-circle-outline"
                  style="color: #ed4014" />
          </li>
        </template>
      </ListItem>
    </List>
    <Upload v-if="!uploadFinish"
            ref="upload"
            :show-upload-list="false"
            :on-success="handleSuccess"
            :on-error="handleError"
            :format="format"
            :max-size="maxSize"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            :before-upload="handleBeforeUpload"
            :multiple="multiple"
            :action="`${baseUrl}${actionUrl}`"
            :data="params"
            type="drag"
            style="margin-top:25px">
      <div style="padding: 10px 0">
        <Icon type="ios-cloud-upload"
              size="32"
              style="color: #3399ff" />
      </div>
    </Upload>
    <span v-if="errMsg !== ''"
          style="color:#ed4014">{{ errMsg }}</span>
  </div>
</template>
<script>
import config from '@/config'
import folderImg from '@/assets/images/folder.png'

export default {
  name: 'UploadFile',
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    format: {
      type: Array,
      default: () => []
    },
    maxSize: {
      type: Number,
      default: 10240
    },
    maxFileNum: {
      type: Number,
      default: 5
    },
    params: {
      type: Object,
      default: () => { }
    },
    actionUrl: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      folderImg,
      uploadList: [],
      uploadFinish: false,
      errMsg: '',
      baseUrl: ''
    }
  },
  watch: {
    uploadList(val) {
      if (val.length > 0 && val.every(item => { return item['uploadStatus'] !== 0 })) {
        this.uploadFinish = true
        this.$emit('on-finish', val)
      }
    }
  },
  mounted() {
    this.uploadList = []
    this.uploadFinish = false
    this.baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
  },
  methods: {
    handleRemove(name) {
      // 删除需要上传文件数据里的当前文件
      this.uploadList = this.uploadList.filter(item => {
        return item.name !== name
      })
    },
    handleSuccess(res, file, fileList) {
      let pos = -1
      for (let i = 0; i < this.uploadList.length; i++) {
        if (this.uploadList[i].name === file.name) {
          pos = i
          break
        }
      }
      if (pos !== -1) {
        if (res.code === '400') {
          if (res.msg.indexOf(config.splitSymbol) >= 0) {
            this.errMsg = res.msg.split(config.splitSymbol).join('</br>')
          } else {
            this.errMsg = res.msg
          }
          this.uploadList[pos]['uploadStatus'] = 2 // 文件处理错误
        } else {
          this.uploadList[pos]['uploadStatus'] = 1
        }

        this.$set(this.uploadList, pos, this.uploadList[pos])
      }
    },
    handleError(res, file, fileList) {
      let pos = -1
      for (let i = 0; i < this.uploadList.length; i++) {
        if (this.uploadList[i].name === file.name) {
          pos = i
          break
        }
      }
      if (pos !== -1) {
        this.uploadList[pos]['uploadStatus'] = 2
        this.$set(this.uploadList, pos, this.uploadList[pos])
      }
    },
    handleFormatError(file) {
      this.$Message.warning(file.name + ' 文件格式不正确, 文件格式范围为 ' + this.format.join(','))
    },
    handleMaxSize(file) {
      this.$Message.warning('文件  ' + file.name + ' 太大, 文件大小不能超过 ' + this.maxSize / 1024 + 'M.')
    },
    handleBeforeUpload(file) {
      if (!this.multiple) {
        this.uploadList = []
      } else {
        const check = this.uploadList.length < this.maxFileNum
        if (!check) {
          this.$Message.warning('最多支持' + this.maxFileNum + ' 个文件同时上传.')
          return false
        }
        if (this.uploadList.some(item => { return item.name === file.name })) {
          this.$Message.warning('不能同时上传相同文件名的文件')
          return false
        }
      }

      file['uploadStatus'] = 0 // 0：待上传 1：成功 2：失败

      this.uploadList.push(file)
      return false // 禁止默认上传
    },
    upload() { // 上传文件
      this.errMsg = ''
      for (let i = 0; i < this.uploadList.length; i++) {
        const item = this.uploadList[i]
        this.$refs.upload.post(item)
      }
    },
    reset() { // 重置上传组件
      this.errMsg = ''
      this.uploadList = []
      this.uploadFinish = false
    }
  }
}
</script>

<style lang="less">
@import "./index.less";
</style>
