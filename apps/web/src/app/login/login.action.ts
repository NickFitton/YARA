"use server";

import { cookies } from "next/headers";
import { LoginDto, TokenDto } from "@yara/api/auth";
import { login } from "@/lib/api";

type Response<D = undefined, E = unknown> = D extends undefined
  ?
      | {
          status: "ok";
        }
      | { status: "error"; error: { reason: string } & E }
  :
      | {
          status: "ok";
          data: D;
        }
      | { status: "error"; error: { reason: string } & E };

// I'd like this request to be a bit more trustworthy
type LoginResponse = Response<undefined>;
export const attemptLogin = async (data: LoginDto): Promise<LoginResponse> => {
  const cookiesP = cookies();
  const response = await login(data);
  switch (response.status) {
    case 201: {
      const body = (await response.json()) as TokenDto;
      (await cookiesP).set("accessToken", body.accessToken);
      return { status: "ok" };
    }
    case 401: {
      return {
        status: "error",
        error: { reason: "Bad username/password combination." },
      };
    }
    default:
      return { status: "error", error: { reason: "unknown" } };
  }
};
