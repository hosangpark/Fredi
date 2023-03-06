import axios from 'axios';

// const host = 'http://192.168.0.155:4000';
const host = 'https://fredi.co.kr';


const API = axios.create({
  baseURL: `${host}/api`,
  // timeout: 5000,
  // timeoutErrorMessage: '요청 시간 초과',
  headers: { 'Content-Type': 'application/json' },
});

export const FileAPI = (uri, data, auth = { Authorization: '' }, isPost = true) =>
  isPost
    ? API.post(uri, data, { headers: { ...auth, 'Content-Type': 'multipart/form-data' } })
    : API.put(uri, data, { headers: { ...auth, 'Content-Type': 'multipart/form-data' } });

export default API;
