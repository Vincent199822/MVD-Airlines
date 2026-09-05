<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useFlightStore } from "../stores/flightStore";

const route = useRoute();
const flightStore = useFlightStore();

const flight = ref(null);
const loading = ref(true);
const errorMessage = ref("");

onMounted(async () => {

    const result = await flightStore.getFlightById(
        route.params.id
    );

    if (result.success) {
        flight.value = result.flight;
    } else {
        errorMessage.value = result.message;
    }

    loading.value = false;
});
</script>

<template>

<div class="container py-4">

    <!-- Loading -->
    <div
        v-if="loading"
        class="text-center py-5"
    >
        <div class="spinner-border text-primary"></div>

        <p class="mt-3 mb-0">
            Loading flight details...
        </p>
    </div>


    <!-- Error -->
    <div
        v-else-if="errorMessage"
        class="alert alert-danger"
    >
        {{ errorMessage }}
    </div>


    <!-- Flight Details -->
    <div
        v-else-if="flight"
        class="card shadow-lg"
    >

        <!-- Header -->
        <div class="card-header bg-primary text-white">

            <h2 class="mb-1">
                Flight Details
            </h2>

            <small>
                {{ flight.flightNumber }}
            </small>

        </div>


        <div class="card-body">

            <!-- Flight Number + Status -->
            <div class="d-flex justify-content-between align-items-center mb-3">

                <div>
                    <h3 class="fw-bold mb-1">
                        {{ flight.flightNumber }}
                    </h3>

                    <small class="text-muted">
                        Flight Information
                    </small>
                </div>


                <span
                    v-if="flight.status === 'scheduled'"
                    class="badge bg-success text-capitalize"
                >
                    {{ flight.status }}
                </span>

                <span
                    v-else
                    class="badge bg-danger text-capitalize"
                >
                    {{ flight.status }}
                </span>

            </div>


            <hr>


            <!-- Route -->
            <div class="text-center py-3">

                <small class="text-muted">
                    ROUTE
                </small>

                <h3 class="fw-bold mt-2">
                    {{ flight.origin }}
                    <span class="mx-3 text-muted">→</span>
                    {{ flight.destination }}
                </h3>

            </div>


            <hr>


            <!-- Flight Schedule -->
            <div class="row g-4">

                <!-- Departure -->
                <div class="col-md-6">

                    <div class="border rounded p-3 h-100">

                        <h5 class="fw-bold mb-3">
                            Departure
                        </h5>

                        <p class="mb-2">
                            <strong>From:</strong>
                            {{ flight.origin }}
                        </p>

                        <p class="mb-0">
                            <strong>Date & Time:</strong><br>

                            {{ new Date(
                                flight.departureDate
                            ).toLocaleString() }}
                        </p>

                    </div>

                </div>


                <!-- Arrival -->
                <div class="col-md-6">

                    <div class="border rounded p-3 h-100">

                        <h5 class="fw-bold mb-3">
                            Arrival
                        </h5>

                        <p class="mb-2">
                            <strong>To:</strong>
                            {{ flight.destination }}
                        </p>

                        <p class="mb-0">
                            <strong>Date & Time:</strong><br>

                            {{ new Date(
                                flight.arrivalDate
                            ).toLocaleString() }}
                        </p>

                    </div>

                </div>

            </div>


            <hr class="my-4">


            <!-- Flight Availability -->
            <div class="row g-3">

                <!-- Available Seats -->
                <div class="col-md-6">

                    <div class="border rounded p-3">

                        <small class="text-muted">
                            AVAILABLE SEATS
                        </small>

                        <h4 class="fw-bold mt-1 mb-0">
                            {{ flight.availableSeats }}
                        </h4>

                    </div>

                </div>


                <!-- Status -->
                <div class="col-md-6">

                    <div class="border rounded p-3">

                        <small class="text-muted">
                            FLIGHT STATUS
                        </small>

                        <h4 class="fw-bold mt-1 mb-0 text-capitalize">
                            {{ flight.status }}
                        </h4>

                    </div>

                </div>

            </div>


            <hr class="my-4">


            <!-- Price -->
            <div class="d-flex justify-content-between align-items-center">

                <div>
                    <small class="text-muted">
                        FLIGHT PRICE
                    </small>

                    <h3 class="text-success fw-bold mb-0">
                        ₱{{ flight.price.toLocaleString() }}
                    </h3>
                </div>


                <div class="text-end">

                    <small class="text-muted">
                        PER PASSENGER
                    </small>

                </div>

            </div>


            <!-- Buttons -->
            <div class="mt-4 d-flex justify-content-between">

                <router-link
                    class="btn btn-secondary"
                    to="/search-flights"
                >
                    Back
                </router-link>


                <router-link
                    v-if="
                        flight.status === 'scheduled' &&
                        flight.availableSeats > 0
                    "
                    class="btn btn-success"
                    :to="'/book-flight/' + flight._id"
                >
                    Book Flight
                </router-link>

            </div>

        </div>

    </div>


    <!-- Flight Not Found -->
    <div
        v-else
        class="alert alert-danger"
    >
        Flight not found.
    </div>

</div>

</template>