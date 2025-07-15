<template>
  <div class="telefono-edit-container">
    <h2>Editar Número Telefónico</h2>
    <form @submit.prevent="guardarCambios">
      <label for="telefono">Teléfono:</label>
      <input type="text" id="telefono" v-model="telefono.telefono" required />

      <label for="tipo">Tipo:</label>
      <input type="text" id="tipo" v-model="telefono.tipo" required />

      <button type="submit">Guardar</button>
    </form>
  </div>
</template>

<script>
import api from "@/api/axios";

export default {
  name: "TelefonoEdit",
  data() {
    return {
      telefono: {
        telefono: "",
        tipo: "",
      },
    };
  },
  async created() {
    const id = this.$route.params.id;
    const response = await api.get(`numerosts/${id}/`);
    this.telefono = response.data;
  },
  methods: {
    async guardarCambios() {
      const id = this.$route.params.id;
      try {
        await api.put(`numerosts/${id}/`, this.telefono);
        this.$router.push("/telefonos"); // Redirige al listado
      } catch (err) {
        console.error("Error al guardar cambios:", err);
      }
    },
  },
};
</script>

<style scoped>
.telefono-edit-container {
  max-width: 500px;
  margin: 30px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
}
</style>
