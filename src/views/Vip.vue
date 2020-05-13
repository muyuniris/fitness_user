<template>
  <div class="myVip">
    <van-nav-bar
      title="我的会员"
      left-text="返回"
      left-arrow
      @click-left="back"
    />
    <div class="header clearfix">
      <div class="avtor">
        <img :src="this.$store.state.ip+img" alt="">
      </div>
      <div class="user-info">
        <div class="name">{{name}}</div>
        <div class="vip" v-show="!state">暂未开通会员</div>
        <div class="vip" v-show="state"><van-tag color="#ED8715">会员</van-tag> <span class="vip-time">{{endTime}} 到期</span></div>
      </div>
    </div>
    <div class="main">
      <div class="title">会员套餐</div>
      <div class="menu">
        <div v-for="(item,index) in menu" :key="index" class="item" :class="{ choosed: index==choose }" @click="choose=index">
          <div class="name">{{item.name}}</div>
          <div class="price">￥{{item.price}}.00</div>
          <div class="msg">{{item.msg}}</div>
        </div>
      </div>
    </div>
    <div class="other">
      <van-checkbox v-model="checked" shape="square" checked-color="#FFD10E" icon-size="12px" class="check">我已阅读并同意VIP服务协议</van-checkbox>
      <div>支付完成后，服务将在5分钟内生效 </div>
    </div>
    <div class="buy clearfix">
      <div class="price">￥{{menu[choose].price}}.00</div>
      <van-button type="default" class="btn" @click="buy">立即购买</van-button>
    </div>
    <van-popup v-model="show" position="bottom" class="popup" closeable>
      <div class="title">确认购买</div>
      <div class="item clearfix">
        <div class="name">商品名称</div>
        <div class="msg">会员缴费</div>
      </div>
      <div class="item clearfix">
        <div class="name">实付金额</div>
        <div class="msg price">￥{{menu[choose].price}}.00</div>
      </div>
      <div>
        <div class="paychoose">支付方式</div>
        <van-radio-group v-model="radio">
          <van-cell-group :border="false">
            <van-cell title="单选框 1" clickable @click="radio = '1'" :border="false">
              <template #title>
                <img src="/img/zhifubao.png" alt="" class="alipay-icon">
                <span class="alipay">支付宝</span>
              </template>
              <template #right-icon>
                <van-radio name="1" checked-color="#FFD10E"/>
              </template>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </div>
      <van-button type="default" class="btn" @click="pay">确认支付</van-button>
    </van-popup>

    <div v-html="alipayWap" ref="alipayWap"></div>
  </div>
  
</template>
<script>
import { Toast } from 'vant';
export default {
  data(){
    return{
      show:false,
      img:'',
      name:'',
      state:0,
      endTime:'',
      choose:0,
      checked:true,
      alipayWap: '',
      radio:"1",
      menu:[
        {
          name:"年会员",
          price:248,
          msg:'折合￥20.66/月',
          time:12
        },
        {
          name:"月会员",
          price:25,
          msg:' ',
          time:1
        },
        {
          name:"季会员",
          price:68,
          msg:'折合￥20.66/月',
          time:3
        },
      ]
    }
  },
  methods:{
    back(){
      this.$router.push({path:'/home/my'});
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
    buy(){
      console.log("支付",this.menu[this.choose].price);
      this.show=true;
    },
    pay(){
      console.log('buy');
      Toast.loading({
        duration:0,
        message: '加载中...',
        forbidClick: true,
      });
      this.axios.post("/alipay/pay",{
        price:this.menu[this.choose].price,
        subject:"会员缴费",
        time:this.menu[this.choose].time,
      })
      .then(res=>{
        console.log(res.data);
        this.alipayWap = res.data;
        this.$nextTick(() => {
          this.$refs.alipayWap.children[0].submit();
        })
      })
      .catch(err=>{
        console.log(err);
      })
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
        var data=res.data.data;
        this.img = data.v_img;
        this.name = data.u_name;
        this.state = data.state;
        this.endTime = this.switchTimeFormat(data.v_endTime);
        console.log(this.imgUrl);
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
.van-nav-bar__text,.van-nav-bar .van-icon{
  color: @buttonColor;
}
.myVip{
  background: @lineColor;
  height: 617px;
}
.header{
  background: white;
  padding:15px 20px;
  .avtor{
    height: 60px;
    width: 60px;
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
    height: 60px;
    padding-left: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .name{
      font-size: 20px;
    }
    .vip{
      font-size: 12px;
      color: gray;
      .vip-time{
        margin-left: 5px;
      }
    }
  }
}
.main{
  margin-top: 5px;
  background: white;
  padding: 20px;
  .title{
    padding-bottom: 20px;
  }
  .menu{
    display: flex;
    justify-content: space-around;
    .item{
      width: 100px;
      border: 1px solid gray;
      text-align: center;
      border-radius: 5px;
      line-height: 28px;
      padding: 10px 0;
      .name{
        font-size: 18px;
        font-weight: bold;
      }
      .price{
        color: rgb(190, 140, 0);
        font-weight: bold;
      }
      .msg{
        font-size: 12px;
        color: gray;
      }
    }
    .choosed{
      background: rgba(255, 239, 198, 0.295);
      border: 1px solid rgb(190, 140, 0);
    }
  }
}
.other{
  background: white;
  padding: 0 20px;
  padding-bottom: 20px;
  font-size: 12px; 
  color: rgb(150, 150, 150); 
}
.buy{
  background: white;
  width: 100%;
  line-height: 50px;
  position: fixed;
  bottom: 50px;
  .price{
    color:rgb(190, 140, 0);
    font-weight: bold;
    float: left;
    padding-left: 10px;
  }
  .btn{
    float: right;
    height: 50px;
    border: none;
    width: 120px;
    background: #5A5A5A;
    color:#DEBF94;
  }
}
.popup{
  background: white;
  // height: 240px;
  .title{
    height: 50px;
    line-height: 50px;
    text-align: center;
    font-size: 18px;
  }
  .item{
    padding: 0 20px;
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid rgb(233, 233, 233);
    .name{
      float: left;
    }
    .msg{
      float: right;
    }
  }
  .alipay{
    display: inline-block;
    line-height: 30px;
    height: 30px;
  }
  .alipay-icon{
    width: 30px;
    height: 30px;
    vertical-align: middle;
  }
  .paychoose{
    padding: 0 20px;
    color: gray;
    line-height: 50px;
  }
  .btn{
    float: right;
    height: 50px;
    border: none;
    width: 100%;
    background: #5A5A5A;
    color:#DEBF94;
  }
  .price{
    color:rgb(190, 140, 0);
    font-weight: bold;
    // float: left;
    // padding-left: 10px;
  }
}


</style>