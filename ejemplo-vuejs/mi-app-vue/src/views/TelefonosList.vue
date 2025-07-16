<template>
  <div class="telefonos-container">
    <h2>Listado de Teléfonos</h2>
    <p v-if="loading">Cargando teléfonos...</p>
    <p v-if="error" class="error-message">{{ error }}</p>
    <ul v-else-if="telefonos.length">
      <li
        v-for="telefono in telefonos"
        :key="telefono.url"
        class="telefono-item"
      >
        <p><strong>Teléfono:</strong> {{ telefono.telefono }}</p>
        <p><strong>Tipo:</strong> {{ telefono.tipo }}</p>
        <p><strong>Estudiante:</strong> {{ telefono.estudiante }}</p>

        <router-link
          :to="{
            name: 'TelefonoDetail',
            params: { telefonoUrl: encodeURIComponent(telefono.url) },
          }"
          class="btn btn-detail"
          >Ver Detalle</router-link
        >

        <router-link
          :to="{
            name: 'TelefonoDetail',
            params: { telefonoUrl: encodeURIComponent(telefono.url) },
            query: { mode: 'edit' },
          }"
          class="btn btn-edit"
          >Editar</router-link
        >

        <button @click="confirmDelete(telefono.url)" class="btn btn-delete">
          Eliminar
        </button>
      </li>
    </ul>
    <p v-else>No hay teléfonos registrados.</p>
    <router-link to="/telefonos/nuevo" class="add-button"
      >Agregar Teléfono</router-link
    >
  </div>
</template>

<script>
import telefonoApi from "@/api/telefonos"; // Asegúrate de tener este archivo creado

export default {
  name: "TelefonoList",
  data() {
    return {
      telefonos: [],
      loading: false,
      error: null,
    };
  },
  async created() {
    await this.fetchTelefonos();
  },
  methods: {
    async fetchTelefonos() {
      this.loading = true;
      try {
        const response = await telefonoApi.getTelefonos();
        this.telefonos = response.data.results || response.data;
      } catch (error) {
        console.error(error);
        this.error = "Error al cargar los teléfonos.";
      } finally {
        this.loading = false;
      }
    },
    async confirmDelete(telefonoUrl) {
      if (confirm("¿Estás segura de que quieres eliminar este teléfono?")) {
        try {
          await telefonoApi.deleteTelefono(telefonoUrl);
          alert("¡Teléfono eliminado exitosamente!");
          await this.fetchTelefonos(); // Recargar lista
        } catch (err) {
          console.error("Error al eliminar teléfono:", err);
          alert("No se pudo eliminar el teléfono.");
        }
      }
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
