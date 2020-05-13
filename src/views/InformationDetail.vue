<template>
  <div>
    <van-nav-bar
      title="通知详情"
      left-text="返回"
      left-arrow
      @click-left="back"
    />
    <div class="informationDetail">
      <div class="title">{{title}}</div>
      <div class="time"><van-icon name="volume" color="#FFD10E"  size="22"/>
        <span>fitness健身俱乐部</span>{{time}}
      </div>
      <div class="main">
        <div class="line" v-for="(item,index) in msg" :key='index'>{{item}}</div>
      </div>
      <div class="img">
        <img :src="img" alt="">
      </div>
    </div>
    
  </div>
  
</template>
<script>
export default {
  data(){
    return {
      title:'',
      time:"",
      msg:[],
      img:''
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
      return year+"年"+month+"月"+day+"日";
    },
    back(){
      this.$router.push("/home/information");
    }
  },
  created(){
    this.axios.post('/notify/getDetail',{
      id:this.$route.params.id
    })
    .then(res=>{
      console.log(res.data)
      if(res.data.code=='200'){
        
        this.title = res.data.data.n_title;
        this.time = this.switchTimeFormat(res.data.data.n_time);
        this.msg = res.data.data.n_msg.replace(/\n|\r\n/g,"*").split('*');
        this.img = this.$store.state.ip+res.data.data.n_img;
      }
    });
    
  }
}
</script>
<style lang="less" scoped>
@import "../assets/less/base.less";
.van-nav-bar__text,.van-nav-bar .van-icon{
  color: @buttonColor;
}
.van-icon{
  vertical-align: middle;
}
.informationDetail{
  padding: 20px;
  .title{
    font-size: 24px;
    font-weight: bold;
  }
  .time{
    margin-top: 20px;
    color: gray;
    vertical-align: middle;
    line-height: 24px;
    span{
      display: inline-block;
      margin: 0 10px;
      color: @buttonColor;
    }
  }
  .main{
    line-height: 30px;
    margin-top: 20px;
    word-wrap:break-word;  
    word-break:break-all;
  }
  .img{
    padding: 20px 0;
    img{
      width: 100%;
    }
  }
}
</style>