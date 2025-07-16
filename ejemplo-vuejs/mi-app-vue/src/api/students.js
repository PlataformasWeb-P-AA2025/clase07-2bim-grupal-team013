import api from "./axios"; // Importa la instancia de axios que ya configuraste

export default {
  // Función para obtener todos los estudiantes (si no la tienes en otro lado)
  getEstudiantes() {
    return api.get("estudiantes/"); // Asume que la URL para listar es /api/estudiantes/
  },

  getEstudianteByUrl(estudianteUrl) {
    return api.get(estudianteUrl);
  },

  createEstudiante(estudianteData) {
    return api.post("estudiantes/", estudianteData);
  },

  updateEstudiante(estudianteUrl, estudianteData) {
    return api.put(estudianteUrl, estudianteData); // O .patch() si tu API permite actualizaciones parciales
  },

  deleteEstudiante(estudianteUrl) {
    return api.delete(estudianteUrl);
  },
};
