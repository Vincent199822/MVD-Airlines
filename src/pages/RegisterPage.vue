<script setup>
import api from "../api/axios";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/user";

const router = useRouter();

const firstName = ref("");
const lastName = ref("");
const email = ref("");
const mobileNo = ref("");
const password = ref("");
const confirmPassword = ref("");

async function register() {
    if (
        !firstName.value ||
        !lastName.value ||
        !email.value ||
        !mobileNo.value ||
        !password.value ||
        !confirmPassword.value
    ) {
        alert("Please fill in all fields.");
        return;
    }

    if (password.value.length < 8) {
        alert("Password must be at least 8 characters.");
        return;
    }

    if (password.value !== confirmPassword.value) {
        alert("Passwords do not match.");
        return;
    }

    try {
        const response = await api.post("/users/register", {
            firstName: firstName.value,
            lastName: lastName.value,
            email: email.value,
            password: password.value,
            confirmPassword: confirmPassword.value
        });

        alert(response.data.message);

        router.push("/login");

    } catch (error) {
        console.error("Registration error:", error);

        alert(
            error.response?.data?.message ||
            "Registration failed. Please try again."
        );
    }
}
</script>

<template>
    <div class="row justify-content-center">
        <div class="col-md-6">
            <div class="card shadow">
                <div class="card-body text-center mb-4">
                    <i
                        class="bi bi-airplane-engines-fill text-primary"
                        style="font-size:60px"
                    ></i>
                    <h2 class="text-center mb-4 fw-bold mt-3">
                        Create Your Account
                    </h2>
                    <p class="text-muted">
                        Join FlyBook and start your next journey.
                    </p>

                    <div class="input-group mb-3">
                        <span class="input-group-text">
                            <i class="bi bi-person-fill text-primary"></i>
                        </span>
                        <input
                            v-model="firstName"
                            type="text"
                            class="form-control"
                            placeholder="First Name"
                        >
                    </div>

                    <div class="input-group mb-3">
                        <span class="input-group-text">
                            <i class="bi bi-person-fill text-primary"></i>
                        </span>
                        <input
                            v-model="lastName"
                            type="text"
                            class="form-control"
                            placeholder="Last Name"
                        >
                    </div>

                    <div class="input-group mb-3">
                        <span class="input-group-text">
                            <i class="bi bi-phone-fill text-primary"></i>
                        </span>
                        <input
                            v-model="mobileNo"
                            type="text"
                            class="form-control"
                            placeholder="Mobile Number"
                        >
                    </div>

                    <div class="input-group mb-3">
                        <span class="input-group-text">
                            <i class="bi bi-envelope-fill text-primary"></i>
                        </span>
                        <input
                            v-model="email"
                            type="text"
                            class="form-control"
                            placeholder="Email"
                        >
                    </div>

                    <div class="input-group mb-3">
                        <span class="input-group-text">
                            <i class="bi bi-lock-fill text-primary"></i>
                        </span>
                        <input
                            v-model="password"
                            type="password"
                            class="form-control"
                            placeholder="Password"
                        >
                    </div>

                    <div class="input-group mb-4">
                        <span class="input-group-text">
                            <i class="bi bi-shield-lock-fill text-primary"></i>
                        </span>
                        <input
                            v-model="confirmPassword"
                            type="password"
                            class="form-control"
                            placeholder="Confirm Password"
                        >
                    </div>

                    <button
                        type="submit"
                        class="btn btn-success w-100 rounded-pill shadow-sm"
                    @click="register">
                    Create Account
                    </button>

                </div>
            </div>
        </div>
    </div>
</template>