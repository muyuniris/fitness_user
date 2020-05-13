<template>
  <div class="courseDetail">
    <van-nav-bar
    class="bar"
      title="课程详情"
      left-text="返回"
      left-arrow
      @click-left="back"
    />
    <div class="banner">
      <img :src="data.c_img" alt />
      <div class="banner-info">
        <div class="info">
          <div class="name">{{data.c_name}}</div>
          <div class="rate">
            <span>K{{data.c_strong}}</span>
            <van-rate
              v-model="data.c_strong"
              icon="fire"
              :size="16"
              color="#fff"
              void-icon="fire"
              void-color="#96959B"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="course-info">
      <div>
        <van-icon name="clock-o" />{{switchTimeFormat(data.cp_time)}}
      </div>
      <div>
        <van-icon name="wap-home-o" />{{data.p_name}}
      </div>
      <div>
        <van-icon name="friends-o" />名额：{{data.cp_max}}个 剩余：{{data.cp_max-data.cp_count}}个
      </div>
      <div>
        <van-icon name="after-sale" />{{data.cp_price}}F币
      </div>
      <div class="location">
        <van-icon name="location-o" />成都市龙泉驿区大面街道xxxxx
        <a class="phone" href="tel:17311388039">
          <van-icon name="phone" />
        </a>
      </div>
    </div>
    <div class="teacher">
      <div class="title">教练介绍</div>
      <div class="teacher-main clearfix" @click="showTeacher">
        <div>
          <div class="avtor">
            <img :src="data.t_img" alt />
          </div>
        </div>
        <div class="teacher-info">
          <div class="teacher-name">{{data.t_name}}</div>
          <div class="teacher-rate">
            <van-rate v-model="data.rate" readonly size="14px" />
          </div>
        </div>
      </div>
    </div>
    <div class="course-des">
      <div class="title">课程介绍</div>
      <div
        class="description"
      >{{data.c_info?data.c_info:'暂无'}}</div>
    </div>
    <div class="order-btn">
      <van-button type="default" @click="del" v-show="data.state=='1'">取消预约</van-button>
      <van-button type="default" @click="rate" v-show="data.state=='0'">评价教练</van-button>
    </div>
  </div>
</template>
<script>
import { Toast } from 'vant';
import { Dialog } from 'vant';
export default {
  data() {
    return {
      loading:true,
      data:{},
    };
  },
  methods:{
    del(){
      var id = sessionStorage.getItem("uid");
      Dialog.confirm({
        title:'取消预约',
        message: '取消预约会收取课程价格10%的手续费，余下金额将退还账户，请确认是否继续？'
      })
      .then(() => {
        this.axios.post('/order/delCourseOrder',{
          id:this.$route.params.id,
          price:this.data.cp_price,
          uid:uid
        })
      })
      .catch(() => {
      });
    },

    back(){
      this.$router.replace({path:'/home/courseHistory'});
    },
    showTeacher(){
      this.$router.push("/home/teacherDetail/"+this.data.t_id);
    },
    switchTimeFormat(date) {
      var dateTime = new Date(date);
      var month = dateTime.getMonth() + 1;
      var day = dateTime.getDate();
      var hour = dateTime.getHours();
      month = month>9?month:'0'+month;
      day = day>9?day:'0'+day;
      hour = hour>9?hour:'0'+hour;
      var time  = month+"月"+day+"日 "+hour+":00-"+hour+":50"
      return time;
    },
  },
  created(){
    Toast.loading({
      overlay:true,
      duration:0,
      message: '加载中...',
      forbidClick: true,
    });
    this.axios.post("/order/courseItem", {
      id:this.$route.params.id
    })
    .then((res) => {
      console.log(res.data);
      if(res.data.code=='200'){
        this.loading=false;
        this.data = res.data.data;
        Toast.clear();
      }
    })
    .catch(err=> {
      console.log(err)
    })
  }
};
</script>
<style lang="less" scoped>
@import "../assets/less/base.less";
.van-nav-bar__text,.van-nav-bar .van-icon{
  color: @buttonColor;
}
.courseDetail {
  min-height: 667px;
  padding-bottom: 50px;
  background: @lineColor;
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
      .rate {
        font-size: 16px;
        vertical-align: top;
        line-height: 20px;
        height: 20px;
        padding: 5px;

        .van-rate {
          line-height: 20px;
          vertical-align: middle;
          height: 20px;
        }
      }
    }
  }
}
.course-info {
  padding: 10px;
  background: #fff;
  .location {
    border-top: 1px solid @lineColor;
    margin-top: 10px;
    padding-top: 10px;
    .phone {
      margin: 5px 0;
      padding: 0  10px;
      display: inline-block;
      color: @mainColor;
      float: right;
      height: 20px;
      border-left: 1px solid @lineColor;
      .van-icon {
        line-height: 20px;
        height: 20px;
        // padding: 5px;
      }
    }
  }
  div {
    padding: 5px;
    line-height: 30px;
    height: 30px;
    vertical-align: top;
  }
  .van-icon {
    height: 30px;
    line-height: 30px;
    font-size: 18px;
    vertical-align: top;
  }
}
.teacher {
  padding: 0 15px;
  margin-top: 10px;
  background: #fff;
  .title {
    padding: 10px 0;
    border-bottom: 1px solid @lineColor;
  }
  .teacher-main {
    padding: 10px 0;
    & > div {
      float: left;
    }

    .avtor {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      overflow: hidden;
      img {
        width: 100%;
      }
    }

    .teacher-info {
      padding-left: 5px;
      width: 185px;
      height: 80px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      i {
        vertical-align: middle;
      }
    }
  }
}
.course-des {
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