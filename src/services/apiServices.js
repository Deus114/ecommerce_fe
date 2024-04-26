import axios from "../utils/axiosCustomize";

// Auth Api
const postRegister = (fullName, email, password, phone) => {
    return axios.post('user/register', { fullName, email, password, phone });
}

export {
    postRegister
}