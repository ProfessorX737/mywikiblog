export const VIEW_KEY = 'xavierunderstandsview';
export const TOKEN_KEY = 'xavierunderstandstoken';

export const setView = (view) => {
  localStorage.setItem(VIEW_KEY, JSON.stringify(view));
}

export const getView = () => {
  const view = localStorage.getItem(VIEW_KEY);
  if(!view) return null;
  return JSON.parse(view);
}

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
}

export const getToken = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  if(!token) return '';
  return token;
}

export const deleteToken = () => {
  localStorage.removeItem(TOKEN_KEY);
}
