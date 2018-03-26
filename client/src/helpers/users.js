import jwtDecode from 'jwt-decode';

export const getUser = () => JSON.parse(localStorage.getItem('pomtrackerDemoUser'));
export const getJWT= () => localStorage.getItem('pomtrackerJWT');
export const setUser = user => localStorage.setItem('pomtrackerDemoUser', JSON.stringify(user));
export const setJWT = jwt => localStorage.setItem('pomtrackerJWT', jwt);
export const clearUser = () => localStorage.removeItem('pomtrackerDemoUser');
export const clearJWT = () => localStorage.removeItem('pomtrackerJWT');
export const doesUserExist = () => Boolean(getUser());

export const isJWTExpired = jwt => {
  const jwtExp = jwtDecode(jwt).exp;
  const now = new Date() / 1000;

  return now > jwtExp;
}

const postJSON = (url, data) => {
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const refreshJWT = (refreshURL) => {

}

export const getJWTAuthHeader = jwt => ({
  'Authorization': 'Bearer ' + jwt,
});
