export const domain = "https://xavierunderstands.com";
export const routeStem = `${domain}/api`;

export const home = "/";
export const login = "/login";
export const getHomeRoute = (cellId = undefined) => {
  if(cellId === '') return '/article';
  if(cellId === undefined) return "/article/:cellId?";
  return `/article/${cellId}`;
}