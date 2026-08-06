import { createRouter, createWebHistory } from "vue-router";

import { useUserStore } from "../stores/user";

import HomePage from "../pages/HomePage.vue";
import LoginPage from "../pages/LoginPage.vue";
import RegisterPage from "../pages/RegisterPage.vue";
import ProfilePage from "../pages/ProfilePage.vue";
import SearchFlightsPage from "../pages/SearchFlightsPage.vue";
import FlightDetailsPage from "../pages/FlightDetailsPage.vue";
import BookFlightPage from "../pages/BookFlightPage.vue";
import BookingHistoryPage from "../pages/BookingHistoryPage.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomePage,
  },
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
  },
  {
    path: "/register",
    name: "Register",
    component: RegisterPage,
  },
  {
    path: "/profile",
    name: "Profile",
    component: ProfilePage,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/search-flights",
    name: "Search Flights",
    component: SearchFlightsPage,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/flight/:id",
    name: "Flight Details",
    component: FlightDetailsPage,
  },
  {
    path:"/book-flight/:id",
    name:"Book Flight",
    component:BookFlightPage,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/booking-history",
    name: "Booking History",
    component: BookingHistoryPage,
    meta: {
      requiresAuth: true
    }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
    const userStore = useUserStore();
    if(
        to.meta.requiresAuth &&
        !userStore.currentUser
    ){
        return "/login";
    }
});

export default router;