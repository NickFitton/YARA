"use server";

import {cookies} from "next/headers"
import {UserCreationForm} from "./sign-up.schema"
import { createUser } from "@/lib/api";
import { attemptLogin } from "../login/login.action";

export const createAccount = async (data: UserCreationForm): Promise<object> => {
    const accountData = await createUser(data);
    const loginData = await attemptLogin({password:data.password, email: data.email})
    cookies().set("accessToken", loginData.accessToken)
    return accountData
}