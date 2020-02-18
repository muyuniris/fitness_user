<template>
  <div class="courseDetail">
    <div class="banner">
      <img :src="img" alt />
      <div class="banner-info">
        <div class="info">
          <div class="name">零基础背部塑型</div>
          <div class="rate">
            K{{value}}
            <van-rate
              v-model="value"
              icon="star"
              :size="16"
              color="#fff"
              void-icon="star"
              void-color="#96959B"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="course-info">
      <div>时间：2月18日 07：00-07：30</div>
      <div>地点：瑜伽室</div>
      <div>名额：8个 剩余：2个</div>
      <div>价格：20元</div>
    </div>
    <div class="teacher">
      <div class="title">教练介绍</div>
      <div class="teacher-main clearfix">
        <div>
          <div class="avtor">
            <img src="/img/img2.jpg" alt />
          </div>
        </div>
        <div class="teacher-info">
          <div class="teacher-name">zry</div>
          <div class="teacher-rate">
            <van-rate v-model="rate" readonly size="14px" />
          </div>
        </div>
      </div>
    </div>
    <div class="course-des">
      <div class="title">课程介绍</div>
      <div class="description">
        的考生是否会看到回复客户收到开发计划的款式反馈收到回复客户收到付款饭后漱口多方核实尽快发货见客户首付款首付款是对回复开始疯狂撒金凤凰啊还是房卡就行
      </div>
    </div>
    <div class="order-btn">
      <van-button type="default">立即预约</van-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      img: "/img/p1.jpg",
      value: 2,
      rate: 4
    };
  }
};
</script>
<style lang="less" scoped>
@import "../assets/less/base.less";
.courseDetail {
  min-height: 667px;
  padding-bottom:50px; 
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
        line-height: 16px;
        padding: 5px;
      }
    }
  }
}
.course-info {
  padding: 10px;
  background: #fff;
  div {
    padding: 5px;
  }
}
.teacher {
  padding: 0 15px;
  margin-top: 10px;
  background: #fff;
  .title {
    padding: 10px 0;
    border-bottom:1px solid @lineColor;
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
      justify-content:space-around;
      i {
        vertical-align: middle;
      }
    }
  }
}
.course-des{
  padding: 0 15px;
  margin-top: 10px;
  background: white;
  .title{
    padding: 10px 0;
    border-bottom: 1px solid @lineColor;
  }
  .description{
    padding: 10px 0;
  }
}
.order-btn{
  margin-top: 10px;
  button{
    border: none;
    background: @mainColor;
    width: 100%;
    color: white;
  }
}
</style>