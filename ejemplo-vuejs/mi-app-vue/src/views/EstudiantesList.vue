<template>
  <div class="estudiantes-list-container">
    <h2>Listado de Estudiantes</h2>
    <p v-if="loading">Cargando estudiantes...</p>
    <p v-if="error" class="error-message">{{ error }}</p>
    <ul v-else-if="estudiantes.length">
      <li
        v-for="estudiante in estudiantes"
        :key="estudiante.url"
        class="estudiante-item"
      >
        <div class="estudiante-info">
          <span>
            {{ estudiante.nombre }} {{ estudiante.apellido }} (Cédula:
            {{ estudiante.cedula }})
          </span>
        </div>
        <div class="estudiante-actions">
          <router-link
            :to="{
              name: 'EstudianteDetail',
              params: { estudianteUrl: encodeURIComponent(estudiante.url) },
            }"
            class="btn btn-detail"
          >
            Ver Detalle
          </router-link>

          <router-link
            :to="{
              name: 'EstudianteDetail',
              params: { estudianteUrl: encodeURIComponent(estudiante.url) },
              query: { mode: 'edit' }, // Añadimos un query param para indicar modo edición
            }"
            class="btn btn-edit"
          >
            Editar
          </router-link>

          <button @click="confirmDelete(estudiante.url)" class="btn btn-delete">
            Eliminar
          </button>
        </div>
      </li>
    </ul>
    <p v-else>No hay estudiantes registrados.</p>
    <router-link to="/estudiantes/nuevo" class="add-button">
      Agregar Nuevo Estudiante
    </router-link>
  </div>
</template>

<script>
// Importa el nuevo servicio de estudiantes, que a su vez usa '@/api/axios'
import estudianteApi from "@/api/students";

export default {
  name: "EstudiantesList",
  data() {
    return {
      estudiantes: [],
      loading: true,
      error: null,
    };
  },
  async created() {
    await this.fetchEstudiantes();
  },
  methods: {
    async fetchEstudiantes() {
      try {
        this.loading = true;
        this.error = null;
        // Usa el nuevo servicio de API para estudiantes
        const response = await estudianteApi.getEstudiantes();
        // Asegúrate de que tu API de Django devuelva los resultados en .results
        // o directamente en response.data si no hay paginación.
        this.estudiantes = response.data.results || response.data;
        console.log("Estudiantes cargados:", this.estudiantes);
      } catch (err) {
        console.error("Error al cargar estudiantes:", err.response || err);
        this.error =
          "No se pudieron cargar los estudiantes. Asegúrate de estar logueado.";
        // Si el error es 401, el interceptor de axios.js debería manejar la redirección.
      } finally {
        this.loading = false;
      }
    },
    // Método para confirmar y eliminar
    async confirmDelete(estudianteUrl) {
      if (confirm("¿Estás seguro de que quieres eliminar a este estudiante?")) {
        try {
          // Usa el nuevo servicio de API para estudiantes para la eliminación
          await estudianteApi.deleteEstudiante(estudianteUrl);
          alert("¡Estudiante eliminado exitosamente!");
          await this.fetchEstudiantes(); // Recargar la lista después de la eliminación
        } catch (err) {
          console.error("Error al eliminar estudiante:", err.response || err);
          alert("Error al eliminar estudiante. Por favor, inténtalo de nuevo.");
          // El interceptor de axios.js debería manejar el 401
        }
      }
    },
  },
};
</script>

<style scoped>
.estudiantes-list-container {
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

ul {
  list-style: none;
  padding: 0;
}

.estudiante-item {
  display: flex; /* Usamos flexbox para alinear info y botones */
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.estudiante-item:last-child {
  border-bottom: none;
}

.estudiante-info {
  flex-grow: 1; /* Permite que la info del estudiante ocupe el espacio disponible */
}

.estudiante-actions {
  display: flex;
  gap: 8px; /* Espacio entre los botones */
}

.btn {
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

.add-button {
  display: block;
  width: fit-content;
  margin: 20px auto 0;
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border-radius: 5px;
  text-decoration: none;
  text-align: center;
  transition: background-color 0.3s ease;
}

.add-button:hover {
  background-color: #218838;
}

.error-message {
  color: red;
  text-align: center;
  margin-top: 10px;
}
</style>
