<template>
  <div class="course">
    <van-tabs v-model="active" sticky>
      <van-tab title="课程">
        <van-sticky :offset-top="44">
          <div class="time">
            <div
              class="time-item"
              v-for="(item,index) in time"
              :key="index"
              :class="{choosed:choose==index}"
              @click="setTime(index)"
            >
              <div>{{item.week}}</div>
              <div style="font-size:12px">{{item.day}}</div>
            </div>
          </div>
        </van-sticky>
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh"  class="course-list">
          <CourseItem v-for="(item,index) in courseList" :key="index" :date="item"></CourseItem>
        </van-pull-refresh>
      </van-tab>
      <van-tab title="私教">
        <van-sticky :offset-top="44">
          <div class="search">
            <van-field v-model="text" left-icon="search"/>
          </div>
        </van-sticky>
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh"  class="teacher-list">
          <TeacherItem v-for="(item,index) in teacherList" :key="index" :date="item"></TeacherItem>
        </van-pull-refresh>

      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
import { Toast } from 'vant';
import CourseItem from "../components/CourseItem";
import TeacherItem from "../components/TeacherItem"
export default {
  data() {
    return {
      courseList:[],
      teacherList:[],
      active: 0,
      choose: 0,
      isLoading: true,
      text:''
    };
  },
  components: {
    CourseItem,
    TeacherItem
  },
  methods: {
    setTime(i) {
      console.log("点击了", i);
      this.choose = i;
    },
    onRefresh() {
      setTimeout(() => {
        Toast('刷新成功');
        this.isLoading = false;
      }, 1000);
    }
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
  },
  created(){
    this.courseList=[
      {
        name:"美人瑜伽",
        img:"/img/img1.jpg",
        teacher:"张若昀",
        location:"瑜伽室",
        maxpeople:20,
        count:8,
        inTime:"07:00",
        outTime:"07-30"
      },
      {
        name:"美人瑜伽",
        img:"/img/img1.jpg",
        teacher:"张若昀",
        location:"瑜伽室",
        maxpeople:20,
        count:8,
        inTime:"07:00",
        outTime:"07-30"
      },
      {
        name:"美人瑜伽",
        img:"/img/img1.jpg",
        teacher:"张若昀",
        location:"瑜伽室",
        maxpeople:20,
        count:8,
        inTime:"07:00",
        outTime:"07-30"
      },
      {
        name:"美人瑜伽",
        img:"/img/img1.jpg",
        teacher:"张若昀",
        location:"瑜伽室",
        maxpeople:20,
        count:8,
        inTime:"07:00",
        outTime:"07-30"
      },
      {
        name:"美人瑜伽",
        img:"/img/img1.jpg",
        teacher:"张若昀",
        location:"瑜伽室",
        maxpeople:20,
        count:8,
        inTime:"07:00",
        outTime:"07-30"
      },
      {
        name:"美人瑜伽",
        img:"/img/img1.jpg",
        teacher:"张若昀",
        location:"瑜伽室",
        maxpeople:20,
        count:8,
        inTime:"07:00",
        outTime:"07-30"
      }
    ],
    this.teacherList=[
      {
        name:"张若昀",
        img:"/img/img2.jpg",
        rate:4,
        info:"暂无描述"
      },
      {
        name:"张若昀",
        img:"/img/img2.jpg",
        rate:4,
        info:"暂无描述"
      },
      {
        name:"张若昀",
        img:"/img/img2.jpg",
        rate:4,
        info:"暂无描述"
      },
      {
        name:"张若昀",
        img:"/img/img2.jpg",
        rate:4,
        info:"暂无描述"
      },
      {
        name:"张若昀",
        img:"/img/img2.jpg",
        rate:4,
        info:"暂无描述"
      }
    ]
  }
};
</script>
<style lang="less" scoped>
.time {
  padding: 10px 0;
  display: flex;
  justify-content: space-around;
  font-size: 14px;
  text-align: center;
  background: white;
}
.time-item {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid transparent;
  display: flex;
  justify-content: center;
  flex-direction: column;
}
.time-item.choosed {
  border: 1px solid gray;
}
.course-list,
.teacher-list {
  padding-bottom:50px;
}
.search{
  border: 1px solid rgb(216, 216, 216);
  outline: none;
  height: 30px;
  border-radius: 15px;
  overflow: hidden;
  margin: 10px;
  .van-cell{
    padding: 5px 10px;
  }
}

</style>