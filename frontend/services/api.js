import axios from "axios";

export const api = axios.create({
  baseURL: "http://10.73.214.234:5000/api", 
  timeout: 5000,
});
