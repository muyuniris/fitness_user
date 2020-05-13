<template>
  <div>
    <van-nav-bar
      title="F币明细"
      left-text="返回"
      left-arrow
      @click-left="back"
    />
    <van-pull-refresh v-model="refreshing" @refresh="refresh"  class="list">
      <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="load()"
      offset="500"
      >
        <div class="item" v-for="(item,index) in list" :key="index">
          <div class="clearfix">
            <div class="msg">{{item.msg}}</div>
            <div class="money">{{item.money}}.00</div>
          </div>
          <div class="clearfix">
            <div class="no">{{item.no}}</div>
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
      refreshing:false,
      finished:false,
      loading:false,
      size:5
    }
  },
  methods:{
    // 返回
    back(){
      this.$router.replace({path:'/home/money'});
    },
    // 格式时间
    dateFormat(date,fmt){
      date = new Date(date);
      var o = {
          "M+": date.getMonth() + 1, //月份
          "d+": date.getDate(), //日
          "h+": date.getHours(), //小时
          "m+": date.getMinutes(), //分
          "s+": date.getSeconds(), //秒
          "q+": Math.floor((date.getMonth() + 3) / 3), //季度
          "S": date.getMilliseconds() //毫秒
      };
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o)
          if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      return fmt;
    },
    // 格式化数据
    formateDate(item){
      var data = {};
      data.money = item.b_price;
      data.msg = item.b_msg;
      console.log(item.b_time);
      data.time = this.dateFormat(item.b_time,"yyyy-MM-dd hh:mm:ss");
      data.no = item.b_no;
      return data;
    },
    // 刷新
    refresh(){
      this.finished = false;
      this.load();
    },
    // 加载数据
    load(){
      this.loading=true;
      if(this.refreshing){
        this.refreshing = false;
        this.list=[];
      }
    var id = sessionStorage.getItem("uid");
      this.axios.post('/vip/getBill',{
        id:id,
        start:this.list.length,
        size:this.size
      })
      .then(res=>{
        console.log(res.data);
        if(res.data.code=="200"){
          this.loading = false;
          if(this.list.length==res.data.data.count){
            this.finished=true;
          }
          for(var i=0;i<res.data.data.list.length;i++){
            this.list.push(this.formateDate(res.data.data.list[i]));
          }
          
        }
        console.log(this.list)
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import "../assets/less/base.less";
.van-nav-bar__text,.van-nav-bar .van-icon{
  color: @buttonColor;
}
.item{
  padding: 15px;
  border-bottom: 1px solid @lineColor;
  .msg{
    float: left;
    line-height: 30px;
  }
  .money{
    float: right;
    font-size: 20px;
    font-weight: bold;
    line-height: 30px;
  }
  .no{
    float: left;
    font-size: 14px;
    line-height: 26px;
  }
  .time{
    float: right;
    font-size: 14px;
    line-height: 26px;
  }
}
</style>