import { defineStore } from "pinia";
import { ref } from "vue";
import api from "../api/axios";

export const useBookingStore = defineStore("booking", () => {

    const bookings = ref([]);
    const loading = ref(false);
    const error = ref(null);

    // ================================
    // CREATE BOOKING
    // ================================
    async function createBooking(
        flightId,
        passengers,
        seat,
        meals,
        addOns
    ) {
        loading.value = true;
        error.value = null;

        try {
            const token = localStorage.getItem("token");

            const response = await api.post(
                "/bookings",
                {
                    flightId,
                    passengers,
                    seat,
                    meals,
                    addOns
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            return {
                success: true,
                message: response.data.message,
                booking: response.data.booking
            };

        } catch (err) {
            console.error("Create booking error:", err);

            error.value =
                err.response?.data?.message ||
                "Failed to create booking.";

            return {
                success: false,
                message: error.value
            };

        } finally {
            loading.value = false;
        }
    }


    // ================================
    // GET MY BOOKINGS
    // ================================
    async function fetchMyBookings() {
        loading.value = true;
        error.value = null;

        try {
            const token = localStorage.getItem("token");

            const response = await api.get(
                "/bookings/my-bookings",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            bookings.value = response.data.bookings;

            return {
                success: true,
                bookings: bookings.value
            };

        } catch (err) {
            console.error("Get bookings error:", err);

            error.value =
                err.response?.data?.message ||
                "Failed to load bookings.";

            return {
                success: false,
                message: error.value
            };

        } finally {
            loading.value = false;
        }
    }


    // ================================
    // GET BOOKING BY ID
    // ================================
    async function fetchBookingById(id) {
        try {
            const token = localStorage.getItem("token");

            const response = await api.get(
                `/bookings/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            return {
                success: true,
                booking: response.data.booking
            };

        } catch (err) {
            console.error("Get booking error:", err);

            return {
                success: false,
                message:
                    err.response?.data?.message ||
                    "Failed to load booking."
            };
        }
    }


    // ================================
    // CANCEL BOOKING
    // ================================
    async function cancelBooking(id) {
        try {
            const token = localStorage.getItem("token");

            const response = await api.patch(
                `/bookings/${id}/cancel`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            await fetchMyBookings();

            return {
                success: true,
                message: response.data.message,
                booking: response.data.booking
            };

        } catch (err) {
            console.error("Cancel booking error:", err);

            return {
                success: false,
                message:
                    err.response?.data?.message ||
                    "Failed to cancel booking."
            };
        }
    }


    // ================================
    // DELETE BOOKING
    // ================================
    async function deleteBooking(id) {
        try {
            const token = localStorage.getItem("token");

            const response = await api.delete(
                `/bookings/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            await fetchMyBookings();

            return {
                success: true,
                message: response.data.message
            };

        } catch (err) {
            console.error("Delete booking error:", err);

            return {
                success: false,
                message:
                    err.response?.data?.message ||
                    "Failed to delete booking."
            };
        }
    }


    return {
        bookings,
        loading,
        error,
        createBooking,
        fetchMyBookings,
        fetchBookingById,
        cancelBooking,
        deleteBooking
    };
});