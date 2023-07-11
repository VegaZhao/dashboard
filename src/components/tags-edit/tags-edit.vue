<template>
  <div>
    <Tag
      v-for="item in tags"
      :key="item"
      :name="item"
      closable
      @on-close="handleCloseTag"
    >{{ item }}</Tag>
    <div v-if="addTag">
      <Input v-model="newTag" style="width:220px" maxlength="15" show-word-limit />
      <ButtonGroup style="width:80px">
        <Button icon="md-checkmark" type="primary" ghost @click="handleTagCheck"></Button>
        <Button icon="md-close" type="error" ghost @click="handleTagClose"></Button>
      </ButtonGroup>
    </div>
    <Button
      v-if="!addTag"
      icon="ios-add"
      type="dashed"
      size="small"
      @click="handleAddTag"
    >{{tagAddDesc}}</Button>
  </div>
</template>

<script>
export default {
  name: "TagsEdit",
  props: {
    tagAddDesc: {
      type: String,
      default: "添加标签",
    },
    tags: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      addTag: false,
      newTag: "",
      curTags: [],
    };
  },
  watch: {
    tags(val) {
      this.curTags = val;
    },
  },
  methods: {
    handleCloseTag(event, name) {
      const index = this.curTags.indexOf(name);
      this.curTags.splice(index, 1);
    },
    handleTagCheck() {
      if (this.newTag.length === 0) {
        this.$Modal.warning({
          title: "提醒",
          content: "标签内容不能为空",
        });
        return;
      }
      if (this.curTags.indexOf(this.newTag) >= 0) {
        this.$Modal.warning({
          title: "提醒",
          content: "不能建立两个相同内容的标签",
        });
        return;
      }
      this.curTags.push(this.newTag);
      this.addTag = false;
      this.$emit("on-add-tag", this.curTags);
    },
    handleTagClose() {
      this.addTag = false;
    },
    handleAddTag() {
      this.newTag = "";
      this.addTag = true;
    },
  },
};
</script>
