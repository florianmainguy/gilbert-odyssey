import axios from 'axios'

const api = axios.create()

export const getClassique = name => api.get(`/api/classiques/${name}`)
export const getAllClassiques = () => api.get(`/api/classiques`)
export const getCyclist = name => api.get(`/api/cyclists/${name}`)
export const getAllCyclists = () => api.get(`/api/cyclists`)
export const getClassiquesAndCyclists = () => api.get(`/api/all`)

const apis = {
    getClassique,
    getAllClassiques,
    getCyclist,
    getAllCyclists,
    getClassiquesAndCyclists
}

export default apis
