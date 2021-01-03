export const VIEW_KEY = 'xavierunderstandsview';

export const setView = (view) => {
  localStorage.setItem(VIEW_KEY, JSON.stringify(view));
}

export const getView = () => {
  const view = localStorage.getItem(VIEW_KEY);
  if(!view) return null;
  return JSON.parse(view);
}

