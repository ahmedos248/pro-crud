import axios from "axios";
// Axios HTTP client for the local dev API

const localApi = axios.create({
  baseURL: "http://localhost:5001",
// json-server base URL

  timeout: 10000,
// keep the UI responsive on slow networks
});

export default localApi;
// reuse this client in mutations/hooks
