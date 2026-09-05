<script setup>
import { onMounted, computed, ref } from "vue";
import api from "../api/axios";

const meals = ref([]);
const loading = ref(false);
const submitting = ref(false);

const showForm = ref(false);
const editingMeal = ref(null);

const formMessage = ref("");
const formError = ref(false);

const mealForm = ref({
    name: "",
    price: "",
    description: "",
    status: "active"
});


// Get meals
async function fetchMeals() {

    loading.value = true;

    try {

        const response = await api.get("/meals");

        meals.value = response.data.meals;

    } catch (err) {

        console.error("Get meals error:", err);

        formError.value = true;

        formMessage.value =
            err.response?.data?.message ||
            "Failed to load meals.";

    } finally {

        loading.value = false;
    }
}


// Reset form
function resetForm() {

    mealForm.value = {
        name: "",
        price: "",
        description: "",
        status: "active"
    };

    editingMeal.value = null;

    formMessage.value = "";
    formError.value = false;
}


// Open Add form
function openAddForm() {

    resetForm();

    showForm.value = true;
}


// Open Edit form
function openEditForm(meal) {

    editingMeal.value = meal;

    mealForm.value = {
        name: meal.name,
        price: meal.price,
        description: meal.description,
        status: meal.status
    };

    formMessage.value = "";
    formError.value = false;

    showForm.value = true;
}


// Close form
function closeForm() {

    showForm.value = false;

    resetForm();
}


