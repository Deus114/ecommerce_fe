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

const callLogout = () => {
    return axios.post('auth/logout')
}

const fetchListUser = (query) => {
    return axios.get(`user?${query}`);
}

const postCreateUser = (fullName, email, password, phone) => {
    return axios.post('user', { fullName, email, password, phone });
}

const UpdateUser = (_id, fullName, phone) => {
    return axios.put('user', { _id, fullName, phone });
}

const DelteUser = (_id) => {
    return axios.delete(`user/${_id}`);
}

// Book api
const fetchListBook = (query) => {
    return axios.get(`book?${query}`);
}

const callFetchCategory = () => {
    return axios.get("database/category");
}

const callUploadBookImg = (fileImg) => {
    const bodyFormData = new FormData();
    bodyFormData.append('fileImg', fileImg);
    return axios({
        method: 'post',
        url: 'file/upload',
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
            "upload-type": "book"
        },
    });

}

const createBook = (thumbnail, slider, mainText, author, price, sold, quantity, category) => {
    return axios.post('book', { thumbnail, slider, mainText, author, price, sold, quantity, category });

}

const updateBook = (id, thumbnail, slider, mainText, author, price, sold, quantity, category) => {
    return axios.put(`book/${id}`, { thumbnail, slider, mainText, author, price, sold, quantity, category });
}

const DelteBook = (_id) => {
    return axios.delete(`book/${_id}`);
}

export {
    postRegister, postLogin,
    fetchAccount, callLogout,
    fetchListUser, postCreateUser,
    UpdateUser, DelteUser,
    fetchListBook, callFetchCategory,
    callUploadBookImg, createBook,
    updateBook, DelteBook
}