const btns = {
  delete: (h, params, vm) => {
    return h('Poptip', {
      props: {
        transfer: true,
        confirm: true,
        title: '确定要删除吗?'
      },
      style: {
        textAlign: 'left'
      },
      on: {
        'on-ok': () => {
          vm.$emit('on-delete', params)
          // vm.$emit('input', params.tableData.filter((item, index) => index !== params.row.initRowIndex))
        }
      }
    }, [h('span', {
      props: {
        type: 'text'
      },
      style: {
        marginLeft: '12px',
        cursor: 'pointer'
      }
    }, [
      h('Icon', {
        props: {
          type: 'ios-trash',
          size: 20
        }
      })
    ])])
  },
  edit: (h, params, vm) => {
    return h(
      'Tooltip', {
        props: {
          content: '编辑',
          placement: 'top'
        }
      },
      [h('span', {
        props: {
          type: 'text'
        },
        style: {
          cursor: 'pointer'
        },
        on: {
          click: () => {
            vm.$emit('on-edit', params)
          }
        }
      }, [
        h('Icon', {
          props: {
            type: 'ios-create',
            size: 18
          }
        })
      ])]
    )
  }
}

export default btns
