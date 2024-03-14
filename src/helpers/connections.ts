import axios, { AxiosRequestConfig } from "axios";
import { BASEURL } from "../constants"


interface Auth {
  state: boolean;
  token: string;
}

export default async function apiRequest(
  path: string,
  body: Record<string, any> = {},
  method = "get",
  auth?: Auth,
): Promise<any> {
  console.log('debug debug', path)
  return new Promise(async (resolve, reject) => {
    let header: Record<string, string> = {};
    if (auth && auth.state) {
      header = {
        Authorization: `Bearer ${auth.token}`,
      };
    }

    try {
      const config: AxiosRequestConfig = {
        method: method,
        url: BASEURL + "/" + path,
        headers: header,
        data: body,
        params: method === "GET" ? body : {},
      };
      const response = await axios(config);
      resolve(response.data);
    } catch (err) {
      const error = new ApiError(err instanceof Error ? err.message : "An error occurred");
      error.info = (err as any)?.response?.data;
      reject(error);
    }
  });
}

class ApiError extends Error {
  info?: any;

  constructor(message: string) {
    super(message);
    this.name = "ApiError";
  }
}
