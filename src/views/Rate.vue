<template>
  <div class="rate">
     <van-nav-bar
      class="bar"
      title="评价私教"
      left-text="返回"
      right-text = "发布"
      left-arrow
      @click-left="back"
      @click-right="rate"
    />
    <div class="main">
      <div class="header clearfix">
        <div class="left">
          <div class="avtor"><img :src="this.$store.state.ip+teacher.t_img" alt=""></div>
        </div>
        <div class="right">{{teacher.t_name}}</div>
      </div>
      <div class="star">
        <span>服务评分:</span>
        <van-rate
          v-model="value"
          :size="25"
          void-color="#eee"
        />
      </div>
      <div>
        <van-field v-model="text" placeholder="请输入对教练的评价" type="textarea" maxlength="200" show-word-limit :autosize="{minHeight: 150}"/>
      </div>
    </div>
  </div>
</template>
<script>
import { Toast } from 'vant';
export default {
  data(){
    return{
      teacher:{},
      value:5,
      text:'',
    }
  },
  methods:{
    back(){
      this.$router.go(-1);
    },
    rate(){

      var uid = sessionStorage.getItem("uid");
      var tid = this.$route.params.id
      console.log(this.value,this.text,uid,tid);
      this.axios.post('/teacher/rate',{
        uid:uid,
        tid:tid,
        rate:this.value,
        msg:this.text
      })
      .then(res=>{
        console.log(res.data);
        if(res.data.code=="200"){
          Toast("评价成功！");
          this.$router.go(-1);
        }
      })
      .catch(err=>{
        console.log(err);
      })
    }
  },
  created(){
    this.axios.post("/teacher/getDetail", {
      id:this.$route.params.id
    })
    .then((res) => {
      if(res.data.code=='200'){
        this.teacher=res.data.data;
      }
    })
    .catch(err=> {
      console.log(err)
    })
  },
}
</script>
<style>
.van-field__control{
  color:black;
}
</style>
<style lang="less" scoped>
@import "../assets/less/base.less";
.van-nav-bar__text,.van-nav-bar .van-icon{
  color: @buttonColor;
}
.rate{
  background: @lineColor;
  height: 617px;
}
.main{
  background: white;
  padding: 0 10px;
}
.header{
  padding: 20px;
  border-bottom: 1px solid @lineColor;
  .left{
    float: left;
    .avtor{
      width: 60px;
      height: 60px;
      border-radius: 5px;
      overflow: hidden;
      border: 1px solid @lineColor;
      img{
        width: 100%;
        height: 100%;
      }
    }
  }
  .right{
    float: left;
    margin-left: 20px;
    line-height: 62px;
  }
}
.star{
  padding: 20px;
  &>span{
    font-size: 18px;
    font-weight: bold;
    color: gray;
    line-height: 26px;
    vertical-align: middle;
    margin-right: 10px;
  }
}
.van-rate{
  vertical-align: middle;
}
</style>