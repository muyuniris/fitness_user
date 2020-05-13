<template>
  <div class="my">
    <div class="header clearfix">
      <div class="avtor">
        <img :src="this.$store.state.ip+user.v_img" alt="">
      </div>
      <div class="user-info">
        <div class="name">{{user.v_name}}</div>
        <div class="vip"><van-tag color="#ED8715">会员</van-tag> <span class="vip-time">{{switchTimeFormat(user.v_endTime)}} 到期</span></div>
      </div>
    </div>
    <div class="main">
      <van-cell title="个人信息" is-link to="/home/info" size="large" icon="bar-chart-o"/>
      <van-cell title="我的会员" is-link to="/home/vip" size="large" icon="vip-card-o"/>
      <van-cell title="我的钱包" is-link to="/home/money" size="large" icon="balance-o"/>
      <van-cell title="账号安全" is-link to="/home/account" size="large" icon="setting-o"/>
      <van-cell title="课程记录" is-link to="/home/courseHistory" size="large" icon="records"/>
      <van-cell title="私教记录" is-link to="/home/teacherHistory" size="large" icon="user-o"/>
      <van-cell title="场地记录" is-link to="/home/placeHistory" size="large" icon="location-o"/>
      <van-cell title="意见反馈" is-link to="/home/suggest" size="large" icon="vip-card-o"/>
      <van-cell title="退出登录" is-link size="large" icon="close" @click="quit"/> 
    </div>
  </div>
</template>
<script>
// import { Toast } from 'vant';
export default {
  name:"my",
  data(){
    return {
      user:{}
    }
  },
  methods:{
    quit(){
      sessionStorage.removeItem('token')
      this.$router.replace({ path: "/login" });
    },
    switchTimeFormat(date) {
      var dateTime = new Date(date);
      var year = dateTime.getFullYear();
      var month = dateTime.getMonth() + 1;
      var day = dateTime.getDate();
      month = month>9?month:'0'+month;
      day = day>9?day:'0'+day;
      var time  = year+'-'+month+"-"+day
      return time;
    },
  },
  created(){
    var id = sessionStorage.getItem("uid");
    this.axios.post("/vip/getUser",{
      id:id
    })
    .then(res=>{
      console.log(res.data);
      if(res.data.code=="200"){
        this.user = res.data.data;
      }
    })
    .catch(err=>{
      console.log(err)
    })
  }
}
</script>
<style lang="less" scoped>
@import "../assets/less/base.less";
.header{
  background: rgb(73, 107, 136);
  color:white;
  padding: 40px 20px;
  .avtor{
    height: 70px;
    width: 70px;
    border-radius: 50%;
    overflow: hidden;
    float: left;
    img{
      width: 100%;
      height: 100%;
    }
  }
  .user-info{
    float: left;
    height: 70px;
    padding-left: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .name{
      font-size: 20px;
    }
    .vip{
      font-size: 12px;
      .vip-time{
        margin-left: 5px;
      }
    }
  }
}

</style>
<style>

</style>