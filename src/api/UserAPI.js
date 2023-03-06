import Authorization from '../util/Authorization';
import API from './default';

export const APISignUp = async (data) => {
  const res = await API.post('/user/account', data);
  return res.data;
};
export const APIFindUserId = async (data) => {
  const res = await API.post('/user/auth-send-find-userId', data);
  return res.data;
};

export const APIFindPassword = async (data) => {
  const res = await API.post('/user/auth-send-find-password', data);
  return res.data;
};

export const APIModifyPassword = async (data) => {
  const config = Authorization();
  const res = await API.put('/user/password', data, { headers: config });
  return res.data;
};

export const APIResetPassword = async (data) => {
  const res = await API.put('/user/reset-password', data);
  return res.data;
};

export const APICheckUserId = async (data) => {
  const res = await API.post('/user/check-userId', data);
  return res.data;
};

export const APICheckNickname = async (data) => {
  const res = await API.post('/user/check-nickname', data);
  return res.data;
};

export const checkNicknameExcludeUser = async (data) => {
  const config = Authorization();
  const res = await API.post('/user/check-nickname-exclude', data, { headers: config });
  return res.data;
};

export const APISendAuthNumber = async (data) => {
  const res = await API.post('/user/auth-send', data);
  return res.data;
};

export const APISignIn = async (data) => {
  const res = await API.post('/user/sign-in', data);
  return res.data;
};

export const APISignInUsingSns = async (data) => {
  const res = await API.post('/user/sign-in-sns', data);
  return res.data;
};

export const APIUserDetails = async (data) => {
  const config = Authorization();
  const res = await API.get('/user/details', { params: data, headers: config });
  return res.data;
};

export const APIModifyUserDetails = async (data) => {
  const config = Authorization();
  const res = await API.put('/user/profile', data, { headers: config });
  return res.data;
};

export const APICheckPassword = async (data) => {
  const config = Authorization();
  const res = await API.post('/user/check-password', data, { headers: config });
  return res.data;
};

export const APIDeleteAccount = async (data) => {
  const config = Authorization();
  const res = await API.post('/user/account-delete', data, { headers: config });
  return res.data;
};

export const APIDeleteAccountAdmin = async (data) => {
  const config = Authorization();
  const res = await API.delete('/user/account-admin', { params: data, headers: config });
  return res.data;
};

export const APIUserList = async (data) => {
  const config = Authorization();
  const res = await API.get('/user/list', { params: data, headers: config });
  return res.data;
};

export const APIModifyUserDetailsAdmin = async (data) => {
  const config = Authorization();
  const res = await API.put('/user/profile-admin', data, { headers: config });
  return res.data;
};

export const APIVerifyAuthNumber = async (data) => {
  const res = await API.post('/user/auth', data);
  return res.data;
};
