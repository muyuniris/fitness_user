<template>
  <div class="courseDetail">
    <div class="banner">
      <img :src="img" alt />
      <div class="banner-info">
        <div class="info">
          <div class="name">零基础背部塑型</div>
          <div class="rate">
            <span>K{{value}} </span>
            <van-rate
              v-model="value"
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
        <van-icon name="clock-o" />2月18日 07：00 - 07：30
      </div>
      <div>
        <van-icon name="wap-home-o" />瑜伽室
      </div>
      <div>
        <van-icon name="friends-o" />名额：8个 剩余：2个
      </div>
      <div>
        <van-icon name="after-sale" />20元
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
      <div
        class="description"
      >的考生是否会看到回复客户收到开发计划的款式反馈收到回复客户收到付款饭后漱口多方核实尽快发货见客户首付款首付款是对回复开始疯狂撒金凤凰啊还是房卡就行</div>
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
    background: @mainColor;
    width: 100%;
    color: white;
  }
}
</style>