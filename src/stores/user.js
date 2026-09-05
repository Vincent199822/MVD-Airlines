
import { defineStore } from "pinia";
import { ref } from "vue";
import api from "../api/axios";

export const useUserStore = defineStore("user", () => {

    const currentUser = ref(
        JSON.parse(localStorage.getItem("currentUser")) || null
    );

    const token = ref(
        localStorage.getItem("token") || null
    );


    // Register
    async function register(userData) {
        try {

            const response = await api.post(
                "/users/register",
                userData
            );

            return {
                success: true,
                message: response.data.message
            };

        } catch (error) {

            console.error("Registration error:", error);

            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Registration failed. Please try again."
            };
        }
    }


    // Login
    async function login(email, password) {

        try {

            const response = await api.post(
                "/users/login",
                {
                    email,
                    password
                }
            );

            const user = response.data.user;
            const jwtToken = response.data.token;

            // Store user information
            currentUser.value = user;

            // Store JWT
            token.value = jwtToken;

            // Save to localStorage
            localStorage.setItem(
                "currentUser",
                JSON.stringify(user)
            );

            localStorage.setItem(
                "token",
                jwtToken
            );

            return {
                success: true,
                user
            };

        } catch (error) {

            console.error("Login error:", error);

            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Login failed. Please try again."
            };
        }
    }


    // Get Profile
    async function fetchProfile() {

        try {

            const response = await api.get(
                "/users/profile"
            );

            const user = response.data.user;

            // Update current user
            currentUser.value = user;

            // Update localStorage
            localStorage.setItem(
                "currentUser",
                JSON.stringify(user)
            );

            return {
                success: true,
                user
            };

        } catch (error) {

            console.error(
                "Fetch profile error:",
                error
            );

            // If token is invalid or expired,
            // clear authentication data
            if (error.response?.status === 401) {
                logout();
            }

            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Unable to load profile."
            };
        }
    }


    // Logout
    function logout() {

        currentUser.value = null;
        token.value = null;

        localStorage.removeItem("currentUser");
        localStorage.removeItem("token");
    }


    return {
        currentUser,
        token,
        register,
        login,
        fetchProfile,
        logout
    };

});

