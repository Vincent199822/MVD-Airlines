<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/user";

const router = useRouter();
const store = useUserStore();
const userStore = useUserStore();

const isLoggedIn = computed(() => store.currentUser !== null);

function logout() {
    store.logout();
    router.push("/");
}
</script>

<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
        <div class="container">

            <router-link class="navbar-brand fw-bold text-primary" to="/">
                <i class="bi bi-airplane-engines-fill me-2"></i>
                FlyBook
            </router-link>

            <button
                class="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
            >
                <span class="navbar-toggler-icon"></span>
            </button>

            <div
                class="collapse navbar-collapse"
                id="navbarNav"
            >

                <ul class="navbar-nav ms-auto">

                    <li class="nav-item">
                        <router-link
                            class="nav-link"
                            to="/"
                        >
                            Home
                        </router-link>
                    </li>
<!-- =============== 
    Show only when NOT logged in
    ================ -->
                    <template v-if="!isLoggedIn">

                        <li class="nav-item">
                            <router-link
                                class="nav-link"
                                to="/login"
                            >
                                Login
                            </router-link>
                        </li>

                        <li class="nav-item">
                            <router-link
                                class="nav-link"
                                to="/register"
                            >
                                Register
                            </router-link>
                        </li>

                    </template>
<!-- =============== 
    Show only when logged in
    ================ -->
                    <template v-else>

                        <li class="nav-item" v-if="isLoggedIn">
                            <router-link
                                class="nav-link"
                                to="/search-flights"
                            >
                                Search Flights
                            </router-link>
                        </li>

                        <li class="nav-item" v-if="isLoggedIn">
                            <router-link
                                class="nav-link"
                                to="/booking-history"
                            >
                                My Bookings
                            </router-link>
                        </li>

                        <li class="nav-item">
                            <router-link
                                class="nav-link"
                                to="/profile"
                            >
                                <i class="bi bi-person-circle me-1"></i>
                                {{ userStore.currentUser?.firstName }}
                            </router-link>
                        </li>

                        <li class="nav-item">
                            <button
                                class="btn btn-link nav-link"
                                @click="logout"
                            >
                                Logout
                            </button>
                        </li>
                    </template>
                </ul>
            </div>
        </div>
    </nav>
</template>