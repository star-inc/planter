<template>
  <div>
    <div>
      <h1>p.mume</h1>
      <p>All static status page system.</p>
    </div>
    <div>
      <h2>License</h2>
      <p class="license" v-html="license"></p>
    </div>
    <p id="copyright">&copy; 2020 <a href="https://starinc.xyz">Star Inc.</a></p>
  </div>
</template>

<script>
import License from "!raw-loader!@/../LICENSE";

export default {
  name: "Application",
  computed: {
    license: () => License.replace(/\n/g, "<br />"),
  },
};
</script>

<style lang="scss" scoped>
.license {
  padding: 10px;
  background: #111;
}

#copyright a {
    color: #fff;
}
</style>
