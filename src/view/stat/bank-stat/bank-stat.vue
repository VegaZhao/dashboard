<template>
  <div>
    <div class="personinfo">
    </div>
    <Timeline :timelineDesc="timelineDesc" :width="480" />
  </div>
</template>

<style scoped>
.personinfo{
  width: 300px;
  float: left;
  padding-top: 1rem;
  margin-left: 30px;
}
.photo{
  width: 150px;
  height: 150px;
  display: block;
  margin: 20px auto;
  border-radius:50%;
}
.personinfo div h2{
  text-align: center;
  font-size: 30px;
}
.personinfo div p{
  text-align: center;
  font-size: 17px;
}
</style>

<script>
import Timeline   from '@/components/timeline/Timeline.vue'
import { getTimeLineData } from '@/api/timeline'
export default {
  name: 'worklog',
  components: {
    Timeline,
    getTimeLineData
  },
  data() {
    return {
    //   timelineDesc: [{'year':'2022',
    //   'yearlog':[{'month':'2022.12',
    //               'monthwork':[{'workdate':'12.1-12.5',
    //                              'workcnt':[{'title':'渗透测试','desc':'1、个人网银系统、企业网银系统渗透测试，完成渗透测试报告。\n2、众测同类排查总结，完成总结报告'},
    //                                         {'title':'众测项目','desc':'1、众测同类漏洞排查，并完整总结报告。\n2、第二轮次众测准备工作。'}
    //                                        ]
    //                            }]
    //              }]
    // }]
    timelineDesc: []
  }
  },
  mounted() {
    this.loadTimeLineData();
  },
  methods: {
    loadTimeLineData(){
      getTimeLineData().then(res => {
        if (res) {
          this.timelineDesc =  res.data ;
        }
      })
    }
  }
}
</script>
