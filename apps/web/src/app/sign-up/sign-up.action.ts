"use server";

import { cookies } from "next/headers";
import { CreateUserDto, ReadUserDto } from "@yara/api/user";
import { createUser } from "@/lib/api";
import { attemptLogin } from "../login/login.action";

export const createAccount = async (data: CreateUserDto): Promise<ReadUserDto> => {
  const accountData = await createUser(data);
  const loginData = await attemptLogin({
    password: data.password,
    email: data.email,
  });
  cookies().set("accessToken", loginData.accessToken);
  return accountData;
};
