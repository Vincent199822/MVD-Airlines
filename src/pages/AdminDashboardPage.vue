<script setup>
import { onMounted, computed } from "vue";
import { useFlightStore } from "../stores/flightStore";

const flightStore = useFlightStore();

onMounted(async () => {
    await flightStore.fetchFlights();
});

const totalFlights = computed(() => {
    return flightStore.flights.length;
});

const scheduledFlights = computed(() => {
    return flightStore.flights.filter(
        flight => flight.status === "scheduled"
    ).length;
});

const cancelledFlights = computed(() => {
    return flightStore.flights.filter(
        flight => flight.status === "cancelled"
    ).length;
});

const totalAvailableSeats = computed(() => {
    return flightStore.flights.reduce(
        (total, flight) => total + flight.availableSeats,
        0
    );
});
</script>

<template>

<div class="container py-4">

    <!-- Header -->
    <div class="mb-4">

        <h2>Admin Dashboard</h2>

        <p class="text-muted">
            Manage MVD Airlines operations.
        </p>

    </div>


    <!-- Statistics -->
    <div class="row g-4 mb-4">

        <!-- Total Flights -->
        <div class="col-md-6 col-lg-3">

            <div class="card h-100">

                <div class="card-body">

                    <h6 class="text-muted">
                        Total Flights
                    </h6>

                    <h2>
                        {{ totalFlights }}
                    </h2>

                </div>

            </div>

        </div>


        <!-- Scheduled Flights -->
        <div class="col-md-6 col-lg-3">

            <div class="card h-100">

                <div class="card-body">

                    <h6 class="text-muted">
                        Scheduled Flights
                    </h6>

                    <h2>
                        {{ scheduledFlights }}
                    </h2>

                </div>

            </div>

        </div>


        <!-- Available Seats -->
        <div class="col-md-6 col-lg-3">

            <div class="card h-100">

                <div class="card-body">

                    <h6 class="text-muted">
                        Available Seats
                    </h6>

                    <h2>
                        {{ totalAvailableSeats }}
                    </h2>

                </div>

            </div>

        </div>


        <!-- Cancelled Flights -->
        <div class="col-md-6 col-lg-3">

            <div class="card h-100">

                <div class="card-body">

                    <h6 class="text-muted">
                        Cancelled Flights
                    </h6>

                    <h2>
                        {{ cancelledFlights }}
                    </h2>

                </div>

            </div>

        </div>

    </div>


    <!-- Management -->
    <div class="row g-4">

        <!-- Flight Management -->
        <div class="col-md-6">

            <div class="card h-100">

                <div class="card-body">

                    <h4>
                        Flight Management
                    </h4>

                    <p class="text-muted">
                        Create, update, and manage airline flights.
                    </p>

                    <router-link
                        to="/admin/flights"
                        class="btn btn-primary"
                    >
                        Manage Flights
                    </router-link>

                </div>

            </div>

        </div>


        <!-- Meal Management -->
        <div class="col-md-6">

            <div class="card h-100">

                <div class="card-body">

                    <h4>
                        Meal Management
                    </h4>

                    <p class="text-muted">
                        Manage meals available for passengers.
                    </p>

                    <router-link
                        to="/admin/meals"
                        class="btn btn-primary"
                    >
                        Manage Meals
                    </router-link>

                </div>

            </div>

        </div>


        <!-- Add-on Management -->
        <div class="col-md-6">

            <div class="card h-100">

                <div class="card-body">

                    <h4>
                        Add-on Management
                    </h4>

                    <p class="text-muted">
                        Manage additional passenger services.
                    </p>

                    <router-link
                        to="/admin/addons"
                        class="btn btn-primary"
                    >
                        Manage Add-ons
                    </router-link>

                </div>

            </div>

        </div>


        <!-- Booking Management -->
        <div class="col-md-6">

            <div class="card h-100">

                <div class="card-body">

                    <h4>
                        Booking Management
                    </h4>

                    <p class="text-muted">
                        View and manage passenger bookings.
                    </p>

                    <router-link
                        to="/admin/bookings"
                        class="btn btn-primary"
                    >
                        Manage Bookings
                    </router-link>

                </div>

            </div>

        </div>

    </div>

</div>

</template>