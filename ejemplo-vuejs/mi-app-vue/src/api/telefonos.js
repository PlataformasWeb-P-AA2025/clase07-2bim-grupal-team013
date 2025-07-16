import api from "@/api/axios"; // ya configurado con token y baseURL

export default {
  getTelefonos() {
    return api.get("numerosts/");
  },
  getTelefonoByUrl(url) {
    return api.get(url);
  },
  updateTelefono(url, data) {
    return api.put(url, data);
  },
  deleteTelefono(url) {
    return api.delete(url);
  },
};
