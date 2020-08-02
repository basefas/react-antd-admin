export function getToken() {
  return localStorage.getItem('token')
}

export function setToken(token) {
  localStorage.setItem('token', token)
}

export function loggedIn() {
  return !!localStorage.getItem('token');
}

export function deleteToken() {
  localStorage.removeItem('token')
  localStorage.removeItem('username')
}

export function getCurrentUser() {
  return localStorage.getItem('username')
}

export function setCurrentUser(username) {
  localStorage.setItem('username', username)
}
