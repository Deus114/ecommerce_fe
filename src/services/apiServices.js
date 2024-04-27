import axios from "../utils/axiosCustomize";

// Auth Api
const postRegister = (fullName, email, password, phone) => {
    return axios.post('user/register', { fullName, email, password, phone });
}

const postLogin = (username, password) => {
    return axios.post('auth/login', { username, password });
}

const fetchAccount = () => {
    return axios.get('auth/account');
}

export {
    postRegister, postLogin,
    fetchAccount,
}