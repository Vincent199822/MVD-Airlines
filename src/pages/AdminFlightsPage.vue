<script setup>
import { onMounted, computed, ref } from "vue";
import { useFlightStore } from "../stores/flightStore";

const flightStore = useFlightStore();

const flights = computed(() => flightStore.flights);

// Show/hide Add Flight form
const showAddForm = ref(false);

// Form data
const flightForm = ref({
    flightNumber: "",
    origin: "",
    destination: "",
    departureDate: "",
    arrivalDate: "",
    price: "",
    availableSeats: ""
});

// Form message
const formMessage = ref("");
const formError = ref(false);

const submitting = ref(false);

// Show/hide Edit Flight form
const showEditForm = ref(false);

// Currently selected flight
const editingFlight = ref(null);

// Edit form data
const editForm = ref({
    flightNumber: "",
    origin: "",
    destination: "",
    departureDate: "",
    arrivalDate: "",
    price: "",
    status: "scheduled"
});


onMounted(async () => {
    await flightStore.fetchFlights();
});


function formatDate(date) {
    return new Date(date).toLocaleString();
}


// Reset form
function resetForm() {

    flightForm.value = {
        flightNumber: "",
        origin: "",
        destination: "",
        departureDate: "",
        arrivalDate: "",
        price: "",
        availableSeats: ""
    };

    formMessage.value = "";
    formError.value = false;
}


// Open Add Flight form
function openAddForm() {
    resetForm();
    showAddForm.value = true;
}

// Open Edit Flight form
function openEditForm(flight) {

    editingFlight.value = flight;

    editForm.value = {
        flightNumber: flight.flightNumber,
        origin: flight.origin,
        destination: flight.destination,
        departureDate: flight.departureDate
            ? flight.departureDate.slice(0, 16)
            : "",
        arrivalDate: flight.arrivalDate
            ? flight.arrivalDate.slice(0, 16)
            : "",
        price: flight.price,
        status: flight.status
    };

    showEditForm.value = true;
}

// Close Edit Flight form
function closeEditForm() {

    showEditForm.value = false;

    editingFlight.value = null;

    editForm.value = {
        flightNumber: "",
        origin: "",
        destination: "",
        departureDate: "",
        arrivalDate: "",
        price: "",
        status: "scheduled"
    };
}

// Update Flight
async function submitEditFlight() {

    formMessage.value = "";
    formError.value = false;
    submitting.value = true;

    const flightData = {
        flightNumber: editForm.value.flightNumber,
        origin: editForm.value.origin,
        destination: editForm.value.destination,
        departureDate: editForm.value.departureDate,
        arrivalDate: editForm.value.arrivalDate,
        price: Number(editForm.value.price),
        status: editForm.value.status
    };

    const result = await flightStore.updateFlight(
        editingFlight.value._id,
        flightData
    );

    submitting.value = false;

    if (!result.success) {

        formError.value = true;
        formMessage.value = result.message;

        return;
    }

    closeEditForm();
}

// Delete Flight
async function handleDeleteFlight(flight) {

    const confirmed = confirm(
        `Are you sure you want to delete flight ${flight.flightNumber}?`
    );

    if (!confirmed) {
        return;
    }

    formMessage.value = "";
    formError.value = false;
    submitting.value = true;

    const result = await flightStore.deleteFlight(
        flight._id
    );

    submitting.value = false;

    if (!result.success) {

        formError.value = true;
        formMessage.value = result.message;

        return;
    }

    formMessage.value = "Flight deleted successfully.";
}


// Close Add Flight form
function closeAddForm() {

    showAddForm.value = false;

    resetForm();
}


// Create Flight
async function submitFlight() {

    formMessage.value = "";
    formError.value = false;

    submitting.value = true;

    const flightData = {
        flightNumber: flightForm.value.flightNumber,
        origin: flightForm.value.origin,
        destination: flightForm.value.destination,
        departureDate: flightForm.value.departureDate,
        arrivalDate: flightForm.value.arrivalDate,
        price: Number(flightForm.value.price),
        availableSeats: Number(flightForm.value.availableSeats)
    };

    const result = await flightStore.createFlight(flightData);

    submitting.value = false;

    if (!result.success) {

        formError.value = true;
        formMessage.value = result.message;

        return;
    }

    formMessage.value = "Flight created successfully.";

    // Close form after successful creation
    showAddForm.value = false;

    resetForm();
}

