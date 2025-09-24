import axios from "axios";
import { Toaster } from "react-hot-toast"
<Toaster position="top-center" />
// enables toasts globally; top-center is a clean default
const api = axios.create({
  baseURL: "https://api.escuelajs.co/api/v1", 
  timeout: 10000, 
}); 
export default api;