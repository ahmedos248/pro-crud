import axios from "axios";
import { Toaster } from "react-hot-toast"
<Toaster position="top-center" />
const api = axios.create({
  baseURL: "https://api.escuelajs.co/api/v1", 
  timeout: 10000, 
}); 
export default api;