<script setup>
import { ref, onMounted, computed } from "vue";
import { useFlightStore } from "../stores/flightStore";

const flightStore = useFlightStore();

const flights = ref([]);

const filters = ref({
    from: "",
    to: "",
    departure: ""
});

const origins = computed(() => {
    return [...new Set(
        flightStore.flights.map(flight => flight.origin)
    )];
});

const destinations = computed(() => {
    return [...new Set(
        flightStore.flights.map(flight => flight.destination)
    )];
});


onMounted(async () => {
    const result = await flightStore.fetchFlights();

    if (result.success) {
        flights.value = flightStore.flights;
    } else {
        alert(result.message);
    }
});

function searchFlights() {
    flights.value = flightStore.searchFlights(filters.value);
}

function resetSearch() {
    filters.value = {
        from: "",
        to: "",
        departure: ""
    };

    flights.value = flightStore.flights;
}
</script>

<template>

<div class="container">


<h2 class="mb-4">
    Search Flights
</h2>

<!-- Search Filters -->
<div class="card shadow p-4 mb-4">

    <div class="row">

        <!-- From -->
        <div class="col-md-4 mb-3">

            <label class="form-label">
                From
            </label>

            <select
                class="form-select"
                v-model="filters.from"
            >
                <option value="">Any</option>

                <option
                    v-for="origin in origins"
                    :key="origin"
                    :value="origin"
                >
                    {{ origin }}
                </option>
            </select>
        </div>

        <!-- To -->
        <div class="col-md-4 mb-3">

            <label class="form-label">
                To
            </label>

            <select
                class="form-select"
                v-model="filters.to"
            >
                <option value="">Any</option>

                <option
                    v-for="destination in destinations"
                    :key="destination"
                    :value="destination"
                >
                    {{ destination }}
                </option>
            </select>

        </div>

        <!-- Departure -->
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

    <!-- Buttons -->
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


<!-- Flight Results -->
<div class="row">

    <!-- No flights -->
    <div
        v-if="flights.length === 0"
        class="col-12"
    >
        <div class="alert alert-info">
            No flights found.
        </div>
    </div>


    <!-- Flights -->
    <div
        v-for="flight in flights"
        :key="flight._id"
        class="col-md-6 mb-4"
    >

        <div class="card shadow h-100">

            <div class="card-body">

                <!-- Flight Number -->
                <h4>
                    ✈ {{ flight.flightNumber }}
                </h4>


                <!-- Route -->
                <p>
                    <strong>{{ flight.origin }}</strong>
                    →
                    <strong>{{ flight.destination }}</strong>
                </p>


                <!-- Departure -->
                <p>
                    <strong>Departure:</strong>
                    {{ new Date(flight.departureDate).toLocaleString() }}
                </p>


                <!-- Arrival -->
                <p>
                    <strong>Arrival:</strong>
                    {{ new Date(flight.arrivalDate).toLocaleString() }}
                </p>


                <!-- Price -->
                <p>
                    <strong>Price:</strong>
                    ₱{{ flight.price.toLocaleString() }}
                </p>


                <!-- Available Seats -->
                <p>
                    <strong>Available Seats:</strong>
                    {{ flight.availableSeats }}
                </p>


                <!-- Status -->
                <p>
                    <strong>Status:</strong>

                    <span
                        class="badge"
                        :class="{
                            'bg-success': flight.status === 'scheduled',
                            'bg-warning text-dark': flight.status === 'boarding',
                            'bg-secondary': flight.status === 'departed',
                            'bg-primary': flight.status === 'arrived',
                            'bg-danger': flight.status === 'cancelled'
                        }"
                    >
                        {{ flight.status }}
                    </span>
                </p>


                <!-- View Details -->
                <router-link
                    class="btn btn-primary"
                    :to="'/flight/' + flight._id"
                >
                    View Details
                </router-link>

            </div>

        </div>

    </div>

</div>


</div>

</template>
