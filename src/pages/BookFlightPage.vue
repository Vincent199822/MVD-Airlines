<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useBookingStore } from "../stores/bookingStore";
import { useFlightStore } from "../stores/flightStore";
import { useUserStore } from "../stores/user";
import api from "../api/axios";

const route = useRoute();
const router = useRouter();

const bookingStore = useBookingStore();
const flightStore = useFlightStore();
const userStore = useUserStore();


// ========================================
// FLIGHT
// ========================================

const flight = ref(null);
const errorMessage = ref("");


// ========================================
// SEAT
// ========================================

const selectedSeat = ref("");


// ========================================
// MEALS
// ========================================

const selectedMeals = ref([]);
const meals = ref([]);


// ========================================
// ADD-ONS
// ========================================

const selectedAddOns = ref([]);
const addOns = ref([]);


// ========================================
// TAX
// ========================================

const tax = 750;


// ========================================
// PASSENGER
// ========================================

const passenger = computed(() => {
    return userStore.currentUser || {};
});


// ========================================
// FLIGHT PRICE
// ========================================

const flightPrice = computed(() => {
    return flight.value?.price || 0;
});


// ========================================
// MEALS TOTAL
// ========================================

const mealsTotal = computed(() => {

    return selectedMeals.value.reduce(
        (total, selectedName) => {

            const meal = meals.value.find(
                item => item.name === selectedName
            );

            return total + (meal ? meal.price : 0);

        },
        0
    );

});


// ========================================
// ADD-ONS TOTAL
// ========================================

const addOnsTotal = computed(() => {

    return selectedAddOns.value.reduce(
        (total, selectedName) => {

            const addOn = addOns.value.find(
                item => item.name === selectedName
            );

            return total + (addOn ? addOn.price : 0);

        },
        0
    );

});

// ========================================
// LOAD MEALS
// ========================================

async function fetchMeals() {

    try {

        const response = await api.get("/meals");

        meals.value = response.data.meals.filter(
            meal => meal.status === "active"
        );

    } catch (error) {

        console.error("Get meals error:", error);

    }

}


// ========================================
// LOAD ADD-ONS
// ========================================

async function fetchAddOns() {

    try {

        const response = await api.get("/addons");

        addOns.value = response.data.addOns.filter(
            addOn => addOn.status === "active"
        );

    } catch (error) {

        console.error("Get add-ons error:", error);

    }

}


// ========================================
// TOTAL PRICE
// ========================================

const totalPrice = computed(() => {

    return (
        flightPrice.value +
        mealsTotal.value +
        addOnsTotal.value +
        tax
    );

});


// ========================================
// SELECT SEAT
// ========================================

function selectSeat(seat) {

    if (
        flight.value?.reservedSeats?.includes(seat)
    ) {
        return;
    }

    selectedSeat.value = seat;

}


// ========================================
// GO BACK
// ========================================

function goBack() {

    router.back();

}


// ========================================
// LOAD FLIGHT
// ========================================

onMounted(async () => {

    errorMessage.value = "";

    const result = await flightStore.getFlightById(
        route.params.id
    );

    if (result.success) {

        flight.value = result.flight;

    } else {

        errorMessage.value =
            result.message || "Unable to load flight.";

    }

    await fetchMeals();
    await fetchAddOns();

});


// ========================================
// CONFIRM BOOKING
// ========================================

const confirmBooking = async () => {

    // Check flight
    if (!flight.value) {

        alert("Flight information is unavailable.");

        return;

    }


    // Check seat
    if (!selectedSeat.value) {

        alert("Please select a seat.");

        return;

    }


    // Check meal
    if (selectedMeals.value.length === 0) {

        alert("Please select at least one meal.");

        return;

    }


    // Create booking
    const result = await bookingStore.createBooking(
        flight.value._id,
        1,
        selectedSeat.value,
        selectedMeals.value,
        selectedAddOns.value
    );


    if (result.success) {

        alert("Booking created successfully!");

        router.push("/booking-history");

    } else {

        alert(
            result.message ||
            "Failed to create booking."
        );

    }

};

</script>


<template>

