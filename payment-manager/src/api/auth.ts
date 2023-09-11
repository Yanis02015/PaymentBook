import { MakeRequest } from "./config";

export const login = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}): Promise<{ message: string }> => {
  return await MakeRequest.post("auth/login", {
    json: { username, password },
  }).json();
};

export const refresh = async () => await MakeRequest.get("auth/refresh").json();
