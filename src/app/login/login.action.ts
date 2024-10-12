"use server";

import { cookies } from "next/headers";
import { LoginSchema } from "./login.schema";
import { login } from "@/lib/api";

// I'd like this request to be a bit more trustworthy
export const attemptLogin = async (data: LoginSchema): Promise<object> => {
  const loginData = await login(data);
  cookies().set("accessToken", loginData.accessToken);
  return loginData;
};
