"use server";

import { cookies } from "next/headers";
import { LoginDto, TokenDto } from "@yara/api/auth";
import { login } from "@/lib/api";

// I'd like this request to be a bit more trustworthy
export const attemptLogin = async (data: LoginDto): Promise<TokenDto> => {
  const loginData = await login(data);
  cookies().set("accessToken", loginData.accessToken);
  return loginData;
};
