<template>
  <Modal v-model="uploadFileModal"
         :mask-closable="false"
         :closable="false"
         :z-index="10000"
         title="上传文件">
    <upload-file ref="uploadFile"
                 :multiple="multiple"
                 :format="format"
                 :max-size="maxSize"
                 :max-file-num="maxFileNum"
                 :action-url="actionUrl"
                 :params="params"
                 @on-finish="handleUploadFinish" />
    <div v-if="!uploadFinish"
         slot="footer">
      <Button type="text"
              size="large"
              @click="uploadCancel">取消</Button>
      <Button type="primary"
              size="large"
              @click="uploadOk">确定</Button>
    </div>
    <div v-else
         slot="footer">
      <Button type="text"
              size="large"
              @click="uploadCancel">关闭</Button>
    </div>
  </Modal>
</template>

<script>
import { UploadFile } from '_c/upload-file'
export default {
  name: 'UploadFileModal',
  components: {
    UploadFile
  },
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
    uploadFileModal: {
      type: Boolean,
      default: false
    },
    actionUrl: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      uploadList: [],
      uploadFinish: false
    }
  },
  watch: {
    uploadFileModal(val) {
      if (val) this.reset()
    }
  },
  mounted() {
    this.reset()
  },
  methods: {
    uploadCancel() {
      this.$emit('on-close')
    },
    uploadOk() {
      this.$refs.uploadFile.upload()
      // this.uploadFileModal = false
    },
    handleUploadFinish(params) {
      this.uploadFinish = true
      this.$emit('on-finish', params)
    },
    reset() {
      this.uploadList = []
      this.$refs.uploadFile.reset()
      this.uploadFinish = false
    }
  }
}
</script>
