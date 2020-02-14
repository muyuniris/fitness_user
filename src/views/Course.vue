<template>
  <div class="course">
    <van-tabs v-model="active" sticky>
      <van-tab title="课程">
        <van-sticky>
          <div class="time">
            <div class="time-item" v-for="(item,index) in time" :key="index">
              <div>{{item.week}}</div>
              <div style="font-size:12px">{{item.day}}</div>
            </div>
          </div>
        </van-sticky>
      </van-tab>
      <van-tab title="私教">内容 2</van-tab>
    </van-tabs>
  </div>
</template>
<script>
export default {
  data() {
    return {
      list: [1, 2],
      active: 1
    };
  },
  computed: {
    time() {
      var arr = [];
      var weeks = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
      var date = new Date();

      for (var i = 0; i < 7; i++) {
        var item = {};
        date.setDate(date.getDate() + i);
        var month = date.getMonth() + 1; //获取当前月份(0-11,0代表1月)
        var day = date.getDate(); //获取当前日(1-31)
        var week = date.getDay(); //获取当前星期X(0-6,0代表星期天)
        month = month < 10 ? "0" + month : month;
        day = day < 10 ? "0" + day : day;
        item.day = month + "/" + day;
        item.date = date;
        if (i == 0) {
          item.week = "今天";
        } else {
          item.week = weeks[week];
        }
        arr.push(item);
      }
      console.log(arr);
      return arr;
    }
  }
};
</script>
<style lang="less" scoped>
.course {
  padding: 0 10px;
  margin-top: 10px;
}
.time {
  padding: 10px 0;
  display: flex;
  justify-content: space-around;
  font-size: 14px;
}
.time-item {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid red;
  display: flex;
  justify-content: center;
  flex-direction: column;
}
</style>