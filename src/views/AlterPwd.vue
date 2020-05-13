<template>
  <div class="alterPwd">
     <van-nav-bar
      title="修改手机号"
      left-text="返回"
      left-arrow
      @click-left="back"
    />
    <div v-show="!state"> 
      <div class="info">为保证账号安全，需要先验证已绑定手机</div>
      <div class="myform">
        <van-field v-model="tel" label="手机号" size="large" disabled/>
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
        <van-button block type="info" native-type="submit" @click="onSubmit" class="mybutton">下一步</van-button>
      </div>
    </div>
    <div v-show="state">
      <div class="info">请输入新的密码</div>
      <div class="myform">
        <van-field v-model="pwd" label="新密码" size="large" type="password"/>
        <van-field v-model="password" label="确认密码" size="large" type="password"/>
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
      tel:'',
      phone:'',
      code:'',
      time:0,
      pwd:'',
      password:"",
      state:false
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
      this.axios.post("/tel/getCode", {
        //发送请求获取验证码
        tel: this.tel
      })
      .then(res => {
        console.log(res);
        Toast(res.data.msg);
        if(res.data.code==200){

          // 设置验证码倒计时
          this.time = 60;
          let countDown = setInterval(() => {
            if (this.time == 0) {
              clearInterval(countDown);
            } else {
              this.time--;
            }
          }, 1000);
        }
      })
      .catch(err => {
        console.log(err);
      });
       
    },

    // 提交验证
    onSubmit() {
      console.log("提交验证码");
      if(!this.code){
        Toast("请输入验证码");
      }
      else{
        this.axios.post("/tel/confirm", {
          tel: this.phone,
          code: this.code
        })
        .then(res => {
          console.log(res.data);
          if (res.data.code == 200) {
            this.state = true;
          } else {
            Toast("验证失败!");
          }
        })
        .catch(err => {
          console.log(err);
        });
      }
      
    },

    // 修改密码
    alter(){
      if(!this.pwd){
        Toast("请输入密码！");
      }
      else if(this.pwd.length<6){
        Toast("密码长度不能小于6");
      }
      else if(this.pwd!=this.password){
        Toast("确认密码和密码不一致！")
      }
      else{
        var uid = sessionStorage.getItem("uid");
        const md5 = crypto.createHash("md5"); // md5 加密，不可逆加密
        const newPass = md5.update(this.pwd).digest("hex"); // 加密
        this.axios.post('/users/setPwd',{
          pwd:newPass,
          id:uid
        })
        .then(res=>{
          console.log(res.data);
          if(res.data.code=="200"){
            Toast("修改成功");
            this.$router.replace({path:'/home/my'});
          }
        })
      }
    }
    
  },
  // 获取数据
  created(){
    var uid = sessionStorage.getItem("uid");
    this.axios.post("/users/getTel",{
      id:uid,
    })
    .then(res=>{
      if(res.data.code == '200'){ 
        var tel = res.data.data;
        this.phone = tel;
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
.alterPwd{
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