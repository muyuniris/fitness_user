<template>
  <div class="account">
    <van-nav-bar
      title="账号安全"
      left-text="返回"
      left-arrow
      @click-left="back"
    />
    <div class="tel">
      当前手机号
      <span>{{tel}}</span>
    </div>
    <div class="alter">
      <van-cell title="修改手机号" is-link to="/home/alterTel" size="large" />
      <van-cell title="修改密码" is-link to="/home/alterPwd" size="large" />
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return{
      tel:''
    }
  },
  methods:{
    // 返回
    back(){
      this.$router.replace({path:'/home/my'});
    }
  },

  // 获取数据
  created(){
    var uid = sessionStorage.getItem("uid");
    this.axios.post("/users/getTel",{
      id:uid
    })
    .then(res=>{
      if(res.data.code == '200'){
        var tel = res.data.data;
        var one = tel.substring(0,3);
        var two = tel.substring(6);
        tel = one+"****"+two
        this.tel = tel;
      }
    })
  }
}
</script>
<style lang="less" scoped>
@import "../assets/less/base.less";
.van-nav-bar__text,.van-nav-bar .van-icon{
  color: @buttonColor;
}
.account{
  background: @lineColor;
  height: 617px;
}
.tel{
  background: white;
  padding: 20px;
  text-align: center;
  font-size: 20px;
  span{
    font-size: 26px;
    display: block;
    margin-top: 20px;
    font-weight: bold;
  }
}
.alter{
  margin-top: 10px;
}
</style>