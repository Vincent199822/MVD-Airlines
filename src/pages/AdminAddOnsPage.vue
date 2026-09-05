<script setup>
import { onMounted, ref } from "vue";
import api from "../api/axios";

const addOns = ref([]);
const loading = ref(false);
const submitting = ref(false);

const showForm = ref(false);
const editingAddOn = ref(null);

const formMessage = ref("");
const formError = ref(false);

const addOnForm = ref({
    name: "",
    price: "",
    description: "",
    status: "active"
});


// Get add-ons
async function fetchAddOns() {
    loading.value = true;

    try {
        const response = await api.get("/addons");

        addOns.value = response.data.addOns;

    } catch (err) {
        console.error("Get add-ons error:", err);

        formError.value = true;

        formMessage.value =
            err.response?.data?.message ||
            "Failed to load add-ons.";

    } finally {
        loading.value = false;
    }
}


// Reset form
function resetForm() {

    addOnForm.value = {
        name: "",
        price: "",
        description: "",
        status: "active"
    };

    editingAddOn.value = null;
}


// Open Add form
function openAddForm() {

    resetForm();

    formMessage.value = "";
    formError.value = false;

    showForm.value = true;
}


// Open Edit form
function openEditForm(addOn) {

    editingAddOn.value = addOn;

    addOnForm.value = {
        name: addOn.name,
        price: addOn.price,
        description: addOn.description,
        status: addOn.status
    };

    formMessage.value = "";
    formError.value = false;

    showForm.value = true;
}


// Close form
function closeForm() {

    showForm.value = false;

    resetForm();

    formMessage.value = "";
    formError.value = false;
}


// Submit add-on
async function submitAddOn() {

    formMessage.value = "";
    formError.value = false;

    submitting.value = true;

    const token = localStorage.getItem("token");

    const addOnData = {
        name: addOnForm.value.name,
        price: Number(addOnForm.value.price),
        description: addOnForm.value.description,
        status: addOnForm.value.status
    };

    try {

        let response;

        // Update
        if (editingAddOn.value) {

            response = await api.put(
                `/addons/${editingAddOn.value._id}`,
                addOnData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const index = addOns.value.findIndex(
                addOn =>
                    addOn._id === editingAddOn.value._id
            );

            if (index !== -1) {
                addOns.value[index] = response.data.addOn;
            }

            showForm.value = false;

            resetForm();

            formMessage.value =
                "Add-on updated successfully.";

        }

        // Create
        else {

            response = await api.post(
                "/addons",
                addOnData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            addOns.value.push(response.data.addOn);

            showForm.value = false;

            resetForm();

            formMessage.value =
                "Add-on created successfully.";
        }

    } catch (err) {

        console.error("Add-on save error:", err);

        formError.value = true;

        formMessage.value =
            err.response?.data?.message ||
            "Failed to save add-on.";

    } finally {

        submitting.value = false;
    }
}


// Delete add-on
async function deleteAddOn(addOn) {

    const confirmed = confirm(
        `Are you sure you want to delete ${addOn.name}?`
    );

    if (!confirmed) {
        return;
    }

    const token = localStorage.getItem("token");

    try {

        await api.delete(
            `/addons/${addOn._id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        addOns.value = addOns.value.filter(
            item => item._id !== addOn._id
        );

        formError.value = false;

        formMessage.value =
            "Add-on deleted successfully.";

    } catch (err) {

        console.error("Delete add-on error:", err);

        formError.value = true;

        formMessage.value =
            err.response?.data?.message ||
            "Failed to delete add-on.";
    }
}


// Format price
function formatPrice(price) {

    return Number(price).toLocaleString();
}


onMounted(async () => {
    await fetchAddOns();
});
</script>


<template>

<div class="container py-4">

    <!-- Header -->
    <div
        class="d-flex justify-content-between align-items-center mb-4"
    >

        <div>

            <h2>
                Add-on Management
            </h2>

            <p class="text-muted mb-0">
                Manage additional services available for passengers.
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
                Add Add-on
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

                {{ editingAddOn
                    ? "Edit Add-on"
                    : "Add New Add-on"
                }}

            </h4>


            <form @submit.prevent="submitAddOn">

                <div class="row g-3">

                    <!-- Name -->
                    <div class="col-md-6">

                        <label class="form-label">
                            Add-on Name
                        </label>

                        <input
                            v-model="addOnForm.name"
                            type="text"
                            class="form-control"
                            placeholder="Example: Extra Rice"
                            required
                        >

                    </div>


                    <!-- Price -->
                    <div class="col-md-6">

                        <label class="form-label">
                            Price
                        </label>

                        <input
                            v-model="addOnForm.price"
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
                            v-model="addOnForm.description"
                            type="text"
                            class="form-control"
                            placeholder="Add-on description"
                        >

                    </div>


                    <!-- Status -->
                    <div class="col-md-4">

                        <label class="form-label">
                            Status
                        </label>

                        <select
                            v-model="addOnForm.status"
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
                            : editingAddOn
                                ? "Update Add-on"
                                : "Create Add-on"
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


    <!-- Add-ons Table -->
    <div class="card">

        <div class="card-body">

            <h5 class="mb-3">
                All Add-ons
            </h5>


            <!-- Loading -->
            <div
                v-if="loading"
                class="text-center py-4"
            >
                Loading add-ons...
            </div>


            <!-- Table -->
            <div
                v-else
                class="table-responsive"
            >

                <table
                    class="table table-hover align-middle"
                >

                    <thead>

                        <tr>

                            <th>Add-on</th>

                            <th>Description</th>

                            <th>Price</th>

                            <th>Status</th>

                            <th>Actions</th>

                        </tr>

                    </thead>


                    <tbody>

                        <tr
                            v-for="addOn in addOns"
                            :key="addOn._id"
                        >

                            <td>

                                <strong>
                                    {{ addOn.name }}
                                </strong>

                            </td>


                            <td>

                                {{ addOn.description || "-" }}

                            </td>


                            <td>

                                ₱{{ formatPrice(addOn.price) }}

                            </td>


                            <td>

                                <span
                                    class="badge"
                                    :class="addOn.status === 'active'
                                        ? 'bg-success'
                                        : 'bg-secondary'"
                                >

                                    {{ addOn.status }}

                                </span>

                            </td>


                            <td>

                                <button
                                    class="btn btn-sm btn-primary me-2"
                                    @click="openEditForm(addOn)"
                                >
                                    Edit
                                </button>


                                <button
                                    class="btn btn-sm btn-danger"
                                    @click="deleteAddOn(addOn)"
                                >
                                    Delete
                                </button>

                            </td>

                        </tr>


                        <!-- No add-ons -->
                        <tr v-if="addOns.length === 0">

                            <td
                                colspan="5"
                                class="text-center py-4"
                            >
                                No add-ons found.
                            </td>

                        </tr>

                    </tbody>

                </table>

            </div>

        </div>

    </div>

</div>

</template>