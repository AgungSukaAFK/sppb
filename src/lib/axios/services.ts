import instance from ".";

export const api = {
  get: (url: string) => instance.get(url),
  post: (url: string, body: object) => instance.post(url, JSON.stringify(body)),
  put: (url: string, body: object) => instance.put(url, JSON.stringify(body)),
  delete: (url: string) => instance.delete(url),
};
