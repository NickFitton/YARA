import { useMutation } from "@tanstack/react-query";
import { LoginSchema } from "./login.schema";

export const useLogin = () =>
  useMutation({
    mutationFn: (data: LoginSchema) =>
      fetch("http://localhost:3000/auth/login", {
        body: JSON.stringify(data),
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
      }),
  });
