<script setup>

import { onMounted } from "vue";
import { useBookingStore } from "../stores/bookingStore";
import { useUserStore } from "../stores/user";

const bookingStore = useBookingStore();
const userStore = useUserStore();


// Load bookings when page opens
onMounted(async () => {

    await bookingStore.fetchMyBookings();

});


// Format date
function formatDate(date) {

    if (!date) return "";

    return new Date(date).toLocaleDateString();

}


// Cancel booking
async function cancelBooking(id) {

    const confirmCancel = confirm(
        "Are you sure you want to cancel this booking?"
    );

    if (!confirmCancel) return;


    const result = await bookingStore.cancelBooking(id);


    if (result.success) {

        alert("Booking cancelled successfully.");

    } else {

        alert(result.message);

    }

}


// Delete cancelled booking
async function deleteBooking(id) {

    const confirmDelete = confirm(
        "Are you sure you want to permanently delete this cancelled booking?"
    );

    if (!confirmDelete) return;


    const result = await bookingStore.deleteBooking(id);


    if (result.success) {

        alert("Cancelled booking deleted successfully.");

    } else {

        alert(result.message);

    }

}

</script>


<template>

<div class="container py-4">

    <h2 class="mb-4">
        My Bookings
    </h2>


    <!-- ========================================
         LOADING
    ======================================== -->

    <div
        v-if="bookingStore.loading"
        class="alert alert-info"
    >
        Loading your bookings...
    </div>


    <!-- ========================================
         ERROR
    ======================================== -->

    <div
        v-if="bookingStore.error"
        class="alert alert-danger"
    >
        {{ bookingStore.error }}
    </div>


    <!-- ========================================
         NO BOOKINGS
    ======================================== -->

    <div
        v-if="
            !bookingStore.loading &&
            bookingStore.bookings.length === 0
        "
        class="alert alert-info"
    >
        You have no flight bookings yet.
    </div>


    <!-- ========================================
         BOOKING CARDS
    ======================================== -->

    <div
        v-for="booking in bookingStore.bookings"
        :key="booking._id"
        class="card shadow mb-4"
    >


        <!-- ========================================
             HEADER
        ======================================== -->

        <div class="card-header bg-primary text-white">

            <h5 class="mb-0">
                ✈ {{ booking.flight?.flightNumber }}
            </h5>

        </div>


        <div class="card-body">

            <div class="row">


                <!-- ========================================
                     FLIGHT INFORMATION
                ======================================== -->

                <div class="col-md-6">

                    <h5 class="mb-3">
                        Flight Information
                    </h5>


                    <p>
                        <strong>Flight Number:</strong>

                        {{ booking.flight?.flightNumber }}

                    </p>


                    <p>
                        <strong>Route:</strong>

                        {{ booking.flight?.origin }}

                        →

                        {{ booking.flight?.destination }}

                    </p>


                    <p>
                        <strong>Departure:</strong>

                        {{ formatDate(
                            booking.flight?.departureDate
                        ) }}

                    </p>


                    <p>
                        <strong>Passengers:</strong>

                        {{ booking.passengers }}

                    </p>

                </div>


                <!-- ========================================
                     BOOKING INFORMATION
                ======================================== -->

                <div class="col-md-6">

                    <h5 class="mb-3">
                        Booking Information
                    </h5>


                    <!-- Passenger -->

                    <p>
                        <strong>Passenger:</strong>

                        {{ userStore.currentUser?.firstName }}

                        {{ userStore.currentUser?.lastName }}

                    </p>


                    <!-- Seat -->

                    <p>
                        <strong>Seat:</strong>

                        <span class="badge bg-primary">
                            {{ booking.seat }}
                        </span>

                    </p>


                   <!-- Meals -->
<div class="mb-3">
    <strong>Meals:</strong>

    <div
        v-if="booking.meals && booking.meals.length > 0"
        class="mt-2 ms-4"
    >
        <div
            v-for="meal in booking.meals"
            :key="meal.name"
            class="d-flex justify-content-between mb-2"
        >
            <span>
                {{ meal.name }}
            </span>

            <span class="text-muted ms-3">
                ₱{{ meal.price?.toLocaleString() }}
                × {{ booking.passengers }}
            </span>
        </div>
    </div>

    <span
        v-else
        class="text-muted ms-4"
    >
        No meals selected
    </span>
</div>


<!-- Add-ons -->
<div class="mb-3">
    <strong>Add-ons:</strong>

    <div
        v-if="booking.addOns && booking.addOns.length > 0"
        class="mt-2 ms-4"
    >
        <div
            v-for="addOn in booking.addOns"
            :key="addOn.name"
            class="d-flex justify-content-between mb-2"
        >
            <span>
                {{ addOn.name }}
            </span>

            <span class="text-muted ms-3">
                ₱{{ addOn.price?.toLocaleString() }}
                × {{ booking.passengers }}
            </span>
        </div>
    </div>

    <span
        v-else
        class="text-muted ms-4"
    >
        No add-ons selected
    </span>
</div>


<!-- Flight Price -->
<div class="mb-3">
    <strong>Flight Price:</strong>

    <div class="ms-4 mt-1 d-flex justify-content-between">
        <span>
            Seat {{ booking.seat }}
        </span>

        <span class="text-muted ms-3">
            ₱{{ booking.flight?.price?.toLocaleString() }}
            × {{ booking.passengers }}
        </span>
    </div>
</div>


<!-- Tax -->
<div class="mb-3">
    <strong>Tax:</strong>

    <div class="ms-4 mt-1 d-flex justify-content-between">
        <span>
            Tax
        </span>

        <span class="text-muted ms-3">
            ₱750
        </span>
    </div>
</div>

                    <hr>


                    <!-- ========================================
                         TOTAL
                    ======================================== -->

<div class="d-flex justify-content-between align-items-center fs-5">
    <strong>
        Total Payment:
    </strong>

    <strong>
        ₱{{ booking.totalPrice?.toLocaleString() }}
    </strong>
</div>


                    <!-- ========================================
                         STATUS
                    ======================================== -->

                    <p>

                        <strong>
                            Status:
                        </strong>


                        <span
                            v-if="booking.status === 'confirmed'"
                            class="badge bg-success"
                        >
                            Confirmed
                        </span>


                        <span
                            v-else
                            class="badge bg-danger"
                        >
                            Cancelled
                        </span>

                    </p>


                    <!-- ========================================
                             FLIGHT CANCELLATION REASON
                        ======================================== -->

                        <div
                            v-if="
                                booking.flight?.status === 'cancelled' &&
                                booking.flight?.cancellationReason
                            "
                            class="alert alert-warning mt-3"
                        >

                            <strong>
                                Flight Cancellation Reason:
                            </strong>

                            {{ booking.flight.cancellationReason }}

                        </div>

                </div>

            </div>


            <hr>


            <!-- ========================================
                 BOOKING DATE
            ======================================== -->

            <small class="text-muted">

                Booked on:

                {{ formatDate(booking.createdAt) }}

            </small>


            <!-- ========================================
                 BOOKING ACTIONS
            ======================================== -->

            <div class="mt-3 text-end">


                <!-- Cancel Confirmed Booking -->

                <button
                    v-if="booking.status === 'confirmed'"
                    class="btn btn-danger"
                    @click="cancelBooking(booking._id)"
                >
                    Cancel Booking
                </button>


                <!-- Delete Cancelled Booking -->

                <button
                    v-if="booking.status === 'cancelled'"
                    class="btn btn-outline-danger"
                    @click="deleteBooking(booking._id)"
                >
                    Delete Booking
                </button>

            </div>

        </div>

    </div>

</div>

</template>