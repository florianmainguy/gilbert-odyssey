import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
})

export const getClassique = name => api.get(`/classiques/${name}`)
export const getAllClassiques = () => api.get(`/classiques`)
export const getCyclist = name => api.get(`/cyclists/${name}`)
export const getAllCyclists = () => api.get(`/cyclists`)

const apis = {
    getClassique,
    getAllClassiques,
    getCyclist,
    getAllCyclists
}

export default apis