<template>
  <div class="placeDetail">
    <van-nav-bar
    class="bar"
      title="课程详情"
      left-text="返回"
      left-arrow
      @click-left="back"
    />
    <div class="banner">
      <img :src="this.$store.state.ip+data.p_img" alt />
      <div class="banner-info">
        <div class="info">
          <div class="name">{{data.p_name}}</div>
          <div class="price">
            ￥{{data.p_price}}
          </div>
        </div>
      </div>
    </div>
    <div class="place-des">
      <div class="title">场地描述</div>
      <div
        class="description"
      >{{data.p_info?data.p_info:'暂无'}}</div>
    </div>
    <van-dropdown-menu overlay>
      <van-dropdown-item v-model="time" :options="day" @change="change"/>
    </van-dropdown-menu>
    <div class="time">
      <div class="item" v-for="(item,index) in list" :key="index">
        <van-button plain type="info" :disabled="item.state" @click="chooseTime(index)" class="btn" :class="{choosed:index==choose}">{{item.time}}</van-button>
      </div>
    </div>
    <div class="order-btn">
      <van-button type="default" @click="order">立即预约</van-button>
    </div>
  </div>
</template>
<script>
import { Toast } from 'vant';
import { Dialog } from 'vant';
export default {
  data(){
    return{
      data:{},
      time:'',
      list:[],
      choose:null,
    }
  },
  methods:{
    back(){
      this.$router.go(-1);
    },
    getTime(arr){
      var list = [];
      var timeList = [9,10,11,14,15,16];
      var j=0;
      for(var i=0;i<timeList.length;i++){
        var item = {};
        timeList[i] = timeList[i]<10?'0'+timeList[i]:timeList[i];
        item.time = timeList[i]+':00-'+timeList[i]+":50";
        item.value = timeList[i];
        var now = new Date();
        var hour = now.getHours()+1;
       
        if(this.time == 0&&timeList[i]<=hour){
          item.state =true;
        }
        else if(arr[j]&&timeList[i] == this.switchTimeFormat(arr[j].t_time)){
          j++;
          item.state = true;
        }
        else{
          item.state=false;
        }
        list.push(item);
      }
      if(hour>14){
        this.choose=null;
      }
      return list;
    },
    chooseTime(i){
      console.log(i);
      this.choose = i;
    },
    change(){
      this.choose=null;
      console.log("bb",this.choose);
      this.load();
    },
    order(){
      console.log(this.choose)
      if(!this.choose){
        Toast("请先选择时间");
      }
      else{
        var orderTime = this.day[this.time].text.split(" ")[0]+" "+this.list[this.choose].value+":00:00";
        var uid = sessionStorage.getItem("uid");
        this.axios.post('/order/selectPlace',{  //查询是否预约过
          uid:uid,
          pid:this.$route.params.id,
          time:orderTime
        })
        .then(res=>{
          console.log(res.data);
          if(res.data.code=="200"){
            // 查询余额是否充足
            this.axios.post("/vip/getMoney",{
              id:uid
            })
            .then(res=>{
              console.log(res.data);
              if(res.data.code=='200'){
                var money = res.data.data;
                if(money<this.data.p_price){
                  Dialog.confirm({
                    title:'余额不足',
                    message: '你的账户余额已不足 '+this.data.p_price+" F币,是否前往充值？"
                  })
                  .then(() => {
                    this.$router.push({path:'/home/money'});
                  })
                  .catch(() => {
                  });
                }
                // 余额充足
                else{
                  Dialog.confirm({
                    title: '确认支付',
                    message: '该操作将从你的账户中扣除 '+this.data.p_price+" F币,请确认是否继续？"
                  })
                  .then(() => {

                    // 预约课程
                    this.axios.post('/order/orderPlace',{
                      uid:uid,
                      pid:this.$route.params.id,
                      time:orderTime
                    })
                    .then(res=>{
                      if(res.data.code=='200'){

                        // 扣取费用
                        this.axios.post('/vip/income',{
                          id:uid,
                          money:Number("-"+this.data.p_price),
                          msg:"课程预约",
                        })
                        .then(res=>{
                          console.log(res.data);
                          if(res.data.code=='200'){
                            Toast.success("预约成功！");
                            this.$router.push({path:'/home/placeHistory'});
                          }
                        })
                      }
                      else{
                        Toast.fail(res.data.msg);
                      }
                    })
                    
                  })
                  .catch(() => {
                    Toast("已取消预约！");
                  });
                }
              }
            })
            .catch(err=>{
              console.log(err);
            })
          }
          // 已预约过
          else{
            Toast.fail(res.data.msg);
          }
        })
        .catch(err=>{
          console.log(err)
        })
      }
    },
    load(){
      console.log(this.day[this.time].time);
      this.axios.post('/order/placeTime',{
        id:this.$route.params.id,
        time:this.day[this.time].time
      })
      .then(res=>{
        console.log(res.data);
        if(res.data.code=='200'){
          var time = res.data.data;
          console.log("cc",this.choose)
          this.list = this.getTime(time);
          console.log(this.list)
        }
      })
    }
  },
  created(){
    this.time = this.day[0].value;
    Toast.loading({
      overlay:true,
      duration:0,
      message: '加载中...',
      forbidClick: true,
    });
    this.axios.post("/place/getDetail", {
      id:this.$route.params.id
    })
    .then((res) => {
      console.log(res);
      if(res.data.code=='200'){
        this.loading=false;
        this.data = res.data.data;
        Toast.clear();
        this.load();
      }
    })
    .catch(err=> {
      console.log(err)
    })
  },
  computed: {
    day() {
      var arr = [];
      var weeks = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
      var date = new Date();
      for (let i = 0; i < 7; i++) {
        let item = {};
        var time = new Date();
        time.setDate(date.getDate() + i);
        var year = time.getFullYear();
        var month = time.getMonth() + 1; //获取当前月份(0-11,0代表1月)
        var day = time.getDate(); //获取当前日(1-31)
        var week = time.getDay(); //获取当前星期X(0-6,0代表星期天)
        month = month < 10 ? "0" + month : month;
        day = day < 10 ? "0" + day : day;
        item.text = year+'-'+month + "-" + day+" "+weeks[week];
        item.time = time;
        item.value = i;
        arr.push(item);
      }

      return arr;
    }
  },
}
</script>
<style lang="less" scoped>
@import "../assets/less/base.less";
.van-nav-bar__text,.van-nav-bar .van-icon{
  color: @buttonColor;
}
.placeDetail {
  min-height: 667px;
  padding-bottom: 50px;
}
.banner {
  width: 100%;
  height: 240px;
  position: relative;
  img {
    width: 100%;
    height: 100%;
  }
  .banner-info {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    .info {
      background-image: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.4) 0%,
        rgba(0, 0, 0, 0.2) 25%,
        rgba(0, 0, 0, 0.2) 75%,
        rgba(0, 0, 0, 0.4) 100%
      );
      padding: 10px;
      .name {
        font-size: 20px;
        font-weight: bold;
        padding: 5px;
      }
    }
  }
}
.place-des {
  padding: 0 15px;
  margin-top: 10px;
  background: white;
  .title {
    padding: 10px 0;
    border-bottom: 1px solid @lineColor;
  }
  .description {
    padding: 10px 0;
  }
}
.time{
  background: white;
  display: flex;
  flex-wrap: wrap;
  padding: 5px 10px 20px 10px;
  justify-content: space-around;
  .item{
    margin-top: 20px;
  }
  .btn{
    border-color: gray;
    color: gray;
  }
  .choosed{
    border-color: @mainColor;
    color: @mainColor;
    background: rgba(255, 244, 195, 0.932);
  }
}
.order-btn {
  margin-top: 10px;
  button {
    border: none;
    background: @buttonColor;
    width: 100%;
    color: white;
  }
}
</style>