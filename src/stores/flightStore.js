import { defineStore } from "pinia";
import { ref } from "vue";

export const useFlightStore = defineStore("flight", () => {

const flights = ref(
    loadFlights()
);

    const defaultFlights = [
        {
            id: 1,
            airline: "Philippine Airlines",
            flightNumber: "PR103",
            from: "Manila",
            to: "Tokyo",
            departure: "2026-08-20",
            departureTime: "08:00 AM",
            arrivalTime: "01:30 PM",
            duration: "4h 30m",
            aircraft: "Airbus A321",
            price: 15500,
            availableSeats: 25,
            cabin: "Economy",
            image: "/src/assets/images/tokyo.jpg",

	        seats: [
		        "A1","A2","A3","A4",
		        "B1","B2","B3","B4",
		        "C1","C2","C3","C4",
		        "D1","D2","D3","D4"
		    ],

		    reservedSeats: [
		        "B2",
		        "C4",
		        "D1"
		    ]
        },
        {
            id: 2,
            airline: "Cebu Pacific",
            flightNumber: "5J812",
            from: "Manila",
            to: "Singapore",
            departure: "2026-08-21",
            departureTime: "09:45 AM",
            arrivalTime: "01:15 PM",
            duration: "3h 30m",
            aircraft: "Airbus A320",
            price: 7800,
            availableSeats: 42,
            cabin: "Economy",
                        image: "/src/assets/images/tokyo.jpg",

	        seats: [
		        "A1","A2","A3","A4",
		        "B1","B2","B3","B4",
		        "C1","C2","C3","C4",
		        "D1","D2","D3","D4"
		    ],

		    reservedSeats: [
		        "B2",
		        "C4",
		        "D1"
		    ]
        },
        {
            id: 3,
            airline: "AirAsia",
            flightNumber: "Z2890",
            from: "Manila",
            to: "Seoul",
            departure: "2026-08-22",
            departureTime: "10:30 AM",
            arrivalTime: "03:45 PM",
            duration: "5h 15m",
            aircraft: "Airbus A320",
            price: 9800,
            availableSeats: 18,
            cabin: "Economy",
                        image: "/src/assets/images/tokyo.jpg",

	        seats: [
		        "A1","A2","A3","A4",
		        "B1","B2","B3","B4",
		        "C1","C2","C3","C4",
		        "D1","D2","D3","D4"
		    ],

		    reservedSeats: [
		        "B2",
		        "C4",
		        "D1"
		    ]
        },
        {
            id: 4,
            airline: "Singapore Airlines",
            flightNumber: "SQ915",
            from: "Manila",
            to: "Singapore",
            departure: "2026-08-23",
            departureTime: "02:00 PM",
            arrivalTime: "05:35 PM",
            duration: "3h 35m",
            aircraft: "Boeing 787",
            price: 18500,
            availableSeats: 15,
            cabin: "Business",
                        image: "/src/assets/images/tokyo.jpg",

	        seats: [
		        "A1","A2","A3","A4",
		        "B1","B2","B3","B4",
		        "C1","C2","C3","C4",
		        "D1","D2","D3","D4"
		    ],

		    reservedSeats: [
		        "B2",
		        "C4",
		        "D1"
		    ]
        }
    ];

    function loadFlights() {
        const savedFlights = localStorage.getItem("flights");
        if (savedFlights) {
            return JSON.parse(savedFlights);
        }
    return structuredClone(defaultFlights);

    }

    function saveFlights(flights) {
        localStorage.setItem(
            "flights",
            JSON.stringify(flights)
        );
    }

    function getFlightById(id) {
        return flights.value.find(
            flight => flight.id === Number(id)
        );
    }

    function searchFlights(filters) {
        return flights.value.filter((flight) => {
            const matchFrom =
                !filters.from ||
                flight.from === filters.from;
            const matchTo =
                !filters.to ||
                flight.to === filters.to;
            const matchDate =
                !filters.departure ||
                flight.departure === filters.departure;
            return (
                matchFrom &&
                matchTo &&
                matchDate
            );
        });
    }

    function reserveSeat(flightId, seat) {
        const flight = flights.value.find(
            flight => flight.id === flightId
        );
        if (!flight) return;
        if (!flight.reservedSeats.includes(seat)) {
            flight.reservedSeats.push(seat);
                saveFlights(flights.value);
            localStorage.setItem(
                "flights",
                JSON.stringify(flights.value)
            );
        }
    }

    function releaseSeat(flightId, seat) {
    const flight = flights.value.find(
        flight => flight.id === flightId
    );
    if (!flight) return;
        flight.reservedSeats = flight.reservedSeats.filter(
            reservedSeat => reservedSeat !== seat
        );
        saveFlights(flights.value);
    }

    function resetFlights() {
        flights.value = structuredClone(defaultFlights);
        saveFlights(flights.value);
    }

    return {
        flights,
        getFlightById,
        searchFlights,
        reserveSeat,
        releaseSeat,
        resetFlights
    };

});