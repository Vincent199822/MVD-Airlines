<script setup>
import { computed } from "vue";
import { useBookingStore } from "../stores/bookingStore";
import { useUserStore } from "../stores/user";
import { useFlightStore } from "../stores/flightStore";

const bookingStore = useBookingStore();
const userStore = useUserStore()
const flightStore = useFlightStore();

const myBookings = computed(() => {
    if (!userStore.currentUser) {
        return [];
    }
    return bookingStore.bookings.filter(
        booking => booking.email === userStore.currentUser.email
    );
});

function cancelBooking(id) {
    const confirmCancel = confirm(
        "Are you sure you want to cancel this booking?"
    );
    if (!confirmCancel) return;
    const booking = bookingStore.bookings.find(
        booking => booking.id === id
    );
    if (booking) {
        flightStore.releaseSeat(
            booking.flightId,
            booking.seat
        );
    }
    bookingStore.cancelBooking(id);
    alert("Booking cancelled successfully.");
}

    function deleteBooking(id) {

        const confirmDelete = confirm(
            "Delete this booking permanently?"
        );

        if (!confirmDelete) return;

        bookingStore.deleteBooking(id);

        alert("Booking deleted.");

    }

</script>

<template>

<div class="container py-4">

    <h2 class="mb-4">
        My Bookings
    </h2>

    <div
        v-if="myBookings.length === 0"
        class="alert alert-info"
    >
        You have no flight bookings yet.
    </div>

    <div
        v-for="booking in myBookings"
        :key="booking.id"
        class="card shadow mb-4"
    >

        <div class="card-header bg-primary text-white">
            <h5 class="mb-0">
                ✈ {{ booking.airline }}
            </h5>
        </div>

        <div class="card-body">
            <div class="row">
                <div class="col-md-6">
                    <p>
                        <strong>Passenger:</strong>
                        {{ booking.passengerName }}
                    </p>

                    <p>
                        <strong>Flight Number:</strong>
                        {{ booking.flightNumber }}
                    </p>

                    <p>
                        <strong>Route:</strong>
                        {{ booking.from }}
                        →
                        {{ booking.to }}
                    </p>

                    <p>
                        <strong>Date:</strong>
                        {{ booking.departure }}
                    </p>
                </div>

                <div class="col-md-6">
                    <p>
                        <strong>Seat:</strong>
                        {{ booking.seat }}
                    </p>

                    <p>
                        <strong>Meal:</strong>
                        {{ booking.meal }}
                    </p>

                    <p>
                        <strong>Total:</strong>
                        ₱{{ booking.total.toLocaleString() }}
                    </p>

                    <p>
                        <strong>Status:</strong>
                        <span class="badge bg-success">

                            {{ booking.status }}
                        </span>
                    </p>
                </div>
            </div>

            <hr>
            <small class="text-muted">
                Booked on: {{ booking.bookedAt }}
            </small>

            <div class="mt-3 text-end">

                <button
                    v-if="booking.status === 'Confirmed'"
                    class="btn btn-danger"
                    @click="cancelBooking(booking.id)"
                >
                    Cancel Booking
                </button>

                <button
                    v-else
                    class="btn btn-outline-danger"
                    @click="deleteBooking(booking.id)"
                >
                    Delete Booking
                </button>

            </div>
        </div>
    </div>
</div>
</template>