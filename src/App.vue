<template>
  <div ref="app" id="app" @mousemove="mouseMove">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-2">
          <Sidebar/>
        </div>
        <div class="col-md-10">
          <Results/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import Sidebar from '@/components/Sidebar';
import Results from '@/components/Results';

export default {
  name: 'App',
  components: {
    Sidebar, Results
  },
  mounted() {
    this.$store.dispatch('main/loadAvailableQueryParams');
  },
  methods:{
    mouseMove(event){
      //get mouse position in percentage relative to top element size
      const elementSizes = this.$refs.app.getBoundingClientRect();
      const x = event.clientX - elementSizes.left
      const y = event.clientY - elementSizes.top
      const movement = {
        x: (x*100)/elementSizes.width,
        y: (y*100)/elementSizes.height,
        elementId: event.target.id,
        timestamp: Date.now()
      }
      this.$store.dispatch('sauto/handleMouseMove',{movement});
    }
  }
}
</script>

<style>
#app {
  /*
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  */
  color: #2c3e50;
  margin-top: 20px;
}
</style>
