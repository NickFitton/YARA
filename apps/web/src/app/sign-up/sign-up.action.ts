"use server";

import { CreateUserDto, ReadUserDto } from "@yara/api/user";
import { createUser } from "@/lib/api";
import { attemptLogin } from "../login/login.action";

export const createAccount = async (
  data: CreateUserDto
): Promise<ReadUserDto> => {
  const accountData = await createUser(data);
  const loginResponse = await attemptLogin({
    password: data.password,
    email: data.email,
  });
  switch (loginResponse.status) {
    case "ok":
      return accountData;
    case "error":
      throw loginResponse.error;
  }
};
