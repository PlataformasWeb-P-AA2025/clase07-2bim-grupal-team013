<template>
  <div class="telefono-detail-container">
    <button @click="goBack" class="btn-back">← Volver</button>

    <h2 v-if="!isEditing">Detalle del Teléfono</h2>
    <h2 v-else>Editar Teléfono</h2>

    <p v-if="loading">Cargando datos...</p>
    <p v-if="error" class="error-message">{{ error }}</p>

    <div v-else-if="telefono">
      <div v-if="!isEditing" class="detail-display">
        <p><strong>Teléfono:</strong> {{ telefono.telefono }}</p>
        <p><strong>Tipo:</strong> {{ telefono.tipo }}</p>
        <p><strong>Estudiante:</strong> {{ telefono.estudiante }}</p>

        <button @click="startEditing" class="btn-edit-detail">Editar</button>
      </div>

      <form v-else @submit.prevent="saveTelefono" class="edit-form">
        <div class="form-group">
          <label for="telefono">Teléfono:</label>
          <input id="telefono" v-model="editedTelefono.telefono" required />
        </div>
        
        <div class="form-group">
          <label for="tipo">Tipo:</label>
          <input id="tipo" v-model="editedTelefono.tipo" required />
        </div>

        <div class="form-group">
          <label for="estudiante">Estudiante (URL):</label>
          <input id="estudiante" v-model="editedTelefono.estudiante" required />
        </div>
        
        <div class="form-group">
          <div class="form-actions">
            <button type="submit" class="btn-save">Guardar</button>
            <button type="button" @click="cancelEditing" class="btn-cancel">
              Cancelar
            </button>
          </div>
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
        const response = await telefonoApi.updateTelefono(
          url,
          this.editedTelefono
        );
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
/* Estilos generales para el contenedor */
.estudiante-detail-container {
  max-width: 700px;
  margin: 50px auto;
  padding: 25px;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  text-align: left;
}

/* Botón de volver */
.btn-back {
  background-color: #6c757d;
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 20px;
  transition: background-color 0.2s ease;
}
.btn-back:hover {
  background-color: #5a6268;
}

/* Títulos */
h2,
h3,
h4 {
  text-align: center;
  color: #333;
  margin-bottom: 15px;
}

/* Mensajes de error */
.error-message {
  color: red;
  text-align: center;
  margin-top: 10px;
  font-weight: bold;
}

/* Estilos para la visualización de detalles */
.detail-display p {
  font-size: 1.1em;
  margin-bottom: 10px;
  line-height: 1.6;
}

.detail-display strong {
  color: #555;
  margin-right: 5px;
}

.detail-display ul {
  list-style: disc;
  padding-left: 20px;
  margin-bottom: 20px;
}

.detail-display li {
  margin-bottom: 5px;
}

/* Botón de editar en la vista de detalle */
.btn-edit-detail {
  background-color: #28a745;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: block;
  width: fit-content;
  margin: 20px auto 0;
  transition: background-color 0.2s ease;
}
.btn-edit-detail:hover {
  background-color: #218838;
}

/* Estilos para el formulario de edición */
.edit-form .form-group {
  margin-bottom: 15px;
}

.edit-form label {
  display: block;
  margin-bottom: 5px;
  color: #333;
  font-weight: bold;
}

.edit-form input[type="text"],
.edit-form input[type="email"],
.edit-form input[type="number"] {
  width: calc(100% - 20px);
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1em;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 25px;
}

.btn-save {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.btn-save:hover {
  background-color: #0056b3;
}

.btn-cancel {
  background-color: #dc3545;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.btn-cancel:hover {
  background-color: #c82333;
}
</style>
