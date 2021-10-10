<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <router-view />
    <!-- <main></main> -->
  </div>
</template>

<script>
// import main from "@/components/Main.vue";
export default {
  name: "App",
  // components: {
  //   main,
  // },
};
</script>

<style>
/* 隐藏滚动条 */
html::-webkit-scrollbar {
  display: none;
}
html {
  overflow-y: scroll;
}
body {
  margin: 0;
  height: 100%;
  width: 100%;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* width: 100%;
  height: 100%; */
}
</style>
