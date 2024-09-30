import { useMutation } from "@tanstack/react-query";
import { UserCreationForm } from "./sign-up.schema";

export const useSignUp = () =>
  useMutation({
    mutationFn: (data: UserCreationForm) =>
      fetch("http://localhost:3000/users", {
        body: JSON.stringify(data),
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
      }),
  });
