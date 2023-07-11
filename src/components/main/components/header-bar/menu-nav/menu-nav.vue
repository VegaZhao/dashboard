<template>
  <div class="menu-nav">
    <Menu :theme="theme"
          :active-name="activeName"
          mode="horizontal"
          @on-select="categoryClick">
      <template v-for="item in menuList">
        <template v-if="item.children && item.children.length === 1">
          <menu-nav-item v-if="showChildren(item)"
                         :key="`menu-${item.name}`"
                         :parent-item="item" />
          <menu-item v-else
                     :name="getNameOrHref(item, true)"
                     :key="`menu-${item.children[0].name}`">
            <common-icon :type="item.children[0].icon || ''" /><span>{{ showTitle(item.children[0]) }}</span>
          </menu-item>
        </template>
        <template v-else>
          <menu-nav-item v-if="showChildren(item)"
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
  </div>
</template>
<script>
import './menu-nav.less'
import MenuNavItem from './menu-nav-item.vue'
import mixin from './mixin'

export default {
  components: {
    MenuNavItem
  },
  mixins: [mixin],
  props: {
    menuList: {
      type: Array,
      default() {
        return []
      }
    },
    activeName: {
      type: String,
      default: ''
    },
    theme: {
      type: String,
      default: 'dark'
    }
  },
  data() {
    return {

    }
  },
  methods: {
    categoryClick(name) {
      this.$emit('on-select', name)
    }
  }
}
</script>
