import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { router } from "../Router/routes";
import { PaginatedResponse } from "../models/pagination";
import { store } from "../store/configureStore";

const sleep = () => new Promise(resolve => setTimeout(resolve, 200));

axios.defaults.baseURL = 'http://localhost:5000/api/';
axios.defaults.withCredentials = true; // for cookie

const responseBody = (response: AxiosResponse) => response.data;

axios.interceptors.request.use(config => {
    //attach token as authorization header to our request, will persist login when refreshing
    const token = store.getState().account.user?.token;
    if (token) config.headers.Authorization = `Bearer ${token}`; // backticks to include JS
    return config;
})

axios.interceptors.response.use(async response => {
    await sleep();

    const pagination = response.headers['pagination']; // needs to be lowercase due to axios
    if (pagination) {
        response.data = new PaginatedResponse(response.data, JSON.parse(pagination));
        return response;
    }

    return response;

}, (error: AxiosError) => {
    const { data, status } = error.response as AxiosResponse;
    switch (status) {
        case 400:
            if (data.errors) {
                const modelStateErrors: string[] = [];
                for (const key in data.errors) {
                    if (data.errors[key]) {
                        modelStateErrors.push(data.errors[key])
                    }
                }
                throw modelStateErrors.flat(); // returns 2 strings in an array without flat() returns array with subarrays
            }

            toast.error(data.title);
            break;
        case 401:
            toast.error(data.title);
            break;
        case 500:
            router.navigate('/server-error', { state: {error: data}}); //change URL/add to browser history outside of react component
            break;
        default:
            break;

    }
    return Promise.reject(error.response);
})

// objects 
const requests = {
    get: (url: string, params?: URLSearchParams) => axios.get(url, {params}).then(responseBody),
    post: (url: string, body: object) => axios.post(url, body).then(responseBody),
    put: (url: string, body: object) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody)

}

const Catalog = {
    list: (params: URLSearchParams) => requests.get('products', params),
    details: (id: number) => requests.get(`products/${id}`),
    fetchFilters: () => requests.get('products/filters')
}

const TestErrors = {
    get400Error: () => requests.get('buggy/bad-request'),
    get401Error: () => requests.get('buggy/unauthorized'),
    get404Error: () => requests.get('buggy/not-found'),
    get500Error: () => requests.get('buggy/server-error'),
    getValidationError: () => requests.get('buggy/validation-error'),

}

const Basket = {
    get: () => requests.get('basket'),
    // must match BasketDto parameter, need {} because need to pass new object
    addItem: (productId: number, quantity = 1) => requests.post(`basket?productId=${productId}&quantity=${quantity}`, {}),
    removeItem: (productId: number, quantity = 1) => requests.delete(`basket?productId=${productId}&quantity=${quantity}`), 

}

const Account = {
    login: (values: any) => requests.post('account/login', values),
    register: (values: any) => requests.post('account/register', values),
    currentUser: () => requests.get('account/currentUser'),

}

const agent = {
    Catalog,
    TestErrors,
    Basket,
    Account
}

export default agent;

// function responseBodyfn(response: AxiosResponse) { 
// return response.data;
//}

