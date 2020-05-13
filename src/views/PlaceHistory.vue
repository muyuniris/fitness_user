<template>
  <div>
    <van-nav-bar
      class="bar"
      title="场地记录"
      left-text="返回"
      left-arrow
      @click-left="back"
    />
    <van-tabs v-model="active" sticky color="#5e8bb3" @change="change">
      <van-tab title="未完成">
        <van-pull-refresh v-model="refreshing" @refresh="refresh"  class="teacher-list">
          <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="load()"
          >
            <van-swipe-cell v-for="(item,index) in list" :key="index">
              <div class="item clearfix" @click="show(item.pid)">
                <div class="left">
                  <div class="avtor">
                    <img :src="item.img" alt="">
                  </div>
                </div>
                <div class="info">
                  <div class="name">{{item.name}}</div>
                  <div class="price">￥{{item.price}}</div>
                </div>
              </div>
              <template #right>
                <van-button square text="取消预约" class="btn-del" @click="del(index)"/>
              </template>
            </van-swipe-cell>
            
          </van-list>
          
        </van-pull-refresh>
      </van-tab>
      <van-tab title="已完成">
        <van-pull-refresh v-model="refreshing" @refresh="refresh"  class="teacher-list">
          <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="load()"
          >
            <van-swipe-cell v-for="(item,index) in list" :key="index">
              <div class="item clearfix" @click="show(item.pid)">
                <div class="left">
                  <div class="avtor">
                    <img :src="item.img" alt="">
                  </div>
                </div>
                <div class="info">
                  <div class="name">{{item.name}}</div>
                  <div class="price">￥{{item.price}}</div>
                </div>
              </div>
              <template #right>
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
    refresh(){
      this.finished = false;
      this.loading = true;
      this.load();
    },
    delOrder(id){
      Dialog.confirm({
        title:'删除预约记录',
        message: '请确认是否删除本条记录？'
      })
      .then(() => {
        this.axios.post('/order/delPlace',{
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
    show(id){
      this.$router.push({path:'/home/placeDetail/'+id});
    },
    del(index){
      var uid = sessionStorage.getItem("uid");
      Dialog.confirm({
        title:'取消预约',
        message: '取消预约会收取课程价格10%的手续费，余下金额将退还账户，请确认是否继续？'
      })
      .then(() => {
        this.axios.post('/order/delPlaceOrder',{
          id:this.list[index].oid,
          price:this.list[index].price,
          uid:uid
        })
        .then(res=>{
          if(res.data.code=='200'){
            this.list=[];
            this.load();
            Toast.success("取消预约成功！");
          }
        })
      })
      .catch(() => {
      });
    },
    back(){
      this.$router.go(-1);
    },
    change(){
      console.log("change");
      this.list=[];
      this.finished=false;
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
    formatDate(data){
      console.log(data);
      var item={};
      item.oid = data.op_id;
      item.name = data.p_name;
      item.img = this.$store.state.ip+data.p_img;
      item.pid = data.p_id;
      var time = data.op_time;
      item.price = data.p_price;
      item.time = this.switchTimeFormat(time);
      console.log(time);

      return item;
    },
    load(){
      if(this.refreshing){
        this.refreshing = false;
        this.list=[];
      }
      var uid = sessionStorage.getItem("uid");
      var state = this.active==0?true:false
      this.axios.post('/order/placeList',{
        id:uid,
        state:state,
        start:this.list.length,
        size:this.size
      })
      .then(res=>{
        console.log(res.data)
        if(res.data.code=='200'){
          var list = res.data.data.list;
          for(var i=0;i<list.length;i++){
            this.list.push(this.formatDate(list[i]));
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
.item{
    padding:10px 0;
    border-top: 1px solid @lineColor; 
    &>div{
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
    .info{
      padding-left:5px;
      width: 195px;
      height: 80px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      i{
        vertical-align: middle;
      }
    }
    .btn{
      display: flex;
      flex-wrap: wrap;
      width: 70px;
      height: 80px;
      display: flex;
      align-items: center;
    }
  }
</style>