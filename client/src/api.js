import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
})

export const getClassique = name => api.get(`/clasiques/${name}`)
export const getAllClassiques = () => api.get(`/classiques`)

const apis = {
    getClassique,
    getAllClassiques,
}

export default apis