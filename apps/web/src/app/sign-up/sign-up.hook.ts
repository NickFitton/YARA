import { useMutation } from "@tanstack/react-query";
import { UserCreationForm } from "./sign-up.schema";
import { createAccount } from "./sign-up.action";

export const useSignUp = () =>
  useMutation({
    mutationFn: async (data: UserCreationForm) => createAccount(data),
  });
