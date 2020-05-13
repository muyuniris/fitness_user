<template>
  <div class="box">
    <div class="main">
      <h1>Welcome</h1>
      <van-tabs v-model="type" class="tab"
        background="transparent"      
        color='white'
        :border="false"
        title-inactive-color="gray"
        title-active-color="white">

        <van-tab title="快速登录">
          <div ref="codeForm">
            <van-field
              v-model="tel"
              name="手机号"
              placeholder="手机号"
              :border="false"
              
            />
            <van-field
            class="code-input"
            v-model="code"
            name="验证码"
            placeholder="验证码"
            :border="false">
              <template #button>
                <van-button size="small" class="code-btn" @click="getCode" v-show="!time">发送验证码</van-button>
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
              <van-button block type="info" native-type="submit" class='mybutton' @click="onSubmit">提交</van-button>
            </div>
          </div>
        </van-tab>
        <van-tab title="密码登录">
          <div ref="pwdForm">
            <van-field
              v-model="tel"
              name="手机号"
              placeholder="手机号"
              :border="false"
            />
            <van-field
              v-model="password"
              type="password"
              name="密码"
              placeholder="密码"
              :border="false"
            />
            <div>
              <van-button block type="info" native-type="submit" class='mybutton' @click="onSubmit">提交</van-button>
            </div>
          </div>
        </van-tab>
      </van-tabs>
      <div class="link">
        <router-link to="/register" class="register-link">注册新账户</router-link>
        <router-link to="/forget" class="forget-link">忘记密码？</router-link>
      </div>    
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { Toast } from "vant";
import crypto from "crypto";
Vue.use(Toast);
export default {
  data() {
    return {
      type: 0,
      tel: "",
      code: "",
      password: "",
      time: 0
    };
  },
  methods: {
    onSubmit() {
      console.log("登录", this.type);

      //验证码登录
      if (this.type == 0) {
        //验证验证码是否正确
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
              // 验证成功提交数据到后台返回用户信息
              this.axios
                .post("/users/userLogin", {
                  tel: this.tel,
                  type: this.type
                })
                .then(res => {
                  console.log(res);
                  if (res.data.code == "200") {
                    var token = res.data.data.token;
                    var userId = res.data.data.userId;
                    sessionStorage.setItem("token", token);
                    sessionStorage.setItem("uid",userId);
                    console.log("收到的token",token);
                    // 获取参数（未登录时想访问的路由）
                    var url = this.$route.query.redirect;
                    console.log(url);
                    url = url ? url : "/";
                    // 切换路由
                    this.$router.replace(url);
                  }
                })
                .catch(err => {
                  console.log(err);
                });
            } else {
              Toast("验证失败!");
            }
          })
          .catch(err => {
            console.log(err);
          });
        }
        
      }
      //密码登录
      else {
        if(!this.tel){
          Toast("请填写手机号");
        }
        else if(!(/^1[3456789]\d{9}$/.test(this.tel))){ 
          Toast("手机号码有误，请重填"); 
        }
        else if(!this.password){
          Toast("请输入密码");
        }
        else{
          const md5 = crypto.createHash("md5"); // md5 加密，不可逆加密
          const newPass = md5.update(this.password).digest("hex"); // 加密
          this.axios.post("/users/userLogin", {
            tel: this.tel,
            pwd: newPass,
            type: this.type
          })
          .then(res => {
            console.log(res);
            if (res.data.code == "200") {
              var token = res.data.data.token;
              var userId = res.data.data.userId;
              sessionStorage.setItem("token", token);
              sessionStorage.setItem("uid",userId);
              console.log("收到的token",token);
              // 获取参数（未登录时想访问的路由）
              var url = this.$route.query.redirect;
              console.log(url);
              url = url ? url : "/";
              // 切换路由
              this.$router.replace(url);
            } else {
              Toast(res.data.msg);
            }
          })
          .catch(err => {
            console.log(err);
          });
        }
      }
    },
    getCode() {
      console.log("获取验证码", this.tel);
       if(!this.tel){
        Toast("请填写手机号");
      }
      else if(!(/^1[3456789]\d{9}$/.test(this.tel))){ 
        Toast("手机号码有误，请重填"); 
      } 
      else {
        this.axios
          .post("/users/findTel", {
            tel: this.tel,
            role:1
          })
          .then(res => {
            console.log(res);
            if (res.data.code == 0) {
              //该手机号存在
              this.axios
                .post("/tel/getCode", {
                  //发送请求获取验证码
                  tel: this.tel
                })
                .then(res => {
                  console.log(res);
                  Toast(res.data.msg);
                  if (res.data.code == 200) {
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
              //手机号不存在
              console.log("手机号不存在");
              Toast(res.data.msg);
              // Notify('通知内容');
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  },
  created(){
    Toast.clear();
  }
};
</script>
<style>
.van-field__control{
  color:white;
}
</style>
<style lang="less" scoped>
.van-button--info{
  background: #ddd;
  border: none;
  // color: black;
}
.van-tabs__nav--line {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}
.box {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 667px;
  background: url(/img/login_bg.png) center;
  background-size: cover;
  h1 {
    color: white;
    text-align: center;
    padding-bottom: 20px;
  }
  .van-cell {
    background: rgba(255, 255, 255, 0.2);
    margin: 20px 0;
    line-height: 30px;
    border-radius: 5px;
  }
  .code_btn {
    background: gray;
  }
}
.tab {
  width: 300px;
}
.van-tab{
  background: transparent; 
}
.link{
  margin-top: 20px;
  a{
    color: rgb(201, 201, 201);
  }
  .register-link{
    float: left;
  }
  .forget-link{
    float: right;
  }

}
  .mybutton{
    border-radius: 5px;
    height: 50px;
    background: #5e8bb3;
    border: #5e8bb3;
  }

</style>