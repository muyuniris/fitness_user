<template>
  <div>
    <input type="text">
    <button @click=pay>支付</button>
    <div v-html="alipayWap" ref="alipayWap"></div>
  </div>
</template>
<script>
// @ is an alias to /src


export default {
  data(){
    return {
      alipayWap: ''
    }
  }, 
  methods: {
    pay(){
      console.log("支付");
      this.axios.post("/alipay/pay")
      .then(res=>{
        console.log(res.data);
        this.alipayWap = res.data;
        this.$nextTick(() => {
          this.$refs.alipayWap.children[0].submit()
        })
      })
      .catch(err=>{
        console.log(err);
      })
    }
  },
  created(){
    this.axios.post("http://localhost:3000/alipay/notify")
  }
}
</script>
<style lang="less" scoped>

</style>
