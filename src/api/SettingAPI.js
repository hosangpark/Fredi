import Authorization from '../util/Authorization';
import API, { FileAPI } from './default';

export const APICompanyInfo = async () => {
  const res = await API.get('/setting/company');
  return res.data;
};

export const APIGetTerms = async (data) => {
  const res = await API.get('/setting/terms', { params: data });
  return res.data;
};

export const APIGetBanner = async (data) => {
  const res = await API.get('/setting/banner', { params: data });
  return res.data;
};

export const APIDeleteBanner = async (data) => {
  const config = Authorization();
  const res = await API.delete('/setting/banner', { params: data , headers: config});
  return res.data;
};

export const APIModifyTerms = async (data) => {
  const config = Authorization();
  const res = await API.put('/setting/terms', data, { headers: config });
  return res.data;
};

export const APIModifyCompanyInfo = async (data) => {
  const config = Authorization();
  const res = await API.put('/setting/company', data, { headers: config });
  return res.data;
};

export const APIRegisterBanner = async (data) => {
  console.log('data', data);
  const config = Authorization();
  const res = await FileAPI('/setting/banner', data, config);
  return res.data;
};

export const APIDashboard = async (data) => {
  const config = Authorization();
  const res = await API.get('/setting/dashboard', { params: data, headers: config });
  return res.data;
};

export const APIDashboardProductList = async (data) => {
  const config = Authorization();
  const res = await API.get('/setting/dashboard-product', { params: data, headers: config });
  return res.data;
};

export const APIDashboardProducerList = async (data) => {
  const config = Authorization();
  const res = await API.get('/setting/dashboard-producer', { params: data, headers: config });
  return res.data;
};

export const APICheckNew = async () => {
  const res = await API.get('/setting/new');
  return res.data;
};

export const APISelling = async (data) => {
  const config = Authorization();
  const res = await API.post('/selling', { params: data, headers: config,'Content-Type': 'multipart/form-data' });
  return res.data;
};