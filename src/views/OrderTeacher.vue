<template>
  <div>
    <van-nav-bar
      class="bar"
      title="预约私教"
      left-text="返回"
      left-arrow
      @click-left="back"
    />
    <div class="header clearfix">
      <div class="left">
        <div class="avtor"><img :src="this.$store.state.ip+teacher.t_img" alt=""></div>
      </div>
      <div class="right">{{teacher.t_name}}</div>
    </div>
    <van-dropdown-menu overlay>
      <van-dropdown-item v-model="time" :options="day" @change="change"/>
    </van-dropdown-menu>
    <div class="time">
      <div class="item" v-for="(item,index) in list" :key="index">
        <van-button plain type="info" :disabled="item.state" @click="chooseTime(index)" class="btn" :class="{choosed:index==choose}">{{item.time}}</van-button>
      </div>
    </div>
    <div class="order">
      <van-button type="default" class="btn" @click="order">立即预约</van-button>
    </div>
  </div>
</template>
<script>
import { Toast } from 'vant';
import { Dialog } from 'vant';
export default {
  data(){
    return{
      teacher:{},
      time:'',
      list:[],
      choose:0,
    }
  },
  methods:{
    order(){
      if(this.choose){
        var orderTime = this.day[this.time].text.split(" ")[0]+" "+this.list[this.choose].value+":00:00";
        var uid = sessionStorage.getItem("uid");
        this.axios.post('/order/selectTeacher',{  //查询是否预约过
          uid:uid,
          tid:this.$route.params.id,
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
                if(money<this.teacher.t_price){
                  Dialog.confirm({
                    title:'余额不足',
                    message: '你的账户余额已不足 '+this.teacher.t_price+" F币,是否前往充值？"
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
                    message: '该操作将从你的账户中扣除 '+this.teacher.t_price+" F币,请确认是否继续？"
                  })
                  .then(() => {

                    // 预约课程
                    this.axios.post('/order/orderTeacher',{
                      uid:uid,
                      tid:this.$route.params.id,
                      time:orderTime
                    })
                    .then(res=>{
                      if(res.data.code=='200'){

                        // 扣取费用
                        this.axios.post('/vip/income',{
                          id:uid,
                          money:Number("-"+this.teacher.t_price),
                          msg:"课程预约",
                        })
                        .then(res=>{
                          console.log(res.data);
                          if(res.data.code=='200'){
                            Toast.success("预约成功！");
                            this.$router.push({path:'/home/teacherHistory'});
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
      else{
        Toast("请先选择时间！");
      }
      
    },
    chooseTime(i){
      console.log(i);
      this.choose = i;
    },
    change(){
      this.choose=null;
      this.load();
    },
    back(){
      var id=this.$route.params.id;
      this.$router.replace({path:'/home/teacherDetail/'+id});
    },
    // 格式化时间
    switchTimeFormat(date) {
      const dateTime = new Date(date);
      var hour = dateTime.getHours();
      return hour;
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
        if(hour>14){
          this.choose=null;
        }
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
      return list;
    },
    load(){
      console.log(this.day[this.time].time);
      this.axios.post('/order/teacherTime',{
        id:this.$route.params.id,
        time:this.day[this.time].time
      })
      .then(res=>{
        console.log(res.data);
        if(res.data.code=='200'){
          var time = res.data.data;
          this.list = this.getTime(time);
          console.log(this.list)
        }
      })
    }
  },
  created(){
    this.time = this.day[0].value;
    this.axios.post("/teacher/getDetail", {
      id:this.$route.params.id
    })
    .then((res) => {
      if(res.data.code=='200'){
        this.teacher=res.data.data;
      }
    })
    .catch(err=> {
      console.log(err)
    })
    this.load();
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
.header{
  padding: 20px;
  border-bottom: 1px solid @lineColor;
  .left{
    float: left;
    .avtor{
      width: 60px;
      height: 60px;
      border-radius: 5px;
      overflow: hidden;
      border: 1px solid @lineColor;
      img{
        width: 100%;
        height: 100%;
      }
    }
  }
  .right{
    float: left;
    margin-left: 20px;
    line-height: 62px;
  }
}
.time{
  display: flex;
  flex-wrap: wrap;
  padding:10px;
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
.order{
  padding: 10px;
  .btn{
    width: 100%;
    border: none;
    background: @buttonColor;
    color: white;
  }
}
</style>