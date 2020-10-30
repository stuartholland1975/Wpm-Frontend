import axios from "axios";
import useAxios, { configure } from "axios-hooks";

const baseUrl = "http://localhost:8000";

const instance = axios.create({
  withCredentials: true,
  baseURL: baseUrl,
  timeout: 15000,
  headers: {
    Authorization: localStorage.getItem("access_token")
      ? "JWT " + localStorage.getItem("access_token")
      : null,
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

configure({ instance });
