<script setup>
import Navbar from "./components/NavBar.vue";
import Footer from "./components/Footer.vue";
</script>

<template>
  <div>

    <Navbar />

    <main class="container mt-4 mb-5">
      <router-view />
    </main>

    <Footer />

  </div>
</template>