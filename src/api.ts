import { BASE_URL } from "./config";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { ZodSchema } from "zod";
import { EnhancedSiteInfo, outagesSchema, siteInfoSchema } from "./models";

const API_KEY = process.env.API_KEY as string;

export const apiHeaders: AxiosRequestConfig<null> = {
  headers: {
    "x-api-key": API_KEY,
  },
};

export class ApiError extends Error {
  constructor(m: string) {
    super(m);
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

const checkApiResponse = (response: AxiosResponse<any, any>) => {
  if (!response) {
    throw new ApiError("No response from API");
  }
  if (response.status !== 200) {
    throw new ApiError(`${response.status} code received from API`);
  }
  return response;
};

export const getData = async <T>(
  endpoint: string,
  schema: ZodSchema<T>
): Promise<T> => {
  const url = `${BASE_URL}/${endpoint}`;
  const apiReponse = await axios.get(url, apiHeaders);
  const successResponse = checkApiResponse(apiReponse);
  const parsedResponse = schema.safeParse(successResponse.data);
  if (!parsedResponse.success)
    throw new Error("Payload recceived doesn't match schema");
  return parsedResponse.data;
};

export const postData = async <T>(data: T, endpoint: string): Promise<void> => {
  const response = await axios.post(
    `${BASE_URL}/${endpoint}`,
    data,
    apiHeaders
  );
  checkApiResponse(response);
};

export const getOutages = async () => await getData("outages", outagesSchema);

export const getSiteInfo = async (siteId: string) =>
  await getData(`site-info/${siteId}`, siteInfoSchema);

export const sendData = async (siteId: string, data: EnhancedSiteInfo[]) =>
  await postData(data, `site-outages/${siteId}`);

export const retry = async <T extends (...arg0: any[]) => any>(
  fn: T,
  args: Parameters<T>,
  maxTry: number,
  retryCount = 0
): Promise<Awaited<ReturnType<T>>> => {
  try {
    return await fn(...args);
  } catch (e) {
    console.log(`Retry: ${retryCount} failed`);
    if (retryCount >= maxTry) {
      if (e instanceof Error) {
        console.log(e.message)
      } else {
        console.log(e)
      }
      throw new Error(`All ${maxTry} retry attempts exhausted`)
    }
    return retry(fn, args, maxTry, retryCount + 1);
  }
};
