<template>
  <div class="telefono-detail-container">
    <button @click="goBack" class="btn-back">← Volver</button>

    <h2 v-if="!isEditing">Detalle del Teléfono</h2>
    <h2 v-else>Editar Teléfono</h2>

    <p v-if="loading">Cargando datos...</p>
    <p v-if="error" class="error-message">{{ error }}</p>

    <div v-else-if="telefono">
      <div v-if="!isEditing">
        <p><strong>Teléfono:</strong> {{ telefono.telefono }}</p>
        <p><strong>Tipo:</strong> {{ telefono.tipo }}</p>
        <p><strong>Estudiante:</strong> {{ telefono.estudiante }}</p>

        <button @click="startEditing" class="btn-edit-detail">Editar</button>
      </div>

      <form v-else @submit.prevent="saveTelefono">
        <label for="telefono">Teléfono:</label>
        <input id="telefono" v-model="editedTelefono.telefono" required />

        <label for="tipo">Tipo:</label>
        <input id="tipo" v-model="editedTelefono.tipo" required />

        <label for="estudiante">Estudiante (URL):</label>
        <input id="estudiante" v-model="editedTelefono.estudiante" required />

        <div class="form-actions">
          <button type="submit" class="btn-save">Guardar</button>
          <button type="button" @click="cancelEditing" class="btn-cancel">Cancelar</button>
        </div>
      </form>
    </div>

    <p v-else>No se encontró el teléfono.</p>
  </div>
</template>

<script>
import telefonoApi from "@/api/telefonos";
import { useRouter, useRoute } from "vue-router";

export default {
  name: "TelefonoDetail",
  props: ["telefonoUrl"],
  data() {
    return {
      telefono: null,
      editedTelefono: {
        telefono: "",
        tipo: "",
        estudiante: "",
      },
      loading: true,
      error: null,
      isEditing: false,
    };
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    return { router, route };
  },
  watch: {
    telefonoUrl: {
      immediate: true,
      async handler(newVal) {
        if (newVal) {
          const decodedUrl = decodeURIComponent(newVal);
          await this.fetchTelefonoDetail(decodedUrl);
          this.isEditing = this.route.query.mode === "edit";
        }
      },
    },
    "route.query.mode": {
      immediate: true,
      handler(newMode) {
        this.isEditing = newMode === "edit";
        if (this.isEditing && this.telefono) {
          this.editedTelefono = { ...this.telefono };
        }
      },
    },
  },
  methods: {
    async fetchTelefonoDetail(url) {
      try {
        this.loading = true;
        const response = await telefonoApi.getTelefonoByUrl(url);
        this.telefono = response.data;
        this.editedTelefono = { ...response.data };
      } catch (error) {
        console.error("Error al cargar detalle:", error);
        this.error = "No se pudo cargar el teléfono.";
      } finally {
        this.loading = false;
      }
    },
    async saveTelefono() {
      try {
        const url = decodeURIComponent(this.telefonoUrl);
        const response = await telefonoApi.updateTelefono(url, this.editedTelefono);
        this.telefono = { ...response.data };
        this.isEditing = false;
        this.router.replace({ query: {} });
        alert("¡Teléfono actualizado!");
      } catch (error) {
        console.error("Error al actualizar:", error);
        this.error = "No se pudo guardar.";
      }
    },
    startEditing() {
      this.isEditing = true;
      this.router.replace({ query: { ...this.route.query, mode: "edit" } });
    },
    cancelEditing() {
      this.isEditing = false;
      this.editedTelefono = { ...this.telefono };
      const newQuery = { ...this.route.query };
      delete newQuery.mode;
      this.router.replace({ query: newQuery });
    },
    goBack() {
      this.router.push("/telefonos");
    },
  },
};
</script>

<style scoped>
li {
  list-style-type: none;
}

.telefonos-container {
  max-width: 600px;
  margin: auto;
  padding: 20px;
}
.telefono-item {
  border-bottom: 1px solid #ccc;
  margin-bottom: 10px;
}
.error-message {
  color: red;
}
.btn {
  margin: 0 1em 1em 1em;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
  text-decoration: none; /* Para router-link */
  text-align: center;
  white-space: nowrap; /* Evita que el texto del botón se rompa */
}

.btn-detail {
  background-color: #007bff;
  color: white;
}
.btn-detail:hover {
  background-color: #0056b3;
}

.btn-edit {
  background-color: #ffc107;
  color: #333;
}
.btn-edit:hover {
  background-color: #e0a800;
}

.btn-delete {
  background-color: #dc3545;
  color: white;
}
.btn-delete:hover {
  background-color: #c82333;
}
</style>
