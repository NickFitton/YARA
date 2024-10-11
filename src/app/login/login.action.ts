"use server";

import { cookies } from "next/headers";
import { LoginSchema } from "./login.schema";

// I'd like this request to be a bit more trustworthy
export const attemptLogin = async (data: LoginSchema): Promise<object> => {
  const response = await fetch("http://localhost:3000/auth/login", {
    body: JSON.stringify(data),
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status === 201) {
    const jsonBody = await response.json();
    cookies().set("accessToken", jsonBody.accessToken);
    return jsonBody;
  }
  throw new Error("Bad request");
};
