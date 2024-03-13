import axios, { AxiosRequestConfig } from "axios";
// const BASEURL = "https://nodesynapse.app/";
// const BASEURL = "http://192.168.1.29:3001/";
// const BASEURL = "http://localhost:3001/";
const BASEURL = "http://65.21.151.173:3001/";

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
        url: BASEURL + path,
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
