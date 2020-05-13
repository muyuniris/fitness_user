<template>
  <div class="course-item clearfix">
    <div>
      <div class="avtor">
        <img :src="date.img" alt />
      </div>
    </div>
    <div class="course-info">
      <div class="course-name">
        {{date.name}}
      </div>
      <div class="course-time">
        <van-icon name="clock-o" />{{date.inTime}}-{{date.outTime}}
      </div>
      <div class="course-other">
        <van-icon name="location-o" />{{date.location}}
        <van-icon name="manager-o" />{{date.teacher}}
        <van-icon name="friends-o" />剩{{date.max-date.count}}个名额
      </div>
    </div>
    <div class="course-btn">
      <van-button type="default" size="small" @click="order" color="rgb(245, 176, 29)" plain>立即预约</van-button>
    </div>
  </div>
</template> 
<script>
export default {
  props:{
    date:Object
  },
  methods:{
    order(){
      console.log("order")
      this.$router.push("/home/courseDetail/"+this.date.id);
    }
  }
}
</script>
<style lang="less" scoped>
@import "../assets/less/base.less";
.course-item{
  padding:10px 0;
  border-top: 1px solid @lineColor; 
}
.course-item>div{
  float: left;
}
.avtor{
  width: 80px;
  height: 80px;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  img{
    height: 100%;
  }
}

.course-info{
  padding-left:5px;
  width: 195px;
  height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  i{
    vertical-align: middle;
  }
}
.course-time{
  font-size: 14px;
  vertical-align: middle;
  i{
    font-size: 16px;
  }
}
.course-other{
  font-size: 12px;
  vertical-align: middle;
  i{
    font-size: 14px;
  }
}
.course-btn{
  width: 70px;
  height: 80px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}


</style>