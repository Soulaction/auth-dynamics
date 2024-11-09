import {AxiosResponse} from "axios";
import {User} from "../model/User";
import {$serverHost} from "./index";

export const registration = async (login: string, email: string, password: string): Promise<AxiosResponse<User>> => {
    return await $serverHost.post('/auth/registration', {login, email, password})
}

export const login = async (login: string, password: string, ua: string): Promise<AxiosResponse<{accessToken: string}>> => {
    return await $serverHost.post('/auth/login', {login, password, ua})
}
