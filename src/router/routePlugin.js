const addQuery = (queryData) => {
  var query = {}
  Object.assign(query, this.$route.query, queryData)
  this.$router.push({
    path: this.$route.path,
    query: query
  })
}

const delQuery = () => {
  var query = {}
  // eslint-disable-next-line no-undef
  var arg = Array.prototype.slice.call(arguments)
  Object.assign(query, this.$route.query)
  arg.forEach(item => {
    delete query[item] // 删除参数
  })
  this.$router.push({
    path: this.$route.path,
    query: query
  })
}

const clearQuery = () => {
  this.$router.push({
    path: this.$route.path,
    query: {}
  })
}

var install = {
  install(Vue) {
    Vue.mixin({
      beforeCreate() {
        var self = this
        this.$routePlugin = {
          addQuery: addQuery.bind(self),
          delQuery: delQuery.bind(self),
          clearQuery: clearQuery.bind(self)
        }
      }
    })
  }
}
export default install
