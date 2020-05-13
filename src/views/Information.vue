<template>
  <div class="information">
    <van-pull-refresh v-model="refreshing" @refresh="refresh"  id="info-list">
        <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="load()"
        offset="500"
        >
          <div v-for="(item,index) in list" :key="index" class="item clearfix" @click="show(item.id)">
            <div class="left" v-show="item.img">
              <div class="img">
                <img :src="item.img" alt="">
              </div>
            </div>
            <div class="right">
              <div class="title">{{item.title}}</div>
              <div class="time">{{item.time}}</div>
            </div>
          </div>
        </van-list>
        
      </van-pull-refresh>
  </div>
</template>
<script>
export default {
  data(){
    return{
      list:[],
      size:5,
      loading:false,
      finished:false,
      refreshing:false,
    }
  },
  methods:{
    // 格式化时间
    switchTimeFormat(date) {
      const dateTime = new Date(date);
      var year = dateTime.getFullYear();
      var month = dateTime.getMonth()+1;
      var day = dateTime.getDate();
      month = month>9?month:'0'+month;
      day = day>9?day:'0'+day;
      return year+"-"+month+"-"+day;
    },
    formatData(data){
      console.log(this.$store.state.ip);
      var item = {};
      item.title = data.n_title;
      item.img = data.n_img?this.$store.state.ip+data.n_img:null;
      item.id = data.n_id;
      item.time = this.switchTimeFormat(data.n_time);
      return item;
    },
    refresh() {
      console.log("刷新")
      this.finished = false;
      this.loading = true;
      this.load();
    },
    load(){
      console.log("aaa")
      var uid = sessionStorage.getItem("uid");
      if(this.refreshing){
        this.refreshing = false;
        this.list=[];
      }
      this.axios.post('/notify/getList',{
        id:uid,
        start:this.list.length,
        size:this.size
      })
      .then(res=>{
        console.log(res.data);
        if(res.data.code=='200'){
          var arr = res.data.data.list;
          this.loading = false;
          for(var i=0;i<arr.length;i++){
            this.list.push(this.formatData(arr[i]))
          }
          console.log(this.list)
          if(this.list.length>=res.data.data.count){
            this.finished = true;
          }
        }
      })
    },
    show(id){
      this.$router.push("/home/informationDetail/"+id);
    }
  }
}
</script>
<style lang="less" scoped>
@import "../assets/less/base.less";
.information{
  background: @lineColor;
  height: 617px;
}
#info-list{
  padding: 0 20px 70px 20px;
  background: @lineColor;
}
.item{
  background: white;
  border-radius: 5px;
  margin-top: 20px;
  padding: 15px;
  .left{
    float: left;
    .img{
      width: 70px;
      height: 70px;
      overflow: hidden;
      border-radius: 5px;
      img{
        width: 100%;
        height: 100%;
      }
    }
  }
  .right{
    height: 70px;
    float: left;
    margin-left: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .title{
      font-size: 18px;
    }
    .time{
      color: gray;
    }
  }
}
</style>