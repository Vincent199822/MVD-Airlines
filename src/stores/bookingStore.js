import { defineStore } from "pinia";
import { ref } from "vue";

export const useBookingStore = defineStore("booking", () => {

    const bookings = ref(
        JSON.parse(localStorage.getItem("bookings")) || []
    );

    function bookFlight(booking){

        bookings.value.push(booking);

        localStorage.setItem(
            "bookings",
            JSON.stringify(bookings.value)
        );

    }

    function cancelBooking(id) {

        const booking = bookings.value.find(
            booking => booking.id === id
        );

        if (booking) {
            booking.status = "Cancelled";
        }

        localStorage.setItem(
            "bookings",
            JSON.stringify(bookings.value)
        );

    }

    function deleteBooking(id) {

    bookings.value = bookings.value.filter(
        booking => booking.id !== id
    );

    localStorage.setItem(
        "bookings",
        JSON.stringify(bookings.value)
    );

    }

    return{
        bookings,
        bookFlight,
        cancelBooking,
        deleteBooking

    }

});