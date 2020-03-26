import axios from 'axios'

const api = axios.create()

export const getClassiquesAndCyclists = () => api.get(`/api/all`)

const apis = {
    getClassiquesAndCyclists
}

export default apis
