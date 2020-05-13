<template>
  <div class="dash">
    <van-swipe :autoplay="3000" class="swiper">
      <van-swipe-item v-for="(image, index) in banners" :key="index">
        <img v-lazy="image" />
      </van-swipe-item>
    </van-swipe>
    <van-notice-bar text="欢迎来到fitness健身俱乐部，我们竭诚为您服务！" left-icon="volume-o"  class="notice"/>
    <div class="box">
      <div class="title">热门教练</div>
      <div class="main">
        <div class="teacher-list">
          <div v-for='(item,index) in teacher' :key="index" class="teacher-item" @click="showTeacher(item.t_id)">
            <div class="avator">
              <img :src="$store.state.ip+item.t_img" alt="">
            </div>
            <div class="name">{{item.t_name}}</div>
            <van-rate v-model="item.t_rate" readonly size='12px'/>
          </div>
        </div>     
      </div>
    </div>
    <div class="box">
      <div class="title">最新课程</div>
      <div class="main">
        <div class="course-list" :style="{width: scrollerWidth}">
          <div v-for='(item,index) in course' :key="index" class="course-item" @click="showCourse(item.cp_id)">
            <div class="avator">
              <img :src="$store.state.ip+item.c_img" alt="">
            </div>
            <div class="name">{{item.c_name}}</div>
            <van-rate
              v-model="item.c_strong"
              icon="fire"
              :size="16"
              color="rgb(255, 68, 68)"
              void-icon="fire"
              void-color="#96959B"
              readonly
            />
          </div>
        </div>     
      </div>
    </div>
    
  </div>
</template>
<script>
export default {
  data(){
    return {
      banners: [
        '/img/banner1.png',
        '/img/banner2.png',
        '/img/banner3.png'
      ],
      teacher:[],
      course:[],
      scrollerWidth:'700px'
    }
  },
  methods:{
    showTeacher(id){
      console.log(id);
      this.$router.push("/home/teacherDetail/"+id);
    },
    showCourse(id){
      console.log(id);
      this.$router.push("/home/courseDetail/"+id);
    },
    switchTimeFormat(date) {
      const dateTime = new Date(date);
      var year = dateTime.getFullYear();
      var month = dateTime.getMonth()+1;
      var day = dateTime.getDate();
      month = month>9?month:'0'+month;
      day = day>9?day:'0'+day;
      return year+"-"+month+"-"+day;
    },
    formatData(data){
      console.log(this.$store.state.ip);
      var item = {};
      item.title = data.n_title;
      item.img = data.n_img?this.$store.state.ip+data.n_img:null;
      item.id = data.n_id;
      item.msg = data.n_msg.length<10?data.n_msg:data.n_msg
      item.time = this.switchTimeFormat(data.n_time);
      return item;
    },
  },
  created(){
    this.axios.post("/teacher/getTop")
    .then(res=>{
      console.log(res.data);
      this.teacher = res.data.data;
    })
     this.axios.post("/course/getTop")
    .then(res=>{
      console.log(res.data);
      this.scrollerWidth = res.data.data.length*200+'px';
      console.log(this.scrollerWidth)
      this.course = res.data.data;
    })
  }
}
</script>
<style lang="less">
@import "../assets/less/base.less";
.van-swipe__indicator--active{
  background-color: @mainColor;
}
</style>
<style lang="less" scoped>
@import "../assets/less/base.less";
.notice{
  margin-top: 10px;
}
.dash{
  padding: 0 10px;
  margin-top: 10px;
}
.swiper{
  width: 100%;
  height: 160px;
  margin: 5px auto;
  border-radius: 5px;
  overflow: hidden;
}
.swiper img{

  width: 100%;
  height: 100%;

}
.box{
  padding: 10px 0;
  border-top: 1px solid @lineColor;
  .title{
    padding: 10px 0;
  }
  .main{
    width: 100%;
    overflow: auto;
    &::-webkit-scrollbar {display:none}
  }
}
.teacher-list{
  display: flex;
  justify-content: space-around;
  width: 500px;
  .teacher-item{
    .avator{
      width: 80px;
      height: 80px;
      border-radius: 5px;
      overflow: hidden;
      img{
        width: 100%;
      }
    }
    .name{
      text-align: center;
    }
  }
}
.course-list{
  display: flex;
  justify-content: space-around;
  .course-item{
    .avator{
      width: 180px;
      height: 120px;
      border-radius: 5px;
      overflow: hidden;
      display: flex;
      justify-content: center;
      img{
        height: 100%;
      }
    }
  }
}
</style>