// Submit meal
async function submitMeal() {

    formMessage.value = "";
    formError.value = false;

    submitting.value = true;

    const token = localStorage.getItem("token");

    const mealData = {
        name: mealForm.value.name,
        price: Number(mealForm.value.price),
        description: mealForm.value.description,
        status: mealForm.value.status
    };


    try {

        let response;

        if (editingMeal.value) {

            response = await api.put(
                `/meals/${editingMeal.value._id}`,
                mealData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const index = meals.value.findIndex(
                meal => meal._id === editingMeal.value._id
            );

            if (index !== -1) {
                meals.value[index] = response.data.meal;
            }

            formMessage.value =
                "Meal updated successfully.";

        } else {

            response = await api.post(
                "/meals",
                mealData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            meals.value.push(response.data.meal);

            formMessage.value =
                "Meal created successfully.";
        }


        showForm.value = false;

        resetForm();

    } catch (err) {

        console.error("Meal save error:", err);

        formError.value = true;

        formMessage.value =
            err.response?.data?.message ||
            "Failed to save meal.";

    } finally {

        submitting.value = false;
    }
}


// Delete meal
async function deleteMeal(meal) {

    const confirmed = confirm(
        `Are you sure you want to delete ${meal.name}?`
    );

    if (!confirmed) {
        return;
    }

    const token = localStorage.getItem("token");

    try {

        await api.delete(
            `/meals/${meal._id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        meals.value = meals.value.filter(
            item => item._id !== meal._id
        );

        formError.value = false;
        formMessage.value =
            "Meal deleted successfully.";

    } catch (err) {

        console.error("Delete meal error:", err);

        formError.value = true;

        formMessage.value =
            err.response?.data?.message ||
            "Failed to delete meal.";
    }
}


// Format price
function formatPrice(price) {

    return Number(price).toLocaleString();
}


onMounted(async () => {
    await fetchMeals();
});
</script>


<template>

<div class="container py-4">

    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">

        <div>

            <h2>
                Meal Management
            </h2>

            <p class="text-muted mb-0">
                Manage meals available for passengers.
            </p>

        </div>


        <div>

            <router-link
                to="/admin"
                class="btn btn-secondary me-2"
            >
                Back to Dashboard
            </router-link>

            <button
                class="btn btn-primary"
                @click="openAddForm"
            >
                Add Meal
            </button>

        </div>

    </div>


    <!-- Message -->
    <div
        v-if="formMessage"
        class="alert"
        :class="formError
            ? 'alert-danger'
            : 'alert-success'"
    >
        {{ formMessage }}
    </div>


    <!-- Add/Edit Form -->
    <div
        v-if="showForm"
        class="card mb-4"
    >

        <div class="card-body">

            <h4 class="mb-4">

                {{ editingMeal
                    ? "Edit Meal"
                    : "Add New Meal"
                }}

            </h4>


            <form @submit.prevent="submitMeal">

                <div class="row g-3">

                    <!-- Name -->
                    <div class="col-md-6">

                        <label class="form-label">
                            Meal Name
                        </label>

                        <input
                            v-model="mealForm.name"
                            type="text"
                            class="form-control"
                            placeholder="Example: Japanese Meal"
                            required
                        >

                    </div>


                    <!-- Price -->
                    <div class="col-md-6">

                        <label class="form-label">
                            Price
                        </label>

                        <input
                            v-model="mealForm.price"
                            type="number"
                            class="form-control"
                            min="0"
                            required
                        >

                    </div>


                    <!-- Description -->
                    <div class="col-md-8">

                        <label class="form-label">
                            Description
                        </label>

                        <input
                            v-model="mealForm.description"
                            type="text"
                            class="form-control"
                            placeholder="Meal description"
                        >

                    </div>


                    <!-- Status -->
                    <div class="col-md-4">

                        <label class="form-label">
                            Status
                        </label>

                        <select
                            v-model="mealForm.status"
                            class="form-select"
                        >

                            <option value="active">
                                Active
                            </option>

                            <option value="inactive">
                                Inactive
                            </option>

                        </select>

                    </div>

                </div>


                <!-- Buttons -->
                <div class="mt-4">

                    <button
                        type="submit"
                        class="btn btn-primary me-2"
                        :disabled="submitting"
                    >

                        {{ submitting
                            ? "Saving..."
                            : editingMeal
                                ? "Update Meal"
                                : "Create Meal"
                        }}

                    </button>


                    <button
                        type="button"
                        class="btn btn-secondary"
                        @click="closeForm"
                    >
                        Cancel
                    </button>

                </div>

            </form>

        </div>

    </div>


    <!-- Meals Table -->
    <div class="card">

        <div class="card-body">

            <h5 class="mb-3">
                All Meals
            </h5>


            <div
                v-if="loading"
                class="text-center py-4"
            >
                Loading meals...
            </div>


            <div
                v-else
                class="table-responsive"
            >

                <table class="table table-hover align-middle">

                    <thead>

                        <tr>

                            <th>
                                Meal
                            </th>

                            <th>
                                Description
                            </th>

                            <th>
                                Price
                            </th>

                            <th>
                                Status
                            </th>

                            <th>
                                Actions
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        <tr
                            v-for="meal in meals"
                            :key="meal._id"
                        >

                            <td>
                                <strong>
                                    {{ meal.name }}
                                </strong>
                            </td>


                            <td>
                                {{ meal.description || "-" }}
                            </td>


                            <td>
                                ₱{{ formatPrice(meal.price) }}
                            </td>


                            <td>

                                <span
                                    class="badge"
                                    :class="meal.status === 'active'
                                        ? 'bg-success'
                                        : 'bg-secondary'"
                                >
                                    {{ meal.status }}
                                </span>

                            </td>


                            <td>

                                <button
                                    class="btn btn-sm btn-primary me-2"
                                    @click="openEditForm(meal)"
                                >
                                    Edit
                                </button>


                                <button
                                    class="btn btn-sm btn-danger"
                                    @click="deleteMeal(meal)"
                                >
                                    Delete
                                </button>

                            </td>

                        </tr>


                        <!-- No meals -->
                        <tr v-if="meals.length === 0">

                            <td
                                colspan="5"
                                class="text-center py-4"
                            >
                                No meals found.
                            </td>

                        </tr>

                    </tbody>

                </table>

            </div>

        </div>

    </div>

</div>

</template>