<div class="container py-4">


    <!-- ========================================
         BOOKING CARD
    ======================================== -->

    <div
        v-if="flight"
        class="card shadow-lg"
    >


        <!-- ========================================
             HEADER
        ======================================== -->

        <div class="card-header bg-success text-white">

            <h2 class="mb-0">
                ✈ Book Flight
            </h2>

        </div>


        <div class="card-body">


            <!-- ========================================
                 FLIGHT INFORMATION
            ======================================== -->

            <h4 class="mb-3">
                Flight Information
            </h4>

            <hr>


            <div class="row">


                <!-- LEFT -->

                <div class="col-md-6">

                    <p>
                        <strong>
                            Flight Number:
                        </strong>

                        {{ flight.flightNumber }}
                    </p>


                    <p>
                        <strong>
                            Route:
                        </strong>

                        {{ flight.origin }}
                        →
                        {{ flight.destination }}
                    </p>


                    <p>
                        <strong>
                            Date:
                        </strong>

                        {{
                            new Date(
                                flight.departureDate
                            ).toLocaleDateString()
                        }}
                    </p>

                </div>


                <!-- RIGHT -->

                <div class="col-md-6">

                    <p>
                        <strong>
                            Departure:
                        </strong>

                        {{
                            new Date(
                                flight.departureDate
                            ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit"
                            })
                        }}
                    </p>


                    <p>
                        <strong>
                            Arrival:
                        </strong>

                        {{
                            new Date(
                                flight.arrivalDate
                            ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit"
                            })
                        }}
                    </p>


                    <p>
                        <strong>
                            Price:
                        </strong>

                        ₱{{ flight.price.toLocaleString() }}

                    </p>

                </div>

            </div>


            <!-- ========================================
                 PASSENGER INFORMATION
            ======================================== -->

            <h4 class="mt-5 mb-3">
                Passenger Information
            </h4>

            <hr>


            <div class="row">


                <!-- LEFT -->

                <div class="col-md-6">

                    <p>
                        <strong>
                            First Name:
                        </strong>

                        {{ passenger.firstName }}
                    </p>


                    <p>
                        <strong>
                            Last Name:
                        </strong>

                        {{ passenger.lastName }}
                    </p>

                </div>


                <!-- RIGHT -->

                <div class="col-md-6">

                    <p>
                        <strong>
                            Email:
                        </strong>

                        {{ passenger.email }}
                    </p>


                    <p>
                        <strong>
                            Mobile:
                        </strong>

                        {{ passenger.mobileNo }}
                    </p>

                </div>

            </div>


            <hr class="my-5">


            <!-- ========================================
                 SEAT SELECTION
            ======================================== -->

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

                    :disabled="
                        flight.reservedSeats.includes(seat)
                    "

                    @click="selectSeat(seat)"
                >

                    {{ seat }}

                </button>

            </div>


            <!-- SEAT LEGEND -->

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


            <!-- ========================================
                 MEALS
            ======================================== -->

            <div class="mb-4">


                <h4 class="mb-3">
                    Select Your Meals
                </h4>


                <p class="text-muted">
                    You can select multiple meals.
                </p>


                <div class="row g-3">


                    <div
                        v-for="meal in meals"
                        :key="meal.name"
                        class="col-md-6"
                    >

                        <div class="card h-100">

                            <div class="card-body">

                                <div class="form-check">


                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        :id="`meal-${meal.name}`"
                                        :value="meal.name"
                                        v-model="selectedMeals"
                                    >


                                    <label
                                        class="form-check-label w-100"
                                        :for="`meal-${meal.name}`"
                                    >


                                        <div
                                            class="d-flex justify-content-between"
                                        >

                                            <strong>
                                                {{ meal.name }}
                                            </strong>


                                            <span>
                                                ₱{{
                                                    meal.price.toLocaleString()
                                                }}
                                            </span>

                                        </div>


                                        <small class="text-muted">
                                            {{ meal.description }}
                                        </small>


                                    </label>


                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            <!-- ========================================
                 ADD-ONS
            ======================================== -->

            <div class="mb-4">


                <h4 class="mb-3">
                    Add-ons
                </h4>


                <p class="text-muted">
                    Select as many add-ons as you want.
                </p>


                <div class="row g-3">


                    <div
                        v-for="addOn in addOns"
                        :key="addOn.name"
                        class="col-md-6"
                    >

                        <div class="card h-100">

                            <div class="card-body">

                                <div class="form-check">


                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        :id="`addon-${addOn.name}`"
                                        :value="addOn.name"
                                        v-model="selectedAddOns"
                                    >


                                    <label
                                        class="form-check-label w-100"
                                        :for="`addon-${addOn.name}`"
                                    >


                                        <div
                                            class="d-flex justify-content-between"
                                        >

                                            <strong>
                                                {{ addOn.name }}
                                            </strong>


                                            <span>
                                                ₱{{
                                                    addOn.price.toLocaleString()
                                                }}
                                            </span>

                                        </div>


                                        <small class="text-muted">
                                            {{ addOn.description }}
                                        </small>


                                    </label>


                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            <!-- ========================================
                 BOOKING SUMMARY
            ======================================== -->

            <div class="card">


                <div class="card-body">


                    <h4 class="mb-4">
                        Booking Summary
                    </h4>


                    <!-- FLIGHT -->

                    <div
                        class="d-flex justify-content-between mb-2"
                    >

                        <span>
                            Flight
                        </span>


                        <strong>
                            ₱{{ flightPrice.toLocaleString() }}
                        </strong>

                    </div>


                    <!-- MEALS -->

                    <div class="mb-3">


                        <strong>
                            Meals
                        </strong>


                        <div
                            v-for="mealName in selectedMeals"
                            :key="mealName"
                            class="d-flex justify-content-between mt-2"
                        >

                            <span>
                                {{ mealName }}
                            </span>


                            <span>

                                ₱{{
                                    (
                                        meals.find(
                                            meal =>
                                                meal.name === mealName
                                        )?.price || 0
                                    ).toLocaleString()
                                }}

                            </span>

                        </div>

                    </div>


                    <!-- MEALS TOTAL -->

                    <div
                        class="d-flex justify-content-between mb-2"
                    >

                        <span>
                            Meals Total
                        </span>


                        <span>
                            ₱{{ mealsTotal.toLocaleString() }}
                        </span>

                    </div>


                    <!-- ADD-ONS -->

                    <div
                        v-if="selectedAddOns.length > 0"
                        class="mb-3"
                    >


                        <strong>
                            Add-ons
                        </strong>


                        <div
                            v-for="addOnName in selectedAddOns"
                            :key="addOnName"
                            class="d-flex justify-content-between mt-2"
                        >

                            <span>
                                {{ addOnName }}
                            </span>


                            <span>

                                ₱{{
                                    (
                                        addOns.find(
                                            addOn =>
                                                addOn.name === addOnName
                                        )?.price || 0
                                    ).toLocaleString()
                                }}

                            </span>

                        </div>

                    </div>


                    <!-- ADD-ONS TOTAL -->

                    <div
                        class="d-flex justify-content-between mb-2"
                    >

                        <span>
                            Add-ons Total
                        </span>


                        <span>
                            ₱{{ addOnsTotal.toLocaleString() }}
                        </span>

                    </div>


                    <!-- TAX -->

                    <div
                        class="d-flex justify-content-between mb-3"
                    >

                        <span>
                            Tax
                        </span>


                        <span>
                            ₱{{ tax.toLocaleString() }}
                        </span>

                    </div>


                    <hr>


                    <!-- TOTAL -->

                    <div
                        class="d-flex justify-content-between"
                    >

                        <strong class="fs-5">
                            Total
                        </strong>


                        <strong class="fs-5">
                            ₱{{ totalPrice.toLocaleString() }}
                        </strong>

                    </div>


                </div>

            </div>


            <!-- ========================================
                 BUTTONS
            ======================================== -->

            <hr class="my-4">


            <div
                class="mt-4 d-flex justify-content-between"
            >


                <!-- BACK -->

                <button
                    class="btn btn-secondary"
                    @click="goBack"
                    :disabled="bookingStore.loading"
                >

                    Back

                </button>


                <!-- CONFIRM -->

                <button
                    class="btn btn-success"
                    :disabled="bookingStore.loading"
                    @click="confirmBooking"
                >


                    <span
                        v-if="bookingStore.loading"
                    >
                        Processing...
                    </span>


                    <span v-else>
                        Confirm Booking
                    </span>


                </button>


            </div>


        </div>

    </div>


    <!-- ========================================
         ERROR
    ======================================== -->

    <div
        v-else
        class="alert alert-danger"
    >

        {{ errorMessage || "Flight information unavailable." }}

    </div>


</div>

</template>