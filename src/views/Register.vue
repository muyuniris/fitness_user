<template>
  <div class="register">
    <div class="main">
      <h1>用户注册</h1>
      <div class="myform" v-show="!state">
        <van-field
          v-model="tel"
          name="手机号"
          placeholder="手机号"
          arrow-direction="left"
          :border="false"
          :clearable="true"
          :rules="[{ required: true, message: '请填写手机号' ,trigger: 'onBlur'}]"
        />
        <van-field
          class="code-input"
          v-model="code"
          name="验证码"
          placeholder="验证码"
          :border="false"
          :rules="[{ required: true, message: '请填写',trigger: 'onBlur' }]">
          <template #button>
            <van-button size="small" class="code-btn" @click="getCode">发送验证码</van-button>
            <van-button
              size="small"
              class="code-btn"
              @click="getCode"
              v-show="time"
              disabled >
                {{time}}后重试
            </van-button>
          </template>
        </van-field>

        <div>
          <van-button block type="info" native-type="submit" @click="onSubmit" class="mybutton">下一步</van-button>
        </div>
        <div class="back" @click="back">返回登录</div>
      </div>
      <div class="myform" v-show="state">
        <van-field
          v-model="pwd"
          type="password"
          name="密码"
          placeholder="密码"
          :border="false"
        />
        <van-field
          v-model="confirmPwd"
          type="password"
          name="确认密码"
          placeholder="确认密码"
          :border="false"
        />
        <div>
          <van-button block type="info" native-type="submit" @click="register" class="mybutton">立即注册</van-button>
        </div>
        <div @click="state = false" class="back">
          返回上一步
        </div>
      </div>
      
    </div>
  </div>
</template>
<script>
import { Toast } from "vant";
import crypto from "crypto";
export default {
  data() {
    return {
      tel: "",
      code: "",
      state: false,
      pwd: "",
      confirmPwd: "",
      time: 0
    };
  },
  methods: {
    back(){
      this.$router.replace({path:'/login'});
    },
    // 验证验证码
    onSubmit() {
      console.log("提交验证码");
      if(!this.tel){
        Toast("请填写手机号");
      }
      else if(!(/^1[3456789]\d{9}$/.test(this.tel))){ 
        Toast("手机号码有误，请重填"); 
      }
      else if(!this.code){
        Toast("请输入验证码");
      }
      else{
        this.axios.post("/tel/confirm", {
          tel: this.tel,
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
    // 获取验证码
    getCode() {
      console.log("获取验证码");
      if(!this.tel){
        Toast("请填写手机号");
      }
      else if(!(/^1[3456789]\d{9}$/.test(this.tel))){ 
        Toast("手机号码有误，请重填"); 
      } 
      else {
        this.axios.post("/users/findTel", {
          tel: this.tel,
          role:1
        })
        .then(res => {
          console.log(res);
          if (res.data.code == 200) {
            //该手机号可用
            this.axios
              .post("/tel/getCode", {
                //发送请求获取验证码
                tel: this.tel
              })
              .then(res => {
                console.log(res);
                Toast(res.data.msg);
                if(res.data.code==200){
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
    // 设置密码
    register() {
      console.log("设置密码");
      if(!this.pwd){
        Toast("请输入密码");
      }
      else if(this.pwd.length<6){
        Toast("密码长度不能小于6");
      }
      else if(!this.confirmPwd){
        Toast("请输入确认密码");
      }
      else if(this.pwd!=this.confirmPwd){
        Toast("确认密码和密码不一致");
      }
      else{
        const md5 = crypto.createHash("md5"); // md5 加密，不可逆加密
        const newPass = md5.update(this.pwd).digest("hex"); // 加密
        console.log(newPass);
        this.axios.post("/users/register", {
          tel: this.tel,
          pwd: newPass
        })
        .then(res => {
          console.log(res.data);
          if(res.data.code=="200");
          this.$router.replace({path:'/login'});
        })
        .catch(err => {
          console.log(err);
        });
      }
    }
  }
};
</script>
<style>
.van-field__control{
  color:white;
}
</style>
<style lang="less" scoped>
.register {
  height: 667px;
  background: url(/img/login_bg.png) center;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  h1 {
    color: white;
    text-align: center;
    padding-bottom: 20px;
  }
  .van-cell {
    background: rgba(255, 255, 255, 0.2);
    margin: 20px 0;
    line-height: 30px;
    width: 300px;
    border-radius: 5px;
  }
}
.van-field__error-message {
  position: absolute;
  bottom: -100%;
  left: 0;
}
.back{
  margin-top: 20px;
  color:rgb(201, 201, 201);
}
.mybutton{
  border-radius: 5px;
  height: 50px;
  background: #5e8bb3;
  border: #f8f8f8;
}
</style>