<template>
  <div class="alterTel">
     <van-nav-bar
      title="修改手机号"
      left-text="返回"
      left-arrow
      @click-left="back"
    />
    <div v-show="!state"> 
      <div class="info">为保证账号安全，需要先验证原手机和密码</div>
      <div class="myform">
        <van-field v-model="tel" label="手机号" size="large"/>
        <van-field v-model="pwd" label="密码" size="large" type="password"/>
      </div>
      <div>
        <van-button block type="info" native-type="submit" @click="onSubmit" class="mybutton">验证</van-button>
      </div>
    </div>
    <div v-show="state">
      <div class="info">绑定新手机号</div>
      <div class="myform">
        <van-field v-model="newTel" label="手机号" size="large"/>
        <van-field
          v-model="code"
          label="验证码"
        >
          <template #button>
            <van-button size="small" class="code-btn" @click="getCode" v-show="!time">发送验证码</van-button>
            <van-button
              size="small"
              class="uncode-btn"
              @click="getCode"
              v-show="time"
              disabled >
                {{time}}后重试
            </van-button>
          </template>
        </van-field>
      </div>
      <div>
        <van-button block type="info" native-type="submit" @click="alter" class="mybutton">确认修改</van-button>
      </div>
    </div>
  </div>
</template>
<script>
import { Toast } from "vant";
import crypto from "crypto";
export default {
  data(){
    return{
      state:false,
      pwd:'',
      tel:'',
      newTel:'',
      code:'',
      time:0
    }
  },
  methods:{
    // 返回
    back(){
      if(this.state){
        this.state = false
      }
      else{
        this.$router.replace({path:'/home/account'});
      }
    },

   // 获取验证码
    getCode() {
      console.log("获取验证码");
      if(!this.newTel){
        Toast("请填写手机号");
      }
      else if(!(/^1[3456789]\d{9}$/.test(this.newTel))){ 
        Toast("手机号码有误，请重填"); 
      } 
      else {
        this.axios.post("/users/findTel", {
          tel: this.newTel,
          role:1
        })
        .then(res => {
          console.log(res);
          if (res.data.code == 200) {
            console.log("手机号可用")
            //该手机号可用
            // this.axios.post("/tel/getCode", {
            //   //发送请求获取验证码
            //   tel: this.tel
            // })
            // .then(res => {
            //   console.log(res);
            //   Toast(res.data.msg);
            //   if(res.data.code==200){
            //     this.time = 60;
            //     let countDown = setInterval(() => {
            //       if (this.time == 0) {
            //         clearInterval(countDown);
            //       } else {
            //         this.time--;
            //       }
            //     }, 1000);
            //   }
            // })
            // .catch(err => {
            //   console.log(err);
            // });
          } else {
            //手机号被注册
            console.log("手机号被注册");
            Toast(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
      }
    },

    // 验证手机号密码
    onSubmit() {
      if(!this.tel){
        Toast("请填写手机号");
      }
      else if(!(/^1[3456789]\d{9}$/.test(this.tel))){ 
        Toast("手机号码有误，请重填"); 
      } 
      else{
        var uid = sessionStorage.getItem("uid");
        const md5 = crypto.createHash("md5"); // md5 加密，不可逆加密
        const newPass = md5.update(this.pwd).digest("hex"); // 加密
        this.axios.post('/users/verify',{
          id:uid,
          tel:this.tel,
          pwd:newPass
        })
        .then(res=>{
          console.log(res.data);
          if(res.data.code=='200'){
            this.state = true;
          }
          else{
            Toast("验证失败！");
          }
        })
      }
    },

    // 修改手机号
    alter(){
      this.axios.post("/tel/confirm", {
          tel: this.newTel,
          code: this.code
        })
        .then(res => {
          console.log(res.data);
          if (res.data.code == 200) {
            this.state = true;
            
            var uid = sessionStorage.getItem("uid");
            this.axios.post("/users/alterTel",{
              tel:this.newTel,
              id:uid
            })
            .then(res=>{
              console.log(res.data);
              if(res.data.code=="200"){
                this.$router.replace({path:'/home/account'});
              }
            })
          } else {
            Toast("验证失败!");
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
}
</script>
<style lang="less" scoped>
@import "../assets/less/base.less";
.van-nav-bar__text,.van-nav-bar .van-icon{
  color: @buttonColor;
}
.alterTel{
  background: @lineColor;
  height: 617px;
}
.info{
  padding: 15px;
}
.myform{
  background: white;
}
.code-btn{
  background: @buttonColor;
  color:white;
}
.uncode-btn{
  background: gray;
  color:white;
}
.mybutton{
  margin-top: 20px;
  border-radius: 5px;
  height: 50px;
  background: #5e8bb3;
  border: #f8f8f8;
}
</style>