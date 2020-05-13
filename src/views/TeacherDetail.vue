<template>
  <div class="teacherDetail">
    <van-nav-bar
      class="bar"
      title="教练详情"
      left-text="返回"
      left-arrow
      @click-left="back"
    />
    <div class="banner">
      <div class="bg">
        <img src="/img/header-bg.jpg" alt="">
      </div>
      <div class="name">
        <div class="avtor">
          <img :src="this.$store.state.ip+data.t_img" alt="">
        </div>
        <h4>{{data.t_name}}</h4>
        <div class="rate">
          评分：
          <van-rate
          :allow-half="true"
          v-model="data.t_rate"
          :size="16"
          readonly/>
          <div class="order-btn">
            <van-button type="default" size="small" @click="order(data.t_id)" color="#5e8bb3" plain>立即预约</van-button>
          </div>
        </div>
      </div>
    </div>
    <div class="box">
      <div class="title"><van-icon name="notes-o" :size="20" color="rgb(245, 176, 29)"/> 基础档案</div>
      <div class="main info">
        <div>性别：{{data.t_sex?'女':'男'}}</div>
        <div>年龄：{{data.t_birth?GetAge(data.t_birth):"待完善"}}</div>
        <div>电话：{{data.u_tel}}
          <a :href="'tel:'+data.u_tel"><van-icon name="phone-o" :size="20" color="rgb(245, 176, 29)"/></a>
        </div>
        <div>价格：{{data.t_price}} F币</div>
      </div>
    </div>
    <div class="box">
      <div class="title"><van-icon name="description" :size="20" color="rgb(245, 176, 29)"/> 个人简介</div>
      <div class="main">
        {{data.t_info?data.t_info:"暂无"}}
      </div>
    </div>
    <div class="box">
      <div class="title"><van-icon name="records" :size="20" color="rgb(245, 176, 29)"/> 用户评价</div>
      <van-list
      class="main"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad">

        <van-cell v-for="item in rate" :key="item" :label="item.msg" center label-class="custom-label">
          <!-- 使用 title 插槽来自定义标题 -->
          <template #title>
            <div>
              
              <span class="custom-title">{{item.name}}:</span>
              <van-rate
              class="custom-rate"
                v-model="item.rate"
                :size="14"
                readonly
              />
              <span class="custom-time">{{item.time}}</span>
              <!-- <van-tag plain type="primary" class="custom-time">{{item.time}}</van-tag> -->
            </div>

            
          </template>
          
        </van-cell>
      </van-list>
    </div>
  </div>
</template>
<script>
import { Toast } from 'vant';
import { Dialog } from 'vant';
export default {
  data(){
    return{
      loading:false,
      finished:false,
      data:{},
      rate:[],
      size:5,
    }
  },
  methods:{
    back(){
      this.$router.go(-1);
    },
 // 通过生日获取年龄
    GetAge(strBirthday){       
      var returnAge,
      strBirthdayArr=strBirthday.split("-"),
      birthYear = strBirthdayArr[0],
      birthMonth = strBirthdayArr[1],
      birthDay = strBirthdayArr[2],  
      d = new Date(),
      nowYear = d.getFullYear(),
      nowMonth = d.getMonth() + 1,
      nowDay = d.getDate();   
      if(nowYear == birthYear){
        returnAge = 0;//同年 则为0周岁
      }
      else{
        var ageDiff = nowYear - birthYear ; //年之差
        if(ageDiff > 0){
          if(nowMonth == birthMonth) {
            var dayDiff = nowDay - birthDay;//日之差
            if(dayDiff < 0) {
              returnAge = ageDiff - 1;
            }else {
              returnAge = ageDiff;
            }
          }else {
            var monthDiff = nowMonth - birthMonth;//月之差
            if(monthDiff < 0) {
              returnAge = ageDiff - 1;
            }
            else {
              returnAge = ageDiff ;
            }
          }
        }else {
          returnAge = -1;//返回-1 表示出生日期输入错误 晚于今天
        }
      } 
      return returnAge;//返回周岁年龄
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
    formateData(item){
      var data = {};
      data.id = item.r_id;
      data.name = item.v_name;
      data.msg = item.r_msg?item.r_msg:'暂无';
      data.time = this.switchTimeFormat(item.r_time);
      data.rate = item.r_rate;
      return data;
    },
    onLoad(){
      console.log('加载');
      this.loading=true;
      
      this.axios.post('/teacher/getRate',{
        id:this.$route.params.id,
        start:this.rate.length,
        size:this.size
      })
      .then((res) => {
        console.log(res);
        if(res.data.code=='200'){
          var list = res.data.data.list;
          for(var i=0;i<list.length;i++){
            this.rate.push(this.formateData(list[i]));
          }
          console.log(list,this.rate)
          this.loading=false;
          if(this.rate.length>=res.data.data.count){
            this.finished = true;
          }
        }
      })
      .catch(err=> {
        console.log(err)
      })
    },
    order(id){
      console.log(id);
      var uid=sessionStorage.getItem("uid");
      this.axios.post("/vip/getUser",{
        id:uid
      })
      .then(res=>{
        console.log(res.data);
        if(res.data.code=="200"){
          if(res.data.data.state==1){
            this.$router.replace({path:'/home/orderTeacher/'+id});
          }
          else{
            Dialog.confirm({
              title: '权限不足',
              message: '只有会员才可以预约私教,是否前往购买会员?',
            })
            .then(() => {
              this.$router.push({path:'/home/vip'});
            })
            .catch(() => {
              Toast("已取消！")
            });
          }
        }
      })
      .catch(err=>{
        console.log(err)
      })
    }
  },
  created(){
    this.axios.post("/teacher/getDetail", {
      id:this.$route.params.id
    })
    .then((res) => {
      console.log(res);
      if(res.data.code=='200'){
        this.data=res.data.data;
      }
    })
    .catch(err=> {
      console.log(err)
    })
  }
}
</script>
<style lang="less" scoped>
@import "../assets/less/base.less";
.teacherDetail{
  min-height: 667px;
  padding-bottom: 50px;
  background: @lineColor;
}
.banner{
  background: #fff;
  .bg{
    img{
      width: 100%;
    }
  }
  .name{
    .avtor{
      width: 80px;
      height: 80px;
      border-radius: 50%;
      overflow: hidden;
      margin: 0 auto;
      margin-top: -40px;
      border: 1px solid @lineColor;
      img{
        width: 100%;
      }
    }
  }
  h4{
    padding: 10px;
    text-align: center;
  }
  .rate{
    padding: 10px;
    height: 30px;
    line-height: 30px;
  }
  .order-btn{
    float: right;
  }
}
.box{
  margin-top: 10px;
  background: #fff;
  padding: 0 10px;
  .title{
    padding: 10px 0;
    vertical-align: middle;
    border-bottom: 1px solid @lineColor;
    .van-icon{
    height: 26px;
    line-height: 26px;
    vertical-align: middle;
  }
  }
  .main{
    padding: 5px 0;
  }
}
.info{
  
  div{
    padding: 5px 0;
    .van-icon{
      float: right;
      vertical-align: middle;
    }
  }
}
.custom-title{
  display: inline-block;
  color:@mainColor;
  line-height: 26px;
}
.custom-time{
  float: right;
  color:gray;
  line-height: 26px;
  font-size: 12px;
}
.custom-label{
  color:black;
}
.custom-rate{
  line-height: 26px;
  height: 26px;
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
  margin-left: 10px;
}
</style>