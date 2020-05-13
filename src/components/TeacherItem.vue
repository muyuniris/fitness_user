<template>
  <div class="teacher-item clearfix">
    <div>
      <div class="avtor">
        <img :src="date.img" alt />
      </div>
    </div>
    <div class="teacher-info">
      <div class="teacher-name">
        {{date.name}}
      </div>
      <div class="teacher-rate">
        <van-rate v-model="date.rate" readonly size="14px"/>
      </div>
    </div>
    <div class="teacher-btn">
      <van-button type="default" size="small" @click="order(date.id)" color="rgb(245, 176, 29)" plain>立即预约</van-button>
    </div>
  </div>
</template>
<script>
export default {
  props:{
    date:Object
  },
  methods:{
   order(i){
     console.log(i);
     this.$router.push("/home/teacherDetail/"+this.date.id);
   }
  }
}
</script>
<style lang="less" scoped>
@import "../assets/less/base.less";
.teacher-item{
  padding:10px;
  border-top: 1px solid @lineColor; 
}
.teacher-item>div{
  float: left;
}
.avtor{
  width: 80px;
  height: 80px;
  border-radius: 10px;
  overflow: hidden;
  img{
    width: 100%;
  }
}

.teacher-info{
  padding-left:5px;
  width: 185px;
  height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  i{
    vertical-align: middle;
  }
}

.teacher-other{
  font-size: 12px;
  vertical-align: middle;
  i{
    font-size: 14px;
  }
}
.teacher-btn{
  width: 70px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>