<template>
  <div id="Money">
    <van-nav-bar
      title="我的钱包"
      left-text="返回"
      right-
      left-arrow
      @click-left="back"
      @click-right="history">
      <template #right>
        <van-icon name="todo-list-o" size="20"/>
      </template>
    </van-nav-bar>
    <div class="remain">
      <div class="num">{{money}}</div>
      <div class="msg">当前余额</div>
    </div>
    <div class="main">
      <div class="title">会员套餐</div>
      <div class="menu">
        <div v-for="(item,index) in menu" :key="index" class="item" :class="{ choosed: index==choose }" @click="choose=index">
          <div class="price"><span>{{item.price}}</span> F币</div>
          <div class="money">{{item.money}}元</div>
        </div>
      </div>
    </div>
    <div class="other">
      <span class="point"></span>
      F币充值成功后，不能退款、提现或者转赠他人
    </div>
    <div class="buy clearfix">
      <div class="price">￥{{menu[choose].money}}.00</div>
      <van-button type="default" class="btn" @click="buy">立即购买</van-button>
    </div>
    <van-popup v-model="show" position="bottom" class="popup" closeable>
      <div class="title">确认购买</div>
      <div class="item clearfix">
        <div class="name">商品名称</div>
        <div class="msg">F币充值</div>
      </div>
      <div class="item clearfix">
        <div class="name">实付金额</div>
        <div class="msg price">￥{{menu[choose].money}}.00</div>
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
      choose:0,
      money:0,
      show:false,
      alipayWap: '',
      radio:"1",
      menu:[
        {
          price:8,
          money:8
        },
        {
          price:30,
          money:28
        },
        {
          price:88,
          money:83
        },
        {
          price:188,
          money:180
        },
        {
          price:388,
          money:378
        },
        {
          price:788,
          money:750
        },
      ]
    }
  },
  methods:{
    back(){
      this.$router.go(-1);
    },
    history(){
      console.log("查看历史");
      this.$router.replace({path:'/home/bill'});
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
        price:this.menu[this.choose].money,
        subject:"F币充值",
        time:0,
        money:this.menu[this.choose].price,
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
    this.axios.post("/vip/getMoney",{
      id:id
    })
    .then(res=>{
      console.log(res.data);
      if(res.data.code=='200'){
        this.money = res.data.data
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
#Money{
  background: @lineColor;
  height: 617px;
}
.remain{
  background: white;
  text-align: center;
  padding: 25px;
  .num{
    font-size: 40px;
    font-weight: 600;
  }
  .msg{
    color: gray;
    margin-top: 10px;
  }
}
.main{
  margin-top: 5px;
  background: white;
  padding: 20px;
  .menu{
    display: flex;
    justify-content: space-around;
    flex-wrap:wrap;
    .item{
      margin-top: 20px;
      width: 100px;
      border: 1px solid gray;
      text-align: center;
      border-radius: 5px;
      
      padding: 10px 0; 
      .price{
        line-height: 40px;
        span{
          font-size: 26px;
          font-weight: bold;
          display: inline-block;
        }
      }
      .money{
        color: gray;
        line-height: 30px;
      }
    }
    .choosed{
      background: rgba(255, 239, 198, 0.295);
      border: 1px solid rgb(190, 140, 0);
    }
  }
}
.other{
  margin-top: 5px;
  background: white;
  font-size: 14px;
  line-height: 30px;
  padding: 10px 20px;
  .point{
    display: inline-block;
    width: 5px;
    height: 5px;
    background: @mainColor;
    border-radius: 50%;
    vertical-align: middle;
  }
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