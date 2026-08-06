<script setup>
import { useUserStore } from "../stores/user";

const userStore = useUserStore();
</script>

<template>
  <section class="text-center py-5">
<!-- =============== 
    Show Guest Home 
    ================ -->
    <div v-if="!userStore.currentUser">

      <h1 class="display-4 fw-bold">
        Your Journey Begins Here
      </h1>

      <p class="lead mt-3">
        Book domestic and international flights
        quickly, safely, and conveniently.
      </p>

      <div class="mt-4">
        <router-link
          to="/register"
          class="btn btn-primary btn-lg me-3"
        >
          Get Started
        </router-link>

        <router-link
          to="/login"
          class="btn btn-outline-primary btn-lg"
        >
          Login
        </router-link>
      </div>

    </div>
<!-- =============== 
    Show when Logged In Home 
    ================ -->
    <div v-else>

      <h1 class="display-4 fw-bold text-primary">
        Welcome back,
        {{ userStore.currentUser.firstName }}!
        ✈
      </h1>

      <p class="lead mt-3">
        Ready for your next adventure?
      </p>

      <p class="text-muted">
        Search and book flights with just a few clicks.
      </p>

      <div class="mt-4">

        <router-link
          to="/search-flights"
          class="btn btn-success btn-lg me-3"
        >
          <i class="bi bi-search"></i>
          Search Flights
        </router-link>

        <router-link
          to="/booking-history"
          class="btn btn-outline-primary btn-lg"
        >
          <i class="bi bi-journal-text"></i>
          My Bookings
        </router-link>

      </div>

    </div>

  </section>
</template>