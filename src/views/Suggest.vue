<template>
  <div class="suggest">
     <van-nav-bar
      class="bar"
      title="意见反馈"
      left-text="返回"
      right-text = "发布"
      left-arrow
      @click-left="back"
      @click-right="send"
    />
    <div class="main">
      <van-field v-model="text" placeholder="感谢你的反馈，你的任何建议和意见，甚至是吐槽，都对我们来说非常重要。" type="textarea" maxlength="200" show-word-limit :autosize="{minHeight: 200}"/>
    </div>
  </div>
</template>
<script>
import { Toast } from 'vant';
export default {
  data(){
    return{
      teacher:{},
      value:5,
      text:'',
    }
  },
  methods:{
    back(){
      this.$router.go(-1);
    },
    send(){
      var uid = sessionStorage.getItem("uid");
      var tid = this.$route.params.id
      console.log(this.value,this.text,uid,tid);
      this.axios.post('/suggest/add',{
        id:uid,
        msg:this.text
      })
      .then(res=>{
        console.log(res.data);
        if(res.data.code=="200"){
          Toast("反馈成功！我们会尽快处理！");
          this.$router.go(-1);
        }
      })
      .catch(err=>{
        console.log(err);
      })
    }
  },
  created(){
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
  },
}
</script>
<style>
.van-field__control{
  color:black;
}
</style>
<style lang="less" scoped>
@import "../assets/less/base.less";
.van-nav-bar__text,.van-nav-bar .van-icon{
  color: @buttonColor;
}
.suggest{
  background: @lineColor;
  height: 617px;
}
.main{
  background: white;
  padding: 0 10px;
}
</style>