<script setup>
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useFlightStore } from "../stores/flightStore";
import { useUserStore } from "../stores/user";

import { useBookingStore } from "../stores/bookingStore";

const selectedSeat = ref("");
const selectedMeal = ref("Standard");
const bookingStore = useBookingStore();

const route = useRoute();
const router = useRouter();

const flightStore = useFlightStore();
const userStore = useUserStore();

const flight = computed(() => {
    return flightStore.getFlightById(route.params.id);
});

const passenger = computed(() => {
    return userStore.currentUser;
});

const tax = computed(() => 750);

const totalPrice = computed(() => {
    return flight.value.price + tax.value;
});

function goBack() {
    router.back();
}

function selectSeat(seat) {
    if (flight.value.reservedSeats.includes(seat)) {
        return;
    }
    selectedSeat.value = seat;
}
// Comfirm Booking
function confirmBooking() {
    if (!selectedSeat.value) {
        alert("Please select a seat.");
        return;
    }

        flightStore.reserveSeat(
		    flight.value.id,
		    selectedSeat.value
		);

    bookingStore.bookFlight({

        id: Date.now(),

        passengerName:
            passenger.value.firstName +
            " " +
            passenger.value.lastName,
        email: passenger.value.email,
        mobileNo: passenger.value.mobileNo,
        flightId: flight.value.id,
        airline: flight.value.airline,

        flightNumber: flight.value.flightNumber,
        from: flight.value.from,
        to: flight.value.to,
        departure: flight.value.departure,
        departureTime: flight.value.departureTime,

        arrivalTime: flight.value.arrivalTime,
        seat: selectedSeat.value,
        meal: selectedMeal.value,
        price: flight.value.price,

        tax: tax.value,
        total: totalPrice.value,

        bookedAt: new Date().toLocaleString(),

        status: "Confirmed"

    });



    alert("Flight booked successfully!");
    router.push("/booking-history");
}


</script>

<template>
<div class="container py-4">

    <div
        v-if="flight"
        class="card shadow-lg"
    >

        <div class="card-header bg-success text-white">

            <h2>
                ✈ Book Flight
            </h2>

        </div>

        <div class="card-body">

            <!-- Flight Information -->

            <h4 class="mb-3">
                Flight Information
            </h4>

            <hr>

            <div class="row">

                <div class="col-md-6">

                    <p>
                        <strong>Airline:</strong>
                        {{ flight.airline }}
                    </p>

                    <p>
                        <strong>Flight Number:</strong>
                        {{ flight.flightNumber }}
                    </p>

                    <p>
                        <strong>Route:</strong>
                        {{ flight.from }} → {{ flight.to }}
                    </p>

                    <p>
                        <strong>Date:</strong>
                        {{ flight.departure }}
                    </p>

                </div>

                <div class="col-md-6">

                    <p>
                        <strong>Departure:</strong>
                        {{ flight.departureTime }}
                    </p>

                    <p>
                        <strong>Arrival:</strong>
                        {{ flight.arrivalTime }}
                    </p>

                    <p>
                        <strong>Cabin:</strong>
                        {{ flight.cabin }}
                    </p>

                    <p>
                        <strong>Price:</strong>

                        ₱{{ flight.price.toLocaleString() }}

                    </p>

                </div>

            </div>

            <!-- Passenger Information -->

            <h4 class="mt-5 mb-3">
                Passenger Information
            </h4>

            <hr>

            <div class="row">

                <div class="col-md-6">

                    <p>
                        <strong>First Name:</strong>

                        {{ passenger.firstName }}

                    </p>

                    <p>
                        <strong>Last Name:</strong>

                        {{ passenger.lastName }}

                    </p>

                </div>

                <div class="col-md-6">

                    <p>
                        <strong>Email:</strong>

                        {{ passenger.email }}

                    </p>

                    <p>
                        <strong>Mobile:</strong>

                        {{ passenger.mobileNo }}

                    </p>

                </div>

            </div>

            <hr class="my-5">
 <!-- Seat selection -->
			<h4 class="mb-3">
			    Choose Your Seat
			</h4>

			<div class="d-flex flex-wrap gap-2 mb-3">

			    <button
			        v-for="seat in flight.seats"
			        :key="seat"
			        class="btn"

			        :class="{
			            'btn-success':
			                !flight.reservedSeats.includes(seat) &&
			                selectedSeat !== seat,
			            'btn-primary':
			                selectedSeat === seat,
			            'btn-danger':
			                flight.reservedSeats.includes(seat)
			        }"

			        :disabled="flight.reservedSeats.includes(seat)"
			        @click="selectSeat(seat)"
			    >
			        {{ seat }}
			    </button>
			</div>

			<div class="mb-4">
			    <span class="badge bg-success me-2">
			        Available
			    </span>

			    <span class="badge bg-primary me-2">
			        Selected
			    </span>

			    <span class="badge bg-danger">
			        Reserved
			    </span>
			</div>

			<hr class="my-4">
<!-- Meal Preference -->
			<h4 class="mb-3">
			    Meal Preference
			</h4>

			<div class="form-check">
			    <input
			        class="form-check-input"
			        type="radio"
			        id="standard"
			        value="Standard"
			        v-model="selectedMeal"
			    >
			    <label class="form-check-label" for="standard">
			        Standard
			    </label>
			</div>

			<div class="form-check">
			    <input
			        class="form-check-input"
			        type="radio"
			        id="vegetarian"
			        value="Vegetarian"
			        v-model="selectedMeal"
			    >
			    <label class="form-check-label" for="vegetarian">
			        Vegetarian
			    </label>
			</div>

			<div class="form-check">
			    <input
			        class="form-check-input"
			        type="radio"
			        id="halal"
			        value="Halal"
			        v-model="selectedMeal"
			    >
			    <label class="form-check-label" for="halal">
			        Halal
			    </label>
			</div>

			<div class="form-check">
			    <input
			        class="form-check-input"
			        type="radio"
			        id="vegan"
			        value="Vegan"
			        v-model="selectedMeal"
			    >
			    <label class="form-check-label" for="vegan">
			        Vegan
			    </label>
			</div>
<!-- Booking Summary -->
			<hr class="my-4">

			<div class="card bg-light">
			    <div class="card-body">
			        <h4 class="mb-3">
			            Booking Summary
			        </h4>

			        <div class="d-flex justify-content-between">
			            <span>Flight Price</span>
			            <strong>₱ {{ flight.price.toLocaleString() }}</strong>
			        </div>

			        <div class="d-flex justify-content-between">
			            <span>Taxes</span>
			            <strong>₱ {{ tax.toLocaleString() }}</strong>
			        </div>

			        <div class="d-flex justify-content-between">
			            <span>Seat</span>
			            <strong>
			                {{ selectedSeat || "Not Selected" }}
			            </strong>
			        </div>

			        <div class="d-flex justify-content-between">
			            <span>Meal</span>
			            <strong>{{ selectedMeal }}</strong>
			        </div>

			        <hr>

			        <div class="d-flex justify-content-between">
			            <h5>Total</h5>
			            <h5 class="text-success">
			                ₱ {{ totalPrice.toLocaleString() }}
			            </h5>
			        </div>
			    </div>
			</div>
	<!-- Button -->		
			<hr class="my-4">

			<div class="mt-4 d-flex justify-content-between">
			    <button
			        class="btn btn-secondary"
			        @click="goBack"
			    >
			        Back
			    </button>

			    <button
			        class="btn btn-success"
			        @click="confirmBooking"
			    >
			        Confirm Booking
			    </button>
			</div>
        </div>
    </div>

</div>

</template>