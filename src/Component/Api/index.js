import axios from "axios"

const API = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
});

export const getData = async (param) => {
    return API.get(`/books?title=${param}`)
}

export const sortData = async (param) => {
    return API.get(`/books?DIR=${param}`)
}

export const sendData = async (param) => {
    return API.post("/books", param)
}
export const editData = async (param) => {
    return API.put(`/books/${param?.id}`, param)
}