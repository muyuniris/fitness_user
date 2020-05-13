<template>
  <div class="notify">
    <div>
      <van-nav-bar
        title="支付成功"
        left-text="返回"
        left-arrow
        @click-left="back"
      />
    </div>
    <div class="result">
      <img src="/img/dui.png" alt="">
      <span>{{msg}}</span>
    </div>
    <div class="info">
      <van-cell-group>
        <van-cell title="交易方式" value="支付宝" title-class="title" value-class="value"/>
        <van-cell title="支付金额" :value="price" title-class="title" value-class="value"/>
        <van-cell title="下单时间" :value="time" title-class="title" value-class="value"/>
        <van-cell title="交易单号" :value="no" title-class="title" value-class="value"/>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src


export default {
  data(){
    return {
      msg:"",
      params:{},
      time:'',
      no:'',
      price:0,
      state:"",
    }
  },
  methods:{
    back(){
      console.log('aa');
      if(this.state!='0'){
        this.$router.replace({path:'/home/vip'});
      }
      else{
        this.$router.replace({path:'/home/money'});
      }
      
    },

  },
  created(){
    var url = window.location.href;
    var arr = url.split('?')[1].split("&");

    for(var i=0;i<arr.length;i++){
      var temp = arr[i].split('=');
      this.params[temp[0]]=temp[1];
    }
    console.log(this.params);
    if(this.params){
      this.time  = decodeURIComponent(this.params.timestamp);
      var no = this.params.out_trade_no;
      var state = no.split('_')[0];
      this.state = state;
      console.log(state);
      this.no = no.split('_')[1];
      this.price = this.params.total_amount;
      var id = sessionStorage.getItem("uid");
      if(state=='0'){
        var money = no.split('_')[2];
        console.log("充值")
        this.msg="充值成功";
        this.axios.post('/vip/income',{
          id:id,
          money:Number(money),
          msg:"账户充值",
          no:this.no
        })
        .then(res=>{
          console.log(res.data)
        })
      }
      else{
        this.msg="会员购买成功";
        this.axios.post('/vip/setVip',{
          id:id,
          time:Number(state),
          no:this.no
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import "../assets/less/base.less";
.notify{
  background: @lineColor;
  height: 617px;
}
.van-nav-bar__text,.van-nav-bar .van-icon{
  color: @buttonColor;
}
.result{
  text-align: center;
  padding: 30px;
  background: white;
  margin-top: 10px;
  img{
    width: 50px;
    height: 50px;
    vertical-align: middle;
  }
  span{
    display: inline-block;
    margin-left: 10px;
    line-height: 50px;
    color: gray;
    font-weight: bold;
  }
}
.info{
  background: white;
  margin-top: 10px;
  .title{
    color:gray;
    width: 100px;
    flex:1;
  }
  .value{
    color:black;
    width: 200px;
    flex:3;
  }
}
</style>
