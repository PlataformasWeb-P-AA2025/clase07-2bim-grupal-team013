<template>
  <div class="telefonos-container">
    <h2>Listado de Teléfonos</h2>
    <p v-if="loading">Cargando teléfonos...</p>
    <p v-if="error" class="error-message">{{ error }}</p>
    <ul v-else-if="telefonos.length">
      <li
        v-for="telefono in telefonos"
        :key="telefono.id"
        class="telefono-item"
      >
        <p><strong>Teléfono:</strong> {{ telefono.telefono }}</p>
        <p><strong>Tipo:</strong> {{ telefono.tipo }}</p>
        <p><strong>Estudiante:</strong> {{ telefono.estudiante }}</p>

        <button @click="editarTelefono(telefono.id)" class="btn btn-edit">
          Editar
        </button>

        <button @click="eliminarTelefono(telefono.id)" class="btn btn-delete">
          Eliminar
        </button>
      </li>
    </ul>
    <p v-else>No hay teléfonos registrados.</p>
  </div>
</template>

<script>
import api from "@/api/axios";

export default {
  name: "TelefonosList",
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
        const response = await api.get("numerosts/");
        this.telefonos = response.data.results || response.data;
      } catch (error) {
        this.error = "Error al cargar los teléfonos.";
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    editarTelefono(id) {
      this.$router.push({ name: "EditarTelefono", params: { id } });
    },
    async eliminarTelefono(id) {
      const confirmar = confirm(
        "¿Estás segura de que deseas eliminar este teléfono?"
      );
      if (!confirmar) return;

      try {
        await api.delete(`numerosts/${id}/`);
        // Filtra el teléfono eliminado de la lista local
        this.telefonos = this.telefonos.filter((t) => t.id !== id);
      } catch (error) {
        this.error = "Error al eliminar el teléfono.";
        console.error(error);
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
