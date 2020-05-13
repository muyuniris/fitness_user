<template>
  <div class="course">
    <van-tabs v-model="active" sticky color="#5e8bb3">
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
        <van-pull-refresh v-model="refreshing" @refresh="refreshCourse"  class="course-list">
          <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="loadCourse()"
          offset="500"
          >
          
            <CourseItem v-for="(item,index) in courseList" :key="index" :date="item"></CourseItem>
          </van-list>
          
        </van-pull-refresh>
      </van-tab>
      <van-tab title="私教">
        <van-sticky :offset-top="44">
          <div  class="search">
            <div class="search-input">
              <van-field v-model="text" left-icon="search" @input="search"/>
            </div>
          </div>
        </van-sticky>
        <van-pull-refresh v-model="teacherRefreshing" @refresh="refreshTeacher"  class="teacher-list">
          <van-list
          v-model="teacherLoading"
          :finished="teacherFinished"
          finished-text="没有更多了"
          @load="loadTeacher()"
          >
            <TeacherItem v-for="(item,index) in teacherList" :key="index" :date="item"></TeacherItem>
          </van-list>
          
        </van-pull-refresh>

      </van-tab>
      <van-tab title="场地">
        <van-pull-refresh v-model="placeRefreshing" @refresh="refreshPlace"  class="place-list">
          <van-list
          v-model="placeLoading"
          :finished="placeFinished"
          finished-text="没有更多了"
          @load="loadPlace()"
          >
            <div v-for="(item,index) in placeList" :key="index" class="item clearfix">
              <div class="left">
                <div class="avtor">
                  <img :src="item.img" alt="">
                </div>
              </div>
              <div class="info">
                <div class="name">{{item.name}}</div>
                <div class="price">￥{{item.price}}</div>
              </div>
              <div class="btn">
                <van-button type="default" size="small" @click="order(item.id)" color="rgb(245, 176, 29)" plain>立即预约</van-button>
              </div>
            </div>
          </van-list>
          
        </van-pull-refresh>

      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
