<template>
  <div class="teacherDetail">
    <div class="banner">
      <div class="bg">
        <img src="/img/header-bg.jpg" alt="">
      </div>
      <div class="name">
        <div class="avtor">
          <img src="/img/img2.jpg" alt="">
        </div>
        <h3>zry</h3>
        <div class="rate">
          评分：
          <van-rate
              v-model="value"
              :size="16"
            />
            <div class="order-btn">
            <van-button type="default" size="small" @click="order(date.id)" color="rgb(245, 176, 29)" plain>立即预约</van-button>

            </div>
        </div>
      </div>
    </div>
    <div class="box">
      <div class="title"><van-icon name="notes-o" :size="20" color="rgb(245, 176, 29)"/> 基础档案</div>
      <div class="main info">
        <div>性别：男</div>
        <div>年龄：23</div>
        <div>电话：12334556
          <a href="tel:12345"><van-icon name="phone-o" :size="20" color="rgb(245, 176, 29)"/></a>
        </div>
      </div>
    </div>
    <div class="box">
      <div class="title"><van-icon name="description" :size="20" color="rgb(245, 176, 29)"/> 个人简介</div>
      <div class="main">
        都是废话还打算尽快发货快递随机发货康师傅
      </div>
    </div>
    <div class="box">
      <div class="title"><van-icon name="records" :size="20" color="rgb(245, 176, 29)"/> 用户评价</div>
      <div class="main">
        都是废话还打算尽快发货快递随机发货康师傅
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return{
      value:4
    }
  }
}
</script>
<style lang="less" scoped>
@import "../assets/less/base.less";
.teacherDetail{
    min-height: 667px;
  padding-bottom: 50px;
  background: @lineColor;
}
.banner{
  background: #fff;
  .bg{
    img{
      width: 100%;
    }
  }
  .name{
    .avtor{
      width: 80px;
      height: 80px;
      border-radius: 50%;
      overflow: hidden;
      margin: 0 auto;
      margin-top: -40px;
      img{
        width: 100%;
      }
    }
  }
  h3{
    text-align: center;
  }
  .rate{
    padding: 10px;
    height: 30px;
    line-height: 30px;
  }
  .order-btn{
    float: right;
  }
}
.box{
  margin-top: 10px;
  background: #fff;
  padding: 0 10px;
  .title{
    padding: 10px 0;
    vertical-align: middle;
    border-bottom: 1px solid @lineColor;
    .van-icon{
    height: 26px;
    line-height: 26px;
    vertical-align: middle;
  }
  }
  .main{
    padding: 5px 0;
  }
}
.info{
  
  div{
    padding: 5px 0;
    .van-icon{
      float: right;
      vertical-align: middle;
    }
  }
}
</style>