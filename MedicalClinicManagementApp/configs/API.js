import axios from "axios";

export const endpoints = {
    'login': 'login/',
    'current-user': '/current-user/',
    'register': '/register/',
    'medicines': '/medicines/',
    'medicinesCreate': '/medicines/create/',
    'users': '/users/',
    'user-appointments': '/user-appointments/',
    'schedules': '/schedules/',
    'appointments': '/appointments/',
    'prescriptions': '/prescriptions/',
    'prescriptions-create': '/prescriptions/create/',
}

export const authApi = (accessToken) => axios.create({
    baseURL: "http://10.0.2.2:8000/api",
    headers: {
        "Authorization": `bearer ${accessToken}`
    }
})

export default axios.create({
    baseURL: "http://10.0.2.2:8000/api"
})