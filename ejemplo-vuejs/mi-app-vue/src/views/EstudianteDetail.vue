<template>
  <div class="estudiante-detail-container">
    <button @click="goBack" class="btn-back">← Volver a la lista</button>

    <h2 v-if="!isEditing">Detalle del Estudiante</h2>
    <h2 v-else>Editar Estudiante</h2>

    <p v-if="loading">Cargando detalles...</p>
    <p v-if="error" class="error-message">{{ error }}</p>

    <div v-else-if="estudiante">
      <div v-if="!isEditing" class="detail-display">
        <h3>{{ estudiante.nombre }} {{ estudiante.apellido }}</h3>
        <p><strong>Cédula:</strong> {{ estudiante.cedula }}</p>
        <p><strong>Correo:</strong> {{ estudiante.correo }}</p>
        <p><strong>Edad:</strong> {{ estudiante.edad }}</p>
        <h4>Números Telefónicos:</h4>
        <ul v-if="numerosTelefonicos.length">
          <li v-for="numero in numerosTelefonicos" :key="numero.url">
            {{ numero.telefono }} ({{ numero.tipo }})
          </li>
        </ul>
        <p v-else>No tiene números telefónicos registrados.</p>

        <button @click="startEditing" class="btn-edit-detail">
          Editar Estudiante
        </button>
      </div>

      <form v-else @submit.prevent="saveEstudiante" class="edit-form">
        <div class="form-group">
          <label for="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            v-model="editedEstudiante.nombre"
            required
          />
        </div>
        <div class="form-group">
          <label for="apellido">Apellido:</label>
          <input
            type="text"
            id="apellido"
            v-model="editedEstudiante.apellido"
            required
          />
        </div>
        <div class="form-group">
          <label for="cedula">Cédula:</label>
          <input
            type="text"
            id="cedula"
            v-model="editedEstudiante.cedula"
            required
            :readonly="isEditing"
          />
        </div>
        <div class="form-group">
          <label for="correo">Correo:</label>
          <input
            type="email"
            id="correo"
            v-model="editedEstudiante.correo"
            required
          />
        </div>
        <div class="form-group">
          <label for="edad">Edad:</label>
          <input
            type="number"
            id="edad"
            v-model.number="editedEstudiante.edad"
            required
          />
        </div>
        <div class="form-actions">
          <button type="submit" class="btn-save">Guardar Cambios</button>
          <button type="button" @click="cancelEditing" class="btn-cancel">
            Cancelar
          </button>
        </div>
      </form>
    </div>
    <p v-else>Estudiante no encontrado.</p>
  </div>
</template>

<script>
// Importa el nuevo servicio de estudiantes
import estudianteApi from "@/api/students";
import { useRouter, useRoute } from "vue-router";

export default {
  name: "EstudianteDetail",
  props: ["estudianteUrl"], // Recibe la URL completa del estudiante desde el router
  data() {
    return {
      estudiante: null, // Datos del estudiante para mostrar en modo detalle
      editedEstudiante: {
        // Objeto para el formulario de edición
        nombre: "",
        apellido: "",
        cedula: "", // Incluir todos los campos editables
        correo: "",
        edad: null,
        // Asegúrate de incluir todos los campos que tu API de Django espera para actualizar
      },
      numerosTelefonicos: [],
      loading: true,
      error: null,
      isEditing: false, // Estado para alternar entre vista y edición
    };
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    return { router, route };
  },
  watch: {
    // Escucha cambios en la URL del estudiante (por si se navega a otro detalle desde esta vista)
    estudianteUrl: {
      immediate: true, // Ejecuta el handler inmediatamente al crear el componente
      async handler(newVal, oldVal) {
        if (newVal && newVal !== oldVal) {
          // Si hay un cambio significativo en la URL del estudiante
          await this.fetchEstudianteDetail(decodeURIComponent(newVal));
          await this.fetchNumerosTelefonicos(decodeURIComponent(newVal));
          // Resetear el modo edición al cargar un nuevo estudiante
          this.isEditing = this.route.query.mode === "edit";
        }
      },
    },
    // Escucha cambios en los query parameters para activar/desactivar el modo edición
    "route.query.mode": {
      immediate: true,
      handler(newMode) {
        this.isEditing = newMode === "edit";
        // Si entramos en modo edición, inicializa editedEstudiante con los datos actuales
        if (this.isEditing && this.estudiante) {
          this.editedEstudiante = { ...this.estudiante };
        }
      },
    },
  },
  async created() {
    // Si el componente se crea directamente en una ruta de edición (ej. refresh)
    // El watcher 'estudianteUrl' ya se encarga de cargar los datos y el watcher 'route.query.mode'
    // de establecer isEditing.
  },
  methods: {
    async fetchEstudianteDetail(url) {
      try {
        this.loading = true;
        this.error = null;
        // Usamos el servicio de API para estudiantes
        const response = await estudianteApi.getEstudianteByUrl(url);
        this.estudiante = response.data;
        // Inicializa editedEstudiante con los datos cargados para el formulario de edición
        this.editedEstudiante = { ...response.estudiante }; // Asegúrate de que los campos coincidan
      } catch (err) {
        console.error(
          "Error al cargar detalle del estudiante:",
          err.response || err
        );
        if (err.response && err.response.status === 404) {
          this.error = "Estudiante no encontrado.";
          this.estudiante = null; // Para que el v-else-if no muestre el div
        } else {
          this.error =
            "No se pudo cargar el detalle del estudiante. Asegúrate de estar logueado.";
        }
      } finally {
        this.loading = false;
      }
    },
    async fetchNumerosTelefonicos(estudianteApiUrl) {
      console.log("Fetching numeros for:", estudianteApiUrl); // Para depuración
      try {
        // Asumo que tu endpoint 'numerosts/' devuelve todos los números, y luego filtras.
        // Si tu API tiene un endpoint para obtener números de un estudiante específico (ej. /estudiantes/{id}/numerosts/), úsalo.
        const response = await estudianteApi.getNumerosTelefonicos(); // Asume que tienes un getNumerosTelefonicos en students.js o un api global
        this.numerosTelefonicos = response.data.results.filter(
          (numero) => numero.estudiante === estudianteApiUrl
        );
      } catch (err) {
        console.error(
          "Error al cargar números telefónicos:",
          err.response || err
        );
        // No establecer un error grande para esto, ya que el detalle del estudiante puede ser cargado
      }
    },
    goBack() {
      // Vuelve a la lista de estudiantes
      this.$router.push("/estudiantes");
    },
    startEditing() {
      this.isEditing = true;
      // Añade el query param a la URL sin recargar la página
      this.router.replace({ query: { ...this.route.query, mode: "edit" } });
    },
    cancelEditing() {
      this.isEditing = false;
      // Restaura los datos del formulario a los datos originales del estudiante
      if (this.estudiante) {
        this.editedEstudiante = { ...this.estudiante };
      }
      // Elimina el query param 'mode' de la URL sin recargar
      const newQuery = { ...this.route.query };
      delete newQuery.mode;
      this.router.replace({ query: newQuery });
    },
    async saveEstudiante() {
      this.error = null; // Limpiar errores previos
      try {
        const decodedUrl = decodeURIComponent(this.estudianteUrl);
        // Usa el servicio de API para estudiantes para la actualización
        const response = await estudianteApi.updateEstudiante(
          decodedUrl,
          this.editedEstudiante
        );

        // Asumiendo que la API devuelve los datos actualizados
        this.estudiante = { ...response.data };

        alert("¡Estudiante actualizado exitosamente!");
        this.isEditing = false; // Vuelve al modo de visualización
        this.router.replace({ query: {} }); // Limpia el query param 'mode'
      } catch (err) {
        console.error(
          "Error al guardar cambios del estudiante:",
          err.response || err
        );
        this.error =
          "Error al guardar los cambios. Por favor, verifica los datos.";
        if (err.response && err.response.data) {
          // Muestra errores de validación específicos del backend si existen
          if (err.response.data.cedula) {
            this.error += ` Cédula: ${err.response.data.cedula.join(", ")}`;
          }
          // Agrega más campos si necesitas mostrar errores específicos
        }
      }
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
