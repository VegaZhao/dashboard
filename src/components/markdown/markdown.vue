<template>
  <div class="markdown-wrapper" >
    <textarea ref="editor" v-highlight></textarea>
  </div>
</template>

<script>
import Simplemde from 'simplemde'
import marked from 'marked'
import 'simplemde/dist/simplemde.min.css'

export default {
  name: 'MarkdownEditor',
  props: {
    value: {
      type: String,
      default: ''
    },
    options: {
      type: Object,
      default: () => {
        return {
          spellChecker: false,
          autofocus: true,
          autoDownloadFontAwesome: true,
          placeholder: '请输入...',
          autosave: {
            enabled: true,
            uniqueId: 'demo',
            delay: 1000
          },
          tabSize: 4,
          status: false,
          lineWrapping: false,
          renderingConfig: {
            codeSyntaxHighlighting: true
          }
        }
      }
    },
    localCache: {
      type: Boolean,
      default: false
    },
    previewClass: String
  },
  data () {
    return {
      editor: null
    }
  },
  methods: {
    addEvents () {
      this.editor.codemirror.on('change', () => {
        let value = this.editor.value()
        // if (this.localCache) localStorage.markdownContent = value
        this.$emit('input', value)
        this.$emit('on-change', value)
      })
      this.editor.codemirror.on('focus', () => {
        this.$emit('on-focus', this.editor.value())
      })
      this.editor.codemirror.on('blur', () => {
        this.$emit('on-blur', this.editor.value())
      })
    },
    addPreviewClass (className) {
      const wrapper = this.editor.codemirror.getWrapperElement()
      const preview = document.createElement('div')
      wrapper.nextSibling.className += ` ${className}`
      preview.className = `editor-preview ${className}`
      wrapper.appendChild(preview)
    }
  },
  mounted () {
    this.editor = new Simplemde(Object.assign(this.options, {
      element: this.$refs.editor
    }))
    /**
     * 事件列表为Codemirror编辑器的事件，更多事件类型，请参考：
     * https://codemirror.net/doc/manual.html#events
     */
    this.addEvents()
    // let content = localStorage.markdownContent
    if (this.value) this.editor.value(this.value)
    marked.setOptions({ sanitize: true })

    // 添加自定义 previewClass
    const className = this.previewClass || ''
    this.addPreviewClass(className)
  }
}
</script>

<style lang="less">
.markdown-wrapper{
  .editor-toolbar.fullscreen{
    z-index: 9999;
  }
  .CodeMirror-fullscreen{
    z-index: 9999;
  }
  .CodeMirror-fullscreen ~ .editor-preview-side{
    z-index: 9999;
  }
}

</style>