</script>


<template>

<div class="container py-4">

    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">

        <div>

            <h2>
                Flight Management
            </h2>

            <p class="text-muted mb-0">
                Manage all MVD Airlines flights.
            </p>

        </div>


        <div>

            <router-link
                to="/admin"
                class="btn btn-secondary me-2"
            >
                Back to Dashboard
            </router-link>

            <button
                class="btn btn-primary"
                @click="openAddForm"
            >
                Add Flight
            </button>

        </div>

    </div>


    <!-- Add Flight Form -->
    <div
        v-if="showAddForm"
        class="card mb-4"
    >

        <div class="card-body">

            <h4 class="mb-4">
                Add New Flight
            </h4>


            <form @submit.prevent="submitFlight">

                <div class="row g-3">


                    <!-- Flight Number -->
                    <div class="col-md-6">

                        <label class="form-label">
                            Flight Number
                        </label>

                        <input
                            v-model="flightForm.flightNumber"
                            type="text"
                            class="form-control"
                            placeholder="Example: MVD104"
                            required
                        >

                    </div>


                    <!-- Price -->
                    <div class="col-md-6">

                        <label class="form-label">
                            Price
                        </label>

                        <input
                            v-model="flightForm.price"
                            type="number"
                            class="form-control"
                            min="0"
                            placeholder="Example: 18000"
                            required
                        >

                    </div>


                    <!-- Origin -->
                    <div class="col-md-6">

                        <label class="form-label">
                            Origin
                        </label>

                        <input
                            v-model="flightForm.origin"
                            type="text"
                            class="form-control"
                            placeholder="Example: Manila"
                            required
                        >

                    </div>


                    <!-- Destination -->
                    <div class="col-md-6">

                        <label class="form-label">
                            Destination
                        </label>

                        <input
                            v-model="flightForm.destination"
                            type="text"
                            class="form-control"
                            placeholder="Example: Tokyo"
                            required
                        >

                    </div>


                    <!-- Departure -->
                    <div class="col-md-6">

                        <label class="form-label">
                            Departure Date & Time
                        </label>

                        <input
                            v-model="flightForm.departureDate"
                            type="datetime-local"
                            class="form-control"
                            required
                        >

                    </div>


                    <!-- Arrival -->
                    <div class="col-md-6">

                        <label class="form-label">
                            Arrival Date & Time
                        </label>

                        <input
                            v-model="flightForm.arrivalDate"
                            type="datetime-local"
                            class="form-control"
                            required
                        >

                    </div>


                    <!-- Available Seats -->
                    <div class="col-md-6">

                        <label class="form-label">
                            Number of Seats
                        </label>

                        <input
                            v-model="flightForm.availableSeats"
                            type="number"
                            class="form-control"
                            min="1"
                            placeholder="Example: 180"
                            required
                        >

                        <small class="text-muted">
                            Seat numbers will be generated automatically.
                        </small>

                    </div>


                </div>


                <!-- Message -->
                <div
                    v-if="formMessage"
                    class="alert mt-4"
                    :class="formError
                        ? 'alert-danger'
                        : 'alert-success'"
                >
                    {{ formMessage }}
                </div>


                <!-- Buttons -->
                <div class="mt-4">

                    <button
                        type="submit"
                        class="btn btn-primary me-2"
                        :disabled="submitting"
                    >
                        {{ submitting
                            ? "Creating..."
                            : "Create Flight"
                        }}
                    </button>

                    <button
                        type="button"
                        class="btn btn-secondary"
                        @click="closeAddForm"
                    >
                        Cancel
                    </button>

                </div>

            </form>

        </div>

    </div>

<!-- Edit Flight Form -->
<div
    v-if="showEditForm"
    class="card mb-4"
