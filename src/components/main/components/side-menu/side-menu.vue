<template>
  <div class="side-menu-wrapper">
    <slot />
    <Menu v-show="!collapsed"
          ref="menu"
          :active-name="activeName"
          :open-names="openedNames"
          :accordion="accordion"
          :theme="theme"
          width="auto"
          @on-select="handleSelect">
      <template v-for="item in menuList">
        <template v-if="item.children && item.children.length === 1">
          <side-menu-item v-if="showChildren(item)"
                          :key="`menu-${item.name}`"
                          :parent-item="item" />
          <menu-item v-else
                     :name="getNameOrHref(item, true)"
                     :key="`menu-${item.children[0].name}`">
            <common-icon :type="item.children[0].icon || ''" /><span>{{ showTitle(item.children[0]) }}</span>
          </menu-item>
        </template>
        <template v-else>
          <side-menu-item v-if="showChildren(item)"
                          :key="`menu-${item.name}`"
                          :parent-item="item" />
          <menu-item v-else
                     :name="getNameOrHref(item)"
                     :key="`menu-${item.name}`">
            <common-icon :type="item.icon || ''" /><span>{{ showTitle(item) }}</span>
          </menu-item>
        </template>
      </template>
    </Menu>
    <div v-show="collapsed"
         :list="menuList"
         class="menu-collapsed">
      <template v-for="item in menuList">
        <collapsed-menu v-if="item.children && item.children.length > 1"
                        :root-icon-size="rootIconSize"
                        :icon-size="iconSize"
                        :theme="theme"
                        :parent-item="item"
                        :key="`drop-menu-${item.name}`"
                        hide-title
                        @on-click="handleSelect" />
        <Tooltip v-else
                 :content="(item.meta && item.meta.title) || (item.children && item.children[0] && item.children[0].meta.title)"
                 :key="`drop-menu-${item.name}`"
                 transfer
                 placement="right">
          <a :style="{textAlign: 'center'}"
             class="drop-menu-a"
             @click="handleSelect(getNameOrHref(item, true))">
            <common-icon :size="rootIconSize"
                         :color="textColor"
                         :type="item.icon || (item.children && item.children[0].icon)" /></a>
        </Tooltip>
      </template>
    </div>
  </div>
</template>
<script>
import SideMenuItem from './side-menu-item.vue'
import CollapsedMenu from './collapsed-menu.vue'
import { getUnion } from '@/libs/tools'
import mixin from './mixin'

export default {
  name: 'SideMenu',
  components: {
    SideMenuItem,
    CollapsedMenu
  },
  mixins: [mixin],
  props: {
    menuList: {
      type: Array,
      default() {
        return []
      }
    },
    collapsed: {
      type: Boolean,
      default: false
    },
    theme: {
      type: String,
      default: 'dark'
    },
    rootIconSize: {
      type: Number,
      default: 20
    },
    iconSize: {
      type: Number,
      default: 16
    },
    accordion: {
      type: Boolean,
      default: false
    },
    activeName: {
      type: String,
      default: ''
    },
    openNames: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      openedNames: []
    }
  },
  computed: {
    textColor() {
      return this.theme === 'dark' ? '#fff' : '#495060'
    }
  },
  watch: {
    activeName(name) {
      if (this.accordion) this.openedNames = this.getOpenedNamesByActiveName(name)
      else this.openedNames = getUnion(this.openedNames, this.getOpenedNamesByActiveName(name))
    },
    menuList(list) {
      this.$nextTick(() => {
        this.$refs.menu.updateOpened()
        this.$refs.menu.updateActiveName()
      })
    },
    openNames(newNames) {
      this.openedNames = newNames
    },
    openedNames() {
      this.$nextTick(() => {
        this.$refs.menu.updateOpened()
      })
    }
  },
  mounted() {
    this.openedNames = getUnion(this.openedNames, this.getOpenedNamesByActiveName(name))
  },
  methods: {
    handleSelect(name) {
      this.$emit('on-select', name)
    },
    getOpenedNamesByActiveName(name) {
      return this.$route.matched.map(item => item.name).filter(item => item !== name)
    },
    updateOpenName(name) {
      if (name === this.$config.homeName) this.openedNames = []
      else this.openedNames = this.getOpenedNamesByActiveName(name)
    }
  }
}
</script>
<style lang="less">
@import "./side-menu.less";
</style>