// import { Toast } from 'vant';
import CourseItem from "../components/CourseItem";
import TeacherItem from "../components/TeacherItem"
export default {
  data() {
    return {
      courseList:[],
      teacherList:[],
      placeList:[],
      active: 0,
      choose: 0,
      loading:false,
      finished:false,
      refreshing:false,
      text:'',
      size:6,
      teacherLoading:false,
      teacherFinished:false,
      teacherRefreshing:false,
      placeLoading:false,
      placeFinished:false,
      placeRefreshing:false,
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
      this.courseList=[];
      this.finished=false;
      // this.loadCourse();
      
    },
    order(id){
      console.log("aaa")
      this.$router.push("/home/placeDetail/"+id);
    },
    refreshCourse() {
      console.log("刷新")
      this.finished = false;
      this.loading = true;
      this.loadCourse();
    },
    refreshPlace() {
      console.log("刷新")
      this.placeFinished = false;
      this.placeLoading = true;
      this.loadPlace();
    },

    // 格式化时间
    switchTimeFormat(date) {
      var arr=[];
      const dateTime = new Date(date);
      var hour = dateTime.getHours();
      hour = hour>9?hour:'0'+hour;
      arr.push(hour+":00");
      arr.push(hour+":50");
      return arr;
    },

    formatCourse(data){
      var item={};
      item.id = data.cp_id;
      item.name = data.c_name;
      item.img = this.$store.state.ip+data.c_img;
      item.teacher = data.t_name;
      item.location = data.p_name?data.p_name:'暂无';
      item.max = data.cp_max;
      item.count = data.cp_count?data.cp_count:0;
      var time = data.cp_time;
      item.inTime = this.switchTimeFormat(time)[0];
      item.outTime = this.switchTimeFormat(time)[1];
      return item;
    },

    formatTeacher(data){
      var item={};
      item.id = data.t_id;
      item.name = data.t_name;
      item.img = this.$store.state.ip+data.t_img;
      item.rate = data.t_rate;
      return item;
    },
    formatPlace(data){
      var item={};
      item.id = data.p_id;
      item.name = data.p_name;
      item.img = this.$store.state.ip+data.p_img;
      item.price = data.p_price;
      return item;
    },

    loadCourse(){
      console.log("时间",this.time[this.choose].time)
      if(this.refreshing){
        this.refreshing = false;
        this.courseList=[];
      }
      this.axios.post('/course/getPlanOneDay',{
        time:this.time[this.choose].time,
        start:this.courseList.length,
        size:this.size
      })
      .then(res=>{
        console.log(res.data)
        if(res.data.code=='200'){
          var list = res.data.data.list;
          for(var i=0;i<list.length;i++){
            this.courseList.push(this.formatCourse(list[i]));
          }
          this.loading = false;
          if(this.courseList.length>=res.data.data.count){
            this.finished = true;
          }
        }
      })
      .catch(err=>{
        console.log(err);
      })
    },


    refreshTeacher(){
      this.teacherFinished = false;
      // this.teacherLoading = true;
      this.loadTeacher();
    },


    loadTeacher(){   
      if(this.teacherRefreshing){
        this.teacherRefreshing = false;
        this.teacherList=[];
      }
      this.teacherLoading = true;
      this.axios.post('/teacher/getData',{
        name:this.text,
        currentPage:parseInt(this.teacherList.length/this.size)+1,
        pageSize:this.size
      })
      .then(res=>{
        console.log(res.data.data)
        if(res.data.code=='200'){
          var list = res.data.data.list;
          for(var i=0;i<list.length;i++){
            this.teacherList.push(this.formatTeacher(list[i]));
          }
          this.teacherLoading = false;
          if(this.teacherList.length>=res.data.data.count){
            this.teacherFinished = true;
          }
        }
      })
      .catch(err=>{
        console.log(err);
      })
    },

    loadPlace(){   
      if(this.placeRefreshing){
        this.placeRefreshing = false;
        this.placeList=[];
      }
      this.placeLoading = true;
      this.axios.post('/place/getData',{
        name:this.text,
        currentPage:parseInt(this.placeList.length/this.size)+1,
        pageSize:this.size
      })
      .then(res=>{
        console.log(res.data.data)
        if(res.data.code=='200'){
          var list = res.data.data.list;
          for(var i=0;i<list.length;i++){
            this.placeList.push(this.formatPlace(list[i]));
          }
          this.placeLoading = false;
          if(this.placeList.length>=res.data.data.count){
            this.placeFinished = true;
          }
        }
      })
      .catch(err=>{
        console.log(err);
      })
    },

    search(){
      console.log("搜索",this.text);
      this.teacherFinished=false;
      this.teacherList=[];
      this.loadTeacher();
    }


  },
  computed: {
    time() {
      var arr = [];
      var weeks = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
      var date = new Date();

      for (let i = 0; i < 7; i++) {
        let item = {};
        item.time = new Date();
        item.time.setDate(date.getDate() + i);
        var month = item.time.getMonth() + 1; //获取当前月份(0-11,0代表1月)
        var day = item.time.getDate(); //获取当前日(1-31)
        var week = item.time.getDay(); //获取当前星期X(0-6,0代表星期天)
        month = month < 10 ? "0" + month : month;
        day = day < 10 ? "0" + day : day;
        item.day = month + "/" + day;
        if (i == 0) {
          item.week = "今天";
        } else {
          item.week = weeks[week];
        }
        arr.push(item);

      }

      return arr;
    }
  },

};
</script>

<style lang="less" scoped>
.van-tabs{
  padding-bottom: 70px;
}
@import "../assets/less/base.less";
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
  border: 1px solid #5e8bb3;
}
.search{
  background: white;
  padding: 10px;
  .search-input{
    border: 1px solid #5e8bb3;
    outline: none;
    height: 30px;
    border-radius: 15px;
    overflow: hidden;
    .van-cell{
      padding: 5px 10px;
    }
  }
}
.place-list{
  .item{
    padding:10px 0;
    border-top: 1px solid @lineColor; 
    &>div{
      float: left;
    }
    .avtor{
      width: 80px;
      height: 80px;
      border-radius: 10px;
      overflow: hidden;
      text-align: center;
      img{
        height: 100%;
      }
    }
    .info{
      padding-left:5px;
      width: 195px;
      height: 80px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      i{
        vertical-align: middle;
      }
    }
    .btn{
      width: 70px;
      height: 80px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }
}

</style>