<script setup>
import { ref } from "vue";
import { useFlightStore } from "../stores/flightStore";

const flightStore = useFlightStore();

const flights = ref(flightStore.flights);

const filters = ref({
    from: "",
    to: "",
    departure: ""
});

function searchFlights(){

    flights.value = flightStore.searchFlights(filters.value);

}

function resetSearch(){

    filters.value = {
        from:"",
        to:"",
        departure:""
    }

    flights.value = flightStore.flights;

}
</script>

<template>

<div class="container">

    <h2 class="mb-4">
        Search Flights
    </h2>

    <div class="card shadow p-4 mb-4">

        <div class="row">

            <div class="col-md-4 mb-3">

                <label class="form-label">
                    From
                </label>

                <select
                    class="form-select"
                    v-model="filters.from"
                >
                    <option value="">Any</option>
                    <option>Manila</option>
                </select>

            </div>

            <div class="col-md-4 mb-3">

                <label class="form-label">
                    To
                </label>

                <select
                    class="form-select"
                    v-model="filters.to"
                >
                    <option value="">Any</option>
                    <option>Tokyo</option>
                    <option>Singapore</option>
                    <option>Seoul</option>
                </select>

            </div>

            <div class="col-md-4 mb-3">

                <label class="form-label">
                    Departure
                </label>

                <input
                    type="date"
                    class="form-control"
                    v-model="filters.departure"
                >

            </div>

        </div>

        <div>

            <button
                class="btn btn-primary me-2"
                @click="searchFlights"
            >
                Search
            </button>

            <button
                class="btn btn-secondary"
                @click="resetSearch"
            >
                Reset
            </button>

        </div>

    </div>

    <div class="row">

        <div
            class="col-md-6 mb-4"
            v-for="flight in flights"
            :key="flight.id"
        >

            <div class="card shadow h-100">

                <div class="card-body">

                    <h4>
                        ✈ {{ flight.airline }}
                    </h4>

                    <p>
                        <strong>{{ flight.from }}</strong>
                        →
                        <strong>{{ flight.to }}</strong>
                    </p>

                    <p>

                        Flight Number:
                        {{ flight.flightNumber }}

                    </p>

                    <p>

                        Departure:
                        {{ flight.departure }}

                    </p>

                    <p>

                        Time:
                        {{ flight.departureTime }}

                    </p>

                    <p>

                        Price:

                        ₱{{ flight.price.toLocaleString() }}

                    </p>

                    <router-link
                        class="btn btn-primary"
                        :to="'/flight/' + flight.id"
                    >
                        View Details
                    </router-link>

                </div>

            </div>

        </div>

    </div>

</div>

</template>