export const setStorage = (key: any, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};
export const getStorage = (key: any) => {
  const data: any = localStorage.getItem(key);
  return JSON.parse(data);
};