>
    <div class="card-body">

        <h4 class="mb-4">
            Edit Flight
        </h4>

        <form @submit.prevent="submitEditFlight">

            <div class="row g-3">

                <!-- Flight Number -->
                <div class="col-md-6">

                    <label class="form-label">
                        Flight Number
                    </label>

                    <input
                        v-model="editForm.flightNumber"
                        type="text"
                        class="form-control"
                        required
                    >

                </div>


                <!-- Price -->
                <div class="col-md-6">

                    <label class="form-label">
                        Price
                    </label>

                    <input
                        v-model="editForm.price"
                        type="number"
                        class="form-control"
                        min="0"
                        required
                    >

                </div>


                <!-- Origin -->
                <div class="col-md-6">

                    <label class="form-label">
                        Origin
                    </label>

                    <input
                        v-model="editForm.origin"
                        type="text"
                        class="form-control"
                        required
                    >

                </div>


                <!-- Destination -->
                <div class="col-md-6">

                    <label class="form-label">
                        Destination
                    </label>

                    <input
                        v-model="editForm.destination"
                        type="text"
                        class="form-control"
                        required
                    >

                </div>


                <!-- Departure -->
                <div class="col-md-6">

                    <label class="form-label">
                        Departure Date & Time
                    </label>

                    <input
                        v-model="editForm.departureDate"
                        type="datetime-local"
                        class="form-control"
                        required
                    >

                </div>


                <!-- Arrival -->
                <div class="col-md-6">

                    <label class="form-label">
                        Arrival Date & Time
                    </label>

                    <input
                        v-model="editForm.arrivalDate"
                        type="datetime-local"
                        class="form-control"
                        required
                    >

                </div>


                <!-- Status -->
                <div class="col-md-6">

                    <label class="form-label">
                        Status
                    </label>

                    <select
                        v-model="editForm.status"
                        class="form-select"
                        required
                    >

                        <option value="scheduled">
                            Scheduled
                        </option>

                        <option value="boarding">
                            Boarding
                        </option>

                        <option value="departed">
                            Departed
                        </option>

                        <option value="arrived">
                            Arrived
                        </option>

                        <option value="cancelled">
                            Cancelled
                        </option>

                    </select>

                </div>

            </div>


            <!-- Message -->
            <div
                v-if="formMessage"
                class="alert mt-4"
                :class="formError
                    ? 'alert-danger'
                    : 'alert-success'"
            >
                {{ formMessage }}
            </div>


            <!-- Buttons -->
            <div class="mt-4">

                <button
                    type="submit"
                    class="btn btn-primary me-2"
                    :disabled="submitting"
                >
                    {{ submitting
                        ? "Updating..."
                        : "Update Flight"
                    }}
                </button>

                <button
                    type="button"
                    class="btn btn-secondary"
                    @click="closeEditForm"
                >
                    Cancel
                </button>

            </div>

        </form>

    </div>
</div>

    <!-- Flight Table -->
    <div class="card">

        <div class="card-body">

            <h5 class="mb-3">
                All Flights
            </h5>


            <div class="table-responsive">

                <table class="table table-hover align-middle">

                    <thead>

                        <tr>
                            <th>Flight</th>
                            <th>Route</th>
                            <th>Departure</th>
                            <th>Arrival</th>
                            <th>Price</th>
                            <th>Seats</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>

                    </thead>


                    <tbody>

                        <tr
                            v-for="flight in flights"
                            :key="flight._id"
                        >

                            <td>
                                <strong>
                                    {{ flight.flightNumber }}
                                </strong>
                            </td>


                            <td>
                                {{ flight.origin }}
                                →
                                {{ flight.destination }}
                            </td>


                            <td>
                                {{ formatDate(flight.departureDate) }}
                            </td>


                            <td>
                                {{ formatDate(flight.arrivalDate) }}
                            </td>


                            <td>
                                ₱{{ flight.price.toLocaleString() }}
                            </td>


                            <td>
                                {{ flight.availableSeats }}
                            </td>


                            <td>
                                {{ flight.status }}
                            </td>


                            <td>

								<button
								    class="btn btn-sm btn-primary me-2"
								    @click="openEditForm(flight)"
								>
								    Edit
								</button>

								<button
								    class="btn btn-sm btn-danger"
								    @click="handleDeleteFlight(flight)"
								>
								    Delete
								</button>

                            </td>

                        </tr>


                        <!-- No flights -->
                        <tr v-if="flights.length === 0">

                            <td
                                colspan="8"
                                class="text-center py-4"
                            >
                                No flights found.
                            </td>

                        </tr>

                    </tbody>

                </table>

            </div>

        </div>

    </div>

</div>

</template>