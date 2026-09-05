<script setup>

import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/user";

const router = useRouter();
const store = useUserStore();

const email = ref("");
const password = ref("");

async function login() {

    if (!email.value || !password.value) {
        alert("Please enter your email and password.");
        return;
    }

    const result = await store.login(
        email.value,
        password.value
    );

    if (result.success) {
        alert("Welcome!");
        router.push("/");
    } else {
        alert(result.message);
    }
}

</script>

<!-- LOGIN ACCOUNT
	
	REGULAR USER
		userName: test@mail.com
		password: test1234

 -->

<template>
<div class="container py-5">
    <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
            <div class="card shadow-lg">
                <div class="card-body p-5">
         
         <!-- login form -->
                    <div class="text-center mb-4">
					    <i
					        class="bi bi-airplane-engines-fill text-primary"
					        style="font-size:60px"
					    ></i>
					    <h2 class="fw-bold mt-3">
					        Welcome Back
					    </h2>
					    <p class="text-muted">
					        Sign in to continue your journey.
					    </p>
					</div>

					<div class="input-group mb-3">
					    <span class="input-group-text">
					        <i class="bi bi-envelope-fill"></i>
					    </span>
					    <input
						    v-model="email"
						    type="email"
						    class="form-control"
						    placeholder="Enter your email"
						/>
					</div>

					<div class="input-group mb-4">
					    <span class="input-group-text">
					        <i class="bi bi-lock-fill"></i>
					    </span>
					    <input
						    v-model="password"
						    type="password"
						    class="form-control"
						    placeholder="Enter your password"
						/>
					</div>

					<button
					    class="btn btn-primary w-100 rounded-pill shadow-sm " @click="login"
					>
					    Login
					</button>

					<p class="text-center mt-4">
					    Don't have an account?
					    <router-link to="/register">
					        Register
					    </router-link>
					</p>

                </div>
            </div>
        </div>
    </div>

</div>
</template>