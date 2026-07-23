import axios from 'axios'
import { registerErrorHandler } from './errorHandler'

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
})

registerErrorHandler(httpClient)

export default httpClient
