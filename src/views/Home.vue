<template>
<div>
  <router-view style="height:"></router-view>
  <van-tabbar route  >
    <van-tabbar-item icon="home-o" replace to="/home">首页</van-tabbar-item>
    <van-tabbar-item icon="notes-o" replace to="/home/course">课程</van-tabbar-item>
    <van-tabbar-item icon="smile-comment-o" replace to="/home/community">社区</van-tabbar-item>
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
