<template>
  <div class="myEditor">
    <div id="container"
         ref="container"
         style="min-height:200px" />
  </div>
</template>
<script>
import * as monaco from 'monaco-editor'
export default {
  name: 'VueMonacoEdit',
  props: {
    codes: {
      type: String,
      default: () => {
        return '<div>请编辑html内容</div>'
      }
    },
    language: {
      type: String,
      default: () => {
        return 'html'
      }
    },
    editorOptions: {
      type: Object,
      default: () => {
        return {
          selectOnLineNumbers: true,
          roundedSelection: false,
          readOnly: false, // 只读
          cursorStyle: 'line', // 光标样式
          automaticLayout: true, // 自动布局
          glyphMargin: true, // 字形边缘
          useTabStops: false,
          fontSize: 28, // 字体大小
          autoIndent: true // 自动布局
          // quickSuggestionsDelay: 500,   //代码提示延时
        }
      }
    }
  },
  data() {
    return {
      themeOption: [
        {
          value: 'vs',
          label: '默认'
        },
        {
          value: 'hc-black',
          label: '高亮'
        },
        {
          value: 'vs-dark',
          label: '深色'
        }
      ],
      theme: 'hc-black',
      codesCopy: null // 内容备份
    }
  },
  mounted() {
    this.initEditor()
  },
  methods: {
    initEditor() {
      const self = this
      self.$refs.container.innerHTML = ''
      self.monacoEditor = monaco.editor.create(self.$refs.container, {
        value: self.codesCopy || self.codes,
        language: self.language,
        theme: self.theme, // vs, hc-black, or vs-dark
        editorOptions: self.editorOptions
      })
      self.$emit('onMounted', self.monacoEditor)// 编辑器创建完成回调
      self.monacoEditor.onDidChangeModelContent((event) => { // 编辑器内容changge事件
        self.codesCopy = self.monacoEditor.getValue()
        self.$emit('onCodeChange', self.monacoEditor.getValue(), event)
      })
      // 编辑器随窗口自适应
      window.addEventListener('resize', () => {
        self.initEditor()
      })
    },
    RunResult() {
      console.log(this.monacoEditor.getValue())
    },
    themeChange(val) {
      this.initEditor()
    }
  }
}
</script>
<style scoped>
#container {
  height: 100%;
  text-align: left;
}
</style>
