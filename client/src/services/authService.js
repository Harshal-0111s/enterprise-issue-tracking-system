import axios from "axios";

const API = `${process.env.REACT_APP_API_URL}/api/auth`;

export const loginUser = async (loginData) => {
    return await axios.post(`${API}/login`, loginData);
};

export const registerUser = async (registerData) => {
    return await axios.post(`${API}/register`, registerData);
};