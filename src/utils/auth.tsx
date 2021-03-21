export function getToken() {
  return localStorage.getItem('token')
}

export function setToken(token: string) {
  localStorage.setItem('token', token)
}

export function loggedIn(): boolean {
  return !!localStorage.getItem('token');
}

export function deleteToken() {
  localStorage.removeItem('token')
  localStorage.removeItem('username')
}

export function getCurrentUser() {
  return localStorage.getItem('username')
}

export function setCurrentUser(username: string) {
  localStorage.setItem('username', username)
}
