<template>
<div>
  <router-view></router-view>
  <van-tabbar route  >
    <van-tabbar-item icon="home-o" replace to="/home">首页</van-tabbar-item>
    <van-tabbar-item icon="notes-o" replace to="/home/course">课程</van-tabbar-item>
    <van-tabbar-item icon="apps-o" replace to="/home/serve">服务</van-tabbar-item>
    <van-tabbar-item icon="contact" replace to="/home/my">我的</van-tabbar-item>
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
h1{
  color: red;
}
</style>
