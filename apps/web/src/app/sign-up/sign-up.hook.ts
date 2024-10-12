import { useMutation } from "@tanstack/react-query";
import { UserCreationForm } from "./sign-up.schema";
import { createUser, login } from "@/lib/api";

export const useSignUp = () =>
  useMutation({
    mutationFn: async (data: UserCreationForm) => {
      await createUser(data);
      return login({ email: data.email, password: data.password });
    },
  });
