<template>
<div>
  <keep-alive>
    <router-view v-if="$route.meta.keepAlive"></router-view>
  </keep-alive>


  <router-view v-if="!$route.meta.keepAlive"></router-view>
  
  <van-tabbar route active-color="#5e8bb3" inactive-color="#9D9D9D">
    <van-tabbar-item icon="wap-home" replace to="/home">首页</van-tabbar-item>
    <van-tabbar-item icon="label" replace to="/home/course">预约</van-tabbar-item>
    <van-tabbar-item icon="chat" replace to="/home/information">消息</van-tabbar-item>
    <van-tabbar-item icon="manager" replace to="/home/my">我的</van-tabbar-item>
  </van-tabbar>
</div>
 
</template>

<script>
// @ is an alias to /src


export default {
  name: 'Home',
  components: {

  }
}
</script>
<style lang="less" scoped>
</style>
