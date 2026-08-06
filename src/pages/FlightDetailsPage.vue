<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useFlightStore } from "../stores/flightStore";

const route = useRoute();

const flightStore = useFlightStore();

const flight = computed(() => {

    return flightStore.getFlightById(route.params.id);

});
</script>

<template>
	<div class="container py-4">
		<div
		v-if="flight"
		class="card shadow-lg">
		<div class="card-header bg-primary text-white">
			<h2>
			✈ Flight Details
			</h2>
		</div>

			<div class="card-body">
				<h3>
				{{ flight.airline }}
				</h3>
				<hr>
				<div class="row">
					<div class="col-md-6">
						<p>
						<strong>Flight Number:</strong>{{ flight.flightNumber }}
						</p>

						<p>
						<strong>From:</strong>{{ flight.from }}
						</p>

						<p>
						<strong>To:</strong>{{ flight.to }}
						</p>

						<p>
						<strong>Date:</strong>{{ flight.departure }}
						</p>

						<p>
						<strong>Departure:</strong>{{ flight.departureTime }}
						</p>
					</div>

				<div class="col-md-6">
					<p>
					<strong>Arrival:</strong>{{ flight.arrivalTime }}
					</p>

					<p>
					<strong>Duration:</strong>{{ flight.duration }}
					</p>

					<p>
					<strong>Aircraft:</strong>{{ flight.aircraft }}
					</p>

					<p>
					<strong>Cabin:</strong>{{ flight.cabin }}
					</p>

					<p>
					<strong>Seats Left:</strong>{{ flight.availableSeats }}
					</p>
				</div>
			</div>
				<hr>

				<h4 class="text-success">
				₱ {{ flight.price.toLocaleString() }}
				</h4>
				<div class="mt-4">
					<router-link
						class="btn btn-secondary me-2"
						to="/search-flights">
						Back
					</router-link>

					<router-link
						class="btn btn-success"
						:to="'/book-flight/' + flight.id">
						Book Flight
					</router-link>
				</div>
			</div>
		</div>
		<div
			v-else
			class="alert alert-danger">

			Flight not found.
		</div>
	</div>
</template>