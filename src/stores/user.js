import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore("user", () => {

    const users = ref(
        JSON.parse(localStorage.getItem("users")) || []
    );

    const currentUser = ref(
        JSON.parse(localStorage.getItem("currentUser")) || null
    );

    function register(userData) {
        users.value.push(userData);

        localStorage.setItem(
            "users",
            JSON.stringify(users.value)
        );
    }

    function login(email, password) {

        const user = users.value.find(
            (u) =>
                u.email === email &&
                u.password === password
        );

        if (user) {

            currentUser.value = user;

            localStorage.setItem(
                "currentUser",
                JSON.stringify(user)
            );

            return true;
        }

        return false;
    }

    function logout() {

        currentUser.value = null;

        localStorage.removeItem("currentUser");
    }

    return {
        users,
        currentUser,
        register,
        login,
        logout
    };

});