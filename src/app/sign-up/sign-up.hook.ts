import { useMutation } from "@tanstack/react-query";
import { UserCreationForm } from "./sign-up.schema";

export const useSignUp = () =>
  useMutation({
    mutationFn: async (data: UserCreationForm) => {
      const signupResponse = await fetch("http://localhost:3000/users", {
        body: JSON.stringify(data),
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (signupResponse.status !== 201) {
        throw new Error("Failed to sign up");
      }
      const loginResponse = await fetch("http://localhost:3000/auth/login", {
        body: JSON.stringify({ email: data.email, password: data.password }),
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (loginResponse.status !== 201) {
        throw new Error("Failed to log in");
      }
      return loginResponse.json();
    },
  });
