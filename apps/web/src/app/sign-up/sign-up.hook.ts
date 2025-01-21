import { useMutation } from "@tanstack/react-query";
import { CreateUserDto } from "@yara/api/user";
import { createAccount } from "./sign-up.action";

export const useSignUp = () =>
  useMutation({
    mutationFn: async (data: CreateUserDto) => createAccount(data),
  });
