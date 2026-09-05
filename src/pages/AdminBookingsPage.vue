<script setup>
import { onMounted, ref } from "vue";
import api from "../api/axios";

const bookings = ref([]);
const loading = ref(false);
const errorMessage = ref("");

async function fetchBookings() {
    loading.value = true;
    errorMessage.value = "";

    try {
        const token = localStorage.getItem("token");

        const response = await api.get("/bookings", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        bookings.value = response.data.bookings;

    } catch (error) {
        console.error("Get all bookings error:", error);

        errorMessage.value =
            error.response?.data?.message ||
            "Failed to load bookings.";

    } finally {
        loading.value = false;
    }
}

function formatDate(date) {
    if (!date) return "-";

    return new Date(date).toLocaleString();
}

function formatPrice(price) {
    return `₱${Number(price || 0).toLocaleString()}`;
}

function getStatusClass(status) {
    if (status === "confirmed") {
        return "bg-success";
    }

    if (status === "cancelled") {
        return "bg-danger";
    }

    return "bg-secondary";
}

async function cancelBooking(bookingId) {
    const confirmed = window.confirm(
        "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) {
        return;
    }

    try {
        const token = localStorage.getItem("token");

        await api.patch(
            `/bookings/${bookingId}/admin-cancel`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        await fetchBookings();

        alert("Booking cancelled successfully.");

    } catch (error) {
        console.error("Cancel booking error:", error);

        alert(
            error.response?.data?.message ||
            "Failed to cancel booking."
        );
    }
}

onMounted(() => {
    fetchBookings();
});
</script>

<template>
    <div class="container py-4">

        <!-- PAGE HEADER -->
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h2>Booking Management</h2>

                <p class="text-muted mb-0">
                    View and manage passenger bookings.
                </p>
            </div>

            <router-link
                to="/admin"
                class="btn btn-secondary"
            >
                Back to Dashboard
            </router-link>
        </div>


        <!-- ERROR -->
        <div
            v-if="errorMessage"
            class="alert alert-danger"
        >
            {{ errorMessage }}
        </div>


        <!-- LOADING -->
        <div
            v-if="loading"
            class="text-center py-5"
        >
            <div
                class="spinner-border"
                role="status"
            ></div>

            <p class="mt-2">
                Loading bookings...
            </p>
        </div>


        <!-- BOOKINGS TABLE -->
        <div
            v-else
            class="card"
        >
            <div class="card-body">

                <div
                    v-if="bookings.length === 0"
                    class="text-center py-5"
                >
                    <h5>No bookings found.</h5>

                    <p class="text-muted">
                        There are currently no passenger bookings.
                    </p>
                </div>


                <div
                    v-else
                    class="table-responsive"
                >
                    <table class="table table-hover align-middle">

                        <thead>
                            <tr>
                                <th>Booking ID</th>
                                <th>Passenger</th>
                                <th>Email</th>
                                <th>Flight</th>
                                <th>Route</th>
                                <th>Passengers</th>
                                <th>Seat</th>
                                <th>Meals</th>
                                <th>Add-ons</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Booked At</th>
								<th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>

                            <tr
                                v-for="booking in bookings"
                                :key="booking._id"
                            >

                                <!-- BOOKING ID -->
                                <td>
                                    <small>
                                        {{ booking._id }}
                                    </small>
                                </td>


                                <!-- PASSENGER -->
                                <td>
                                    {{
                                        booking.user?.firstName
                                    }}
                                    {{
                                        booking.user?.lastName
                                    }}
                                </td>


                                <!-- EMAIL -->
                                <td>
                                    {{ booking.user?.email }}
                                </td>


                                <!-- FLIGHT -->
                                <td>
                                    <strong>
                                        {{ booking.flight?.flightNumber }}
                                    </strong>
                                </td>


                                <!-- ROUTE -->
                                <td>
                                    {{ booking.flight?.origin }}
                                    →
                                    {{ booking.flight?.destination }}
                                </td>


                                <!-- PASSENGERS -->
                                <td>
                                    {{ booking.passengers }}
                                </td>


                                <!-- SEAT -->
                                <td>
                                    <strong>
                                        {{ booking.seat }}
                                    </strong>
                                </td>


                                <!-- MEALS -->
                                <td>
                                    <div
                                        v-if="booking.meals?.length"
                                    >
                                        <div
                                            v-for="meal in booking.meals"
                                            :key="meal._id"
                                        >
                                            {{ meal.name }}
                                            <small class="text-muted">
                                                ({{
                                                    formatPrice(meal.price)
                                                }})
                                            </small>
                                        </div>
                                    </div>

                                    <span
                                        v-else
                                        class="text-muted"
                                    >
                                        None
                                    </span>
                                </td>


                                <!-- ADD-ONS -->
                                <td>
                                    <div
                                        v-if="booking.addOns?.length"
                                    >
                                        <div
                                            v-for="addOn in booking.addOns"
                                            :key="addOn._id"
                                        >
                                            {{ addOn.name }}
                                            <small class="text-muted">
                                                ({{
                                                    formatPrice(addOn.price)
                                                }})
                                            </small>
                                        </div>
                                    </div>

                                    <span
                                        v-else
                                        class="text-muted"
                                    >
                                        None
                                    </span>
                                </td>


                                <!-- TOTAL -->
                                <td>
                                    <strong>
                                        {{
                                            formatPrice(
                                                booking.totalPrice
                                            )
                                        }}
                                    </strong>
                                </td>


                                <!-- STATUS -->
                                <td>
                                    <span
                                        class="badge"
                                        :class="getStatusClass(
                                            booking.status
                                        )"
                                    >
                                        {{ booking.status }}
                                    </span>
                                </td>


								<!-- BOOKED AT -->
								<td>
								    <small>
								        {{
								            formatDate(
								                booking.createdAt
								            )
								        }}
								    </small>
								</td>

								<!-- ACTIONS -->
								<td>
								    <button
								        v-if="booking.status === 'confirmed'"
								        class="btn btn-sm btn-danger"
								        @click="cancelBooking(booking._id)"
								    >
								        Cancel
								    </button>

								    <span
								        v-else
								        class="text-muted"
								    >
								        No actions
								    </span>
								</td>

                            </tr>

                        </tbody>

                    </table>
                </div>

            </div>
        </div>

    </div>
</template>