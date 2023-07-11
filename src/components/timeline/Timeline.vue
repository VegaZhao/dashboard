<template>
  <div>
    <div class="page">
  <div class="timeline"
        v-for="(data, index) in timelineDesc"
        :key="index">
    <div class="timeline__group"
        v-for="(data1, index1) in data.yearlog"
        :key="index1">
      <span class="timeline__year time" aria-hidden="true">{{ data1.month }}</span>
      <div class="timeline__cards">
        <div class="timeline__card card" 
              v-for="(data2, index2) in data1.monthwork"
              :key="index2">
          <header class="card__header">
            <time class="time">
              <span class="time__day">{{ data2.workdate }}</span>
            </time>
          </header>
          <div class="card__content"
              v-for="(data3, index3) in data2.workcnt"
              :key="index3">
            <h3 class="card__title r-title">{{ data3.title }}</h3>
            <p class="card__des">{{ data3.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  <div class="m-timeline-area" :style="'width: ${width}px'">
    <div class="m-timeline">
      <div
        :class="['m-timeline-item', {'last': index === timelineDesc.length - 1}]"
        v-for="(data, index) in timelineDesc"
        :key="index">
        <div class="u-tail"></div>
        <div class="u-dot"></div>
        <div class="u-content">{{ data.workdate || '--' }}</div>
        <div class="u-content">{{ data.desc || '--' }}</div>
      </div>
    </div>
  </div>
  </div>
</template>
<script>
import './Timeline.less'
export default {
  name: 'Timeline',
  props: {
    timelineDesc: { // 时间轴内容数组
      type: Array,
      default: () => {
        return []
      }
    },
    width: { // 时间轴区域总宽度
      type: Number,
      default: 360
    }
  }
}
</script>
<style lang="less" scoped>
@blue: #1890ff;
@green: #52c41a;
@red: #f5222d;
@gray: rgba(0,0,0,.25);
.m-timeline-area {
  margin: 0 auto;
  .m-timeline {
    .m-timeline-item {
      position: relative;
      padding-bottom: 30px;
      .u-tail {
        position: absolute;
        top: 10px;
        left: 5px;
        height: calc(100% - 10px);
        border-left: 2px solid #e8e8e8; // 实线
        // border-left: 2px dotted #e8e8e8; // 点线
        // border-left: 2px dashed #e8e8e8; // 虚线
      }
      .u-dot {
        position: absolute;
        width: 8px;
        height: 8px;
        border: 2px solid @blue;
        border-radius: 50%;
      }
      .u-content {
        position: relative;
        top: -6px;
        margin-left: 25px;
        word-break: break-all;
        word-wrap: break-word;
        line-height: 24px;
      }
    }
    .last {
      .u-tail {
        display: none;
      }
    }
  }
}
</style>