<template>
  <div id="app">
    <WordManager />
  </div>
</template>

<script>
import WordManager from './components/WordManager.vue'

export default {
  name: 'App',
  components: {
    WordManager
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f5f5f5;
}

#app {
  width: 100%;
  min-height: 100vh;
}
</style>