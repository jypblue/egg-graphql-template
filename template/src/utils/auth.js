import Cookies from 'js-cookie';

export function getTokenCookie(TokenKey) {
  return JSON.parse(Cookies.get(TokenKey));
}

export function setTokenCookie(TokenKey, token) {
  return Cookies.set(TokenKey, JSON.stringify(token));
}

export function removeTokenCookie(TokenKey) {
  return Cookies.remove(TokenKey);
}

export function getTokenStorage(TokenKey) {
  return JSON.parse(window.localStorage.getItem(TokenKey)) || {};
}

export function setTokenStorage(TokenKey, token) {
  return window.localStorage.setItem(TokenKey, JSON.stringify(token));
}

export function removeTokenStorage(TokenKey) {
  return window.localStorage.removeItem(TokenKey);
}

