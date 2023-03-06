import Authorization from '../util/Authorization';
import API from './default';

export const APIRegisterAsk = async (data) => {
  const config = Authorization();
  const res = await API.post('/ask', data, { headers: config });
  return res.data;
};

export const APIModifyAsk = async (data) => {
  const config = Authorization();
  const res = await API.put('/ask', data, { headers: config });
  return res.data;
};

export const APIAnswerAsk = async (data) => {
  const config = Authorization();
  const res = await API.put('/ask/answer', data, { headers: config });
  return res.data;
};

export const APIStoreAsk = async (data) => {
  const config = Authorization();
  const res = await API.put('ask/store', data, { headers: config });
  return res.data;
};

export const APIAskList = async (data) => {
  const config = Authorization();
  const res = await API.get('/ask/list', { params: data, headers: config });
  return res.data;
};

export const APIStoredAskList = async (data) => {
  const config = Authorization();
  const res = await API.get('/ask/list-stored', { params: data, headers: config });
  return res.data;
};

export const APIAskListAdmin = async (data) => {
  const config = Authorization();
  const res = await API.get('/ask/list-admin', { params: data, headers: config });
  return res.data;
};

export const APIAskDetails = async (data) => {
  const config = Authorization();
  const res = await API.get('/ask/details', { params: data, headers: config });
  return res.data;
};

export const APIDeleteAsk = async (data) => {
  const config = Authorization();
  const res = await API.delete('/ask', { params: data, headers: config });
  return res.data;
};

export const APIRegisterShopAsk = async (data) => {
  const config = Authorization();
  const res = await API.post('/ask/shop', data, { headers: config });
  return res.data;
};

export const APIShopAskList = async (data) => {
  const config = Authorization();
  const res = await API.get('/ask/shop/list', { params: data, headers: config });
  return res.data;
};

export const APIDeleteShopAsk = async (data) => {
  const config = Authorization();
  const res = await API.delete('/ask/shop', { params: data, headers: config });
  return res.data;
};
