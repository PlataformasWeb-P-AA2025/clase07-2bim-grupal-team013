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

        <button @click="editarTelefono(telefono.id)">Editar</button>
        <button @click="eliminarTelefono(telefono.id)">Eliminar</button>
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
      this.$router.push({name: "EditarTelefono", params: { id } });
    },
    async eliminarTelefono(id) {
      
    }
  },
};
</script>

<style scoped>
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
</style>
