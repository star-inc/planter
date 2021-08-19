<template>
  <div class="home">
    <server-bar title="primary" :status="200"/>
  </div>
</template>

<script>
import ServerBar from "../components/ServerBar";

export default {
  name: 'Home',
  components: {
    ServerBar
  }
}
</script>
