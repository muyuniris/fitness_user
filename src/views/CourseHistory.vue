<template>
  <div>
    <van-nav-bar
      title="课程记录"
      left-text="返回"
      left-arrow
      @click-left="back"
    />
     
    <van-tabs v-model="active" sticky color="#5e8bb3" @change="change">
      <van-tab title="未完成" >
        <van-pull-refresh v-model="refreshing" @refresh="refreshCourse"  class="course-list">
          <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="loadCourse()"
          offset="500"
          >
          <van-swipe-cell v-for="(item,index) in list" :key="index">
             <div class="course-item clearfix"  @click="show(item.cid)">
              <div>
                <div class="avtor">
                  <img :src="item.img" alt />
                </div>
              </div>
              <div class="course-info">
                <div class="course-name">
                  {{item.name}}
                </div>
                <div class="course-time">
                  <van-icon name="clock-o" />{{item.time}}
                </div>
                <div class="course-other">
                  <van-icon name="location-o" />{{item.location}}
                  <van-icon name="manager-o" />{{item.teacher}}
                  <van-icon name="friends-o" />剩{{item.max-item.count}}个名额
                </div>
              </div>
              <!-- <div class="course-btn">
                <van-button type="default" size="small" @click="show(item.cid)" color="rgb(245, 176, 29)" plain>查看详情</van-button>
                <van-button type="default" size="small" @click="del(index)" color="rgb(245, 176, 29)" plain>取消预约</van-button>
              </div> -->
            </div>
            <template #right>
              <van-button square text="取消预约" class="btn-del" @click="del(index)"/>
            </template>
          </van-swipe-cell>
          </van-list>
          
        </van-pull-refresh>
      </van-tab>
      <van-tab title="已完成" >
        <van-pull-refresh v-model="refreshing" @refresh="refreshCourse"  class="course-list">
          <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="loadCourse()"
          offset="500"
          >
            <van-swipe-cell v-for="(item,index) in list" :key="index">
              <div @click="show(item.cid)" class="course-item clearfix">
                <div>
                  <div class="avtor">
                    <img :src="item.img" alt />
                  </div>
                </div>
                <div class="course-info">
                  <div class="course-name">
                    {{item.name}}
                  </div>
                  <div class="course-time">
                    <van-icon name="clock-o" />{{item.time}}
                  </div>
                  <div class="course-other">
                    <van-icon name="location-o" />{{item.location}}
                    <van-icon name="manager-o" />{{item.teacher}}
                    <van-icon name="friends-o" />剩{{item.max-item.count}}个名额
                  </div>
                </div>
              </div>
              <template #right>
                <van-button square text="评价" class="btn-rate" @click="rate(item.tid)"/>
                <van-button square text="删除" class="btn-del" @click="delOrder(item.oid)"/>
              </template>
            </van-swipe-cell>
          </van-list>
          
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
import { Toast } from 'vant';
import { Dialog } from 'vant';
export default {
  data(){
    return{
      active:0,
      loading:false,
      finished:false,
      refreshing:false,
      list:[],
      size:5
    }
  },

  methods:{
    change(){
      this.list=[];
      this.finished=false;
    },
    rate(id){
      console.log(id);
      this.$router.push({path:'/home/rate/'+id});
    },
    delOrder(id){
      Dialog.confirm({
        title:'删除预约记录',
        message: '请确认是否删除本条记录？'
      })
      .then(() => {
        this.axios.post('/order/delCourse',{
          id:id
        })
        .then(res=>{
          if(res.data.code=='200'){
            this.list=[];
            this.finished=false;
            Toast.success("取消预约成功！")
          }
        })
        .catch(err=>{
          console.log(err)
        })
      })
      .catch(()=>{

      })
    },
    del(index){
      var uid = sessionStorage.getItem("uid");
      Dialog.confirm({
        title:'取消预约',
        message: '取消预约会收取课程价格10%的手续费，余下金额将退还账户，请确认是否继续？'
      })
      .then(() => {
        this.axios.post('/order/delCourseOrder',{
          id:this.list[index].oid,
          price:this.list[index].price,
          uid:uid
        })
        .then(res=>{
          if(res.data.code=='200'){
            this.list=[];
            this.finished=false;
            Toast.success("取消预约成功！")
          }
        })
      })
      .catch(() => {
      });
    },

    show(id){
      console.log("aa",id);
       this.$router.push({path:'/home/courseDetail/'+id});
    },
    back(){
      this.$router.go(-1);
    },
    refreshCourse() {
      console.log("刷新")
      this.finished = false;
      this.loading = true;
      this.loadCourse();
    },
       // 格式化时间
    switchTimeFormat(date) {
      const dateTime = new Date(date);
      var year = dateTime.getFullYear();
      var month = dateTime.getMonth()+1;
      var day = dateTime.getDate();
      var hour = dateTime.getHours();
      month = month>9?month:'0'+month;
      day = day>9?day:'0'+day;
      hour = hour>9?hour:'0'+hour;
      return year+'-'+month+'-'+day+' '+hour+":00-"+hour+":50";
    },
    formatCourse(data){
      var item={};
      item.oid = data.oc_id;
      item.cid = data.cp_id;
      item.name = data.c_name;
      item.img = this.$store.state.ip+data.c_img;
      item.teacher = data.t_name;
      item.location = data.p_name;
      item.tid = data.t_id;
      item.max = data.cp_max;
      item.count = data.cp_count;
      item.price = data.cp_price;
      var time = data.cp_time;
      item.time = this.switchTimeFormat(time);
      return item;
    },
    loadCourse(){
      if(this.refreshing){
        this.refreshing = false;
        this.list=[];
      }
      var id = sessionStorage.getItem("uid");
      var state = this.active==0?true:false
      this.axios.post('/order/courseList',{
        id:id,
        state:state,
        start:this.list.length,
        size:this.size
      })
      .then(res=>{
        console.log(res.data)
        if(res.data.code=='200'){
          var list = res.data.data.list;
          for(var i=0;i<list.length;i++){
            this.list.push(this.formatCourse(list[i]));
          }
          this.loading = false;
          if(this.list.length>=res.data.data.count){
            this.finished = true;
          }
        }
      })
      .catch(err=>{
        console.log(err);
      })
    },
  }
}
</script>
<style lang="less" scoped>
@import "../assets/less/base.less";
.btn-del{
  height: 100%;
  background: @redColor;
  color: white
}
.btn-rate{
  height: 100%;
  background: rgb(252, 169, 15);
  color: white
}
.course-item{
  padding:10px;
  border-top: 1px solid @lineColor; 
}
.course-item>div{
  float: left;
}
.avtor{
  width: 80px;
  height: 80px;
  border-radius: 10px;
  overflow: hidden;
  img{
    height: 100%;
    width: 100%;
  }
}

.course-info{
  padding-left:10px;
  width: 220px;
  height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  i{
    vertical-align: middle;
  }
}
.course-time{
  font-size: 14px;
  vertical-align: middle;
  i{
    font-size: 16px;
  }
}
.course-other{
  font-size: 12px;
  vertical-align: middle;
  i{
    font-size: 14px;
  }
}
.course-btn{
  display: flex;
  flex-wrap: wrap;
  width: 70px;
  height: 80px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>