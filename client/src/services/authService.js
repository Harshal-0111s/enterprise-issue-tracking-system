import axios from "axios";

const API = "http://localhost:5001/api/auth";

export const loginUser = async (loginData) => {
    return await axios.post(`${API}/login`, loginData);
};

export const registerUser = async (registerData) => {
    return await axios.post(`${API}/register`, registerData);
};