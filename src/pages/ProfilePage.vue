<script setup>

import { useRouter } from "vue-router";
import { useUserStore } from "../stores/user";
import { computed } from "vue";
import { useBookingStore } from "../stores/bookingStore";

const router = useRouter();
const store = useUserStore();
const userStore = useUserStore();
const bookingStore = useBookingStore();

const myBookings = computed(() => {
    if (!userStore.currentUser) return [];

    return bookingStore.bookings.filter(
        booking => booking.email === userStore.currentUser.email
    );
});

//Total bookings
const totalBookings = computed(() => {
    return myBookings.value.length;
});

//Upcoming bookings
const upcomingBookings = computed(() => {
    return myBookings.value.length;
});

//Cancelled booking
const cancelledBookings = computed(() =>
    myBookings.value.filter(
        booking => booking.status === "Cancelled"
    ).length
);

function logout(){
	store.logout();
	router.push("/");
}



</script>

<template>

<div class="container py-5">
    <div class="row justify-content-center">
        <div class="col-lg-6">
            <div class="card shadow-lg">
                <div class="card-body p-5">

    <!-- Profile Content -->
    				<div class="text-center">
					    <i
					        class="bi bi-person-circle text-primary"
					        style="font-size:100px"
					    ></i>

					    <h2 class="fw-bold mt-3">
					        {{ userStore.currentUser.firstName }}
					        {{ userStore.currentUser.lastName }}
					    </h2>

					    <p class="text-muted">
					        Airline Passenger
					    </p>

					    <span class="badge bg-success">
					        Active Member
					    </span>
					</div>

					<ul class="list-group list-group-flush mt-5">
					    <li class="list-group-item d-flex justify-content-between">
					        <strong>
					            <i class="bi bi-envelope-fill text-primary me-2"></i>
					            Email
					        </strong>

					        <span>
					            {{ userStore.currentUser.email }}
					        </span>
					    </li>

					    <li class="list-group-item d-flex justify-content-between">
					        <strong>
					            <i class="bi bi-phone-fill text-primary me-2"></i>
					            Mobile
					        </strong>
					        <span>
					            {{ userStore.currentUser.mobileNo }}
					        </span>
					    </li>
					</ul>

					<div class="row text-center mt-5">
					    <div class="col">
					        <div class="card bg-light">
					            <div class="card-body">
					             <h3>{{ totalBookings }}</h3>
					                <small>
					                    Bookings
					                </small>
					            </div>
					        </div>
					    </div>

					    <div class="col">
					        <div class="card bg-light">
					            <div class="card-body">
							<h3>{{ upcomingBookings }}</h3>
					                <small>
					                    Upcoming
					                </small>
					            </div>
					        </div>
					    </div>

					    <div class="col">
					        <div class="card bg-light">
					            <div class="card-body">
							<h3>{{ cancelledBookings }}</h3>
					                <small>
					                    Cancelled
					                </small>
					            </div>
					        </div>
					    </div>
					</div>

					<div class="d-grid gap-3 mt-5">
					    <router-link
					        to="/search-flights"
					        class="btn btn-primary rounded-pill"
					    >
					        <i class="bi bi-search me-2"></i>
					        Search Flights
					    </router-link>

					    <router-link
					        to="/booking-history"
					        class="btn btn-outline-success rounded-pill"
					    >
					        <i class="bi bi-journal-text me-2"></i>
					        My Bookings
					    </router-link>

					    <button
					        class="btn btn-outline-danger rounded-pill"
					        @click="logout"
					    >
					        <i class="bi bi-box-arrow-right me-2"></i>
					        Logout
					    </button>
					</div>


                </div>
            </div>
        </div>
    </div>
</div>

</template>