<template>
  <div class="info">
    <van-nav-bar
      title="个人资料"
      left-text="返回"
      right-text="保存"
      left-arrow
      @click-left="back"
      @click-right="alter"
    />
    <div class="line clearfix header">
      <div class="left">更换头像</div>
      <div class="right">
        <van-uploader
        :after-read="afterRead">
          <div class="avtor">
            <img :src="imgUrl" alt="">
          </div>
        </van-uploader>
        
      </div>
    </div>
    <div class="line clearfix">
      <div class="left">姓名</div>
      <div class="right">
        <van-field v-model="name" placeholder="请输入姓名" input-align="right"/>
      </div>
    </div>
    <div class="line clearfix">
      <div class="left">性别</div>
      <div class="right">
        <van-field
          readonly
          clickable
          input-align="right"
          name="sex"
          :value="sex"
          placeholder="点击选择性别"
          :default-index="sexIndex"
          @click="showSex = true"
          />
          <van-popup v-model="showSex" position="bottom">
            <van-picker
            show-toolbar
            :columns="sexList"
            @confirm="chooseSex"
            @cancel="showSex = false"
            />
          </van-popup>
      </div>
    </div>
    <div class="line clearfix">
      <div class="left">生日</div>
      <div class="right">
        <van-field
          readonly
          clickable
          input-align="right"
          name="birth"
          :value="birth"
          placeholder="点击选择时间"
          @click="showBirth = true"
        />
        <van-popup v-model="showBirth" position="bottom">
          <van-datetime-picker
            type="date"
            v-model="currentDate"
            @confirm="chooseBirth"
            @cancel="showBirth = false"
            :min-date="time.start"
            :max-date="time.end"
          />
        </van-popup>
      </div>
    </div>
   
  </div>
</template>
<script>
import { Toast } from 'vant';
export default {
  data(){
    var time = new Date();
    time.setFullYear(time.getFullYear()-20);
    console.log(time);
    return{
      name:'',
      showSex:false,
      showBirth:false,
      sexList:['女','男'],
      sexIndex:0,
      sex:'',
      birth:'',
      img:'',
      imgUrl:'',
      currentDate:new Date(1998, 0, 1)
    }
  },
  methods:{
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
    chooseSex(value){
      this.sex = value;
      this.showSex = false;
    },
    chooseBirth(value){
      this.birth = this.switchTimeFormat(value);
      this.showBirth = false;
    },
    alter(){
      if(!this.name){
        Toast("姓名不能为空");
      }
      else{
        var id = sessionStorage.getItem("uid");
        console.log("修改");
        this.axios.post('/vip/alterUser',{
          id:id,
          name:this.name,
          birth:this.birth,
          sex:this.sex,
          img:this.img
        })
        .then(res=>{
          console.log(res.data);
          if(res.data.code=='200'){
            this.back();
          }
        })
        .catch(err=>{
          console.log(err)
        })
      }
    },
    back(){
      this.$router.push({path:'/home/my'});
    },
    afterRead(file){
      console.log(file.file);
      var img = file.file
      const isJPG = img.type === "image/jpeg";
      const isLt2M = img.size / 1024 / 1024 < 2;
      if (!isJPG) {
        Toast("上传头像图片只能是 JPG 格式!");
      }
      else if (!isLt2M) {
        Toast("上传头像图片大小不能超过 2MB!");
      }
      else{
        // 创建表单对象
        let form = new FormData();
        // 后端接受参数 ，可以接受多个参数
        form.append("file",img)
        // 请求头设置文件上传
        let config = {
            //必须
          headers: {
            "Content-Type": "multipart/form-data"
          },
        }
        //发送请求
        this.axios.post('/teacher/upload',form,config)
        .then(res=>{
          console.log(res.data)
          if(res.data.code=='200'){
            this.img = res.data.url;
            this.imgUrl = this.$store.state.ip+this.img;
          }
        })
        .catch(err=>{
          console.log(err)
        })
      }
      
    }
  },
  computed:{
    time(){
      var endTime = new Date();
      var startTime = new Date()
      startTime.setFullYear(startTime.getFullYear()-100);
      return {
        start:startTime,
        end:endTime
      }
    }
  },
  created(){
    Toast.loading({
      overlay:true,
      duration:0,
      message: '加载中...',
      forbidClick: true,
    });
    var id = sessionStorage.getItem("uid");
    this.axios.post("/vip/getUser",{
      id:id
    })
    .then(res=>{
      console.log(res.data);
      if(res.data.code=="200"){
        var data = res.data.data;
        this.img = data.v_img;
        this.name = data.v_name;
        this.sexIndex = data.v_sex;
        this.sex = data.v_sex?'女':'男';
        this.birth = data.v_birth?this.switchTimeFormat(data.v_birth):'';
        this.currentDate = data.v_birth;
        this.imgUrl = this.$store.state.ip+this.img;
        Toast.clear();
      }
    })
    .catch(err=>{
      console.log(err)
    })
  }
}
</script>
<style lang="less" scoped>
@import "../assets/less/base.less";
.van-nav-bar__text,.van-nav-bar .van-icon{
  color: @buttonColor;
}
.avtor-title span{
  display: inline-block;
  line-height: 70px;
}
.info{
  background: @lineColor;
  height: 617px;
  
  .line{
    margin-top: 5px;
    background: white;
    padding: 5px;
    .left{
      padding: 10px 16px;
      float: left;
      height: 24px;
      line-height: 24px;
    }
    .right{
      float: right;
    }
  }
  .header{
    margin-top: 0;
    .left{
      height: 70px;
      line-height: 70px;
    }
    .right{
      padding: 10px 16px;
    }
  }
  .avtor{
    
    width: 70px;
    height: 70px;
    border-radius:50%;
    overflow: hidden; 
    border: 1px solid @lineColor;
    img{
      width: 100%;
      height: 100%;
    }
  }
  .field{
    float: right;
    width: 100px;
  }
}

</style>