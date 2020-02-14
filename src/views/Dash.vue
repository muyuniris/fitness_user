<template>
  <div class="dash">
    <van-swipe :autoplay="3000" class="swiper">
      <van-swipe-item v-for="(image, index) in banners" :key="index">
        <img v-lazy="image" />
      </van-swipe-item>
    </van-swipe>
  </div>
</template>
<script>
export default {
  data(){
    return {
      banners: [
        '/img/banner1.png',
        '/img/banner2.png',
        '/img/banner3.png'
      ]
    }
  }
}
</script>
<style lang="less" scoped>
.dash{
  padding: 0 10px;
  margin-top: 10px;
}
.swiper{
  width: 100%;
  height: 160px;
  margin: 5px auto;
  border-radius: 5px;
  overflow: hidden;
}
.swiper img{
  width: 100%;
  height: 100%;

}
</style>
