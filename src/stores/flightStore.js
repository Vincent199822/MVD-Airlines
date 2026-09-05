import { defineStore } from "pinia";
import { ref } from "vue";
import api from "../api/axios";

export const useFlightStore = defineStore("flight", () => {


const flights = ref([]);
const loading = ref(false);
const error = ref(null);

// Get all flights from backend
async function fetchFlights() {
    loading.value = true;
    error.value = null;

    try {
        const response = await api.get("/flights");

        flights.value = response.data.flights;

        return {
            success: true,
            flights: flights.value
        };

    } catch (err) {
        console.error("Get flights error:", err);

        error.value =
            err.response?.data?.message ||
            "Failed to load flights.";

        return {
            success: false,
            message: error.value
        };

    } finally {
        loading.value = false;
    }
}

// Create Flight - Admin
async function createFlight(flightData) {

    try {

        const token = localStorage.getItem("token");

        const response = await api.post(
            "/flights",
            flightData,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        // Add the newly created flight to the list
        flights.value.push(response.data.flight);

        return {
            success: true,
            flight: response.data.flight,
            message: response.data.message
        };

    } catch (err) {

        console.error("Create flight error:", err);

        return {
            success: false,
            message:
                err.response?.data?.message ||
                "Failed to create flight."
        };
    }
}

// Update Flight - Admin
async function updateFlight(id, flightData) {

    try {

        const token = localStorage.getItem("token");

        const response = await api.put(
            `/flights/${id}`,
            flightData,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        // Find the updated flight in the store
        const index = flights.value.findIndex(
            flight => flight._id === id
        );

        // Replace it with the updated flight
        if (index !== -1) {
            flights.value[index] = response.data.flight;
        }

        return {
            success: true,
            flight: response.data.flight,
            message: response.data.message
        };

    } catch (err) {

        console.error("Update flight error:", err);

        return {
            success: false,
            message:
                err.response?.data?.message ||
                "Failed to update flight."
        };
    }
}

// Delete Flight - Admin
async function deleteFlight(id) {

    try {

        const token = localStorage.getItem("token");

        const response = await api.delete(
            `/flights/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        // Remove the deleted flight from the store
        flights.value = flights.value.filter(
            flight => flight._id !== id
        );

        return {
            success: true,
            message: response.data.message
        };

    } catch (err) {

        console.error("Delete flight error:", err);

        return {
            success: false,
            message:
                err.response?.data?.message ||
                "Failed to delete flight."
        };
    }
}

// 
// Get one flight from backend
async function getFlightById(id) {

    try {
        const response = await api.get(`/flights/${id}`);

        return {
            success: true,
            flight: response.data.flight
        };

    } catch (err) {
        console.error("Get flight error:", err);

        return {
            success: false,
            message:
                err.response?.data?.message ||
                "Failed to load flight."
        };
    }
}


// Search flights
function searchFlights(filters) {

    return flights.value.filter((flight) => {

        const matchFrom =
            !filters.from ||
            flight.origin === filters.from;

        const matchTo =
            !filters.to ||
            flight.destination === filters.to;

        const matchDate =
            !filters.departure ||
            flight.departureDate?.slice(0, 10) === filters.departure;

        return (
            matchFrom &&
            matchTo &&
            matchDate
        );
    });
}


return {
    flights,
    loading,
    error,
    fetchFlights,
    createFlight,
    updateFlight,
    deleteFlight,
    getFlightById,
    searchFlights
};


});
