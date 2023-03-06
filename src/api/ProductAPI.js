import Authorization from '../util/Authorization';
import API, { FileAPI } from './default';

export const APIRegisterProduct = async (data) => {
  const config = Authorization();
  const res = await FileAPI('/product', data, config);
  return res.data;
};
export const APIModifyProduct = async (data) => {
  const config = Authorization();
  const res = await FileAPI('/product', data, config, false);
  return res.data;
};

export const APIProductList = async (data) => {
  const config = Authorization();
  const res = await API.get('/product/list', { params: data, headers: config });
  return res.data;
};

export const APIProductListAdmin = async (data) => {
  const config = Authorization();
  const res = await API.get('/product/list-admin', { params: data, headers: config });
  return res.data;
};

export const APILikeProductList = async (data) => {
  const config = Authorization();
  const res = await API.get('/product/like', { params: data, headers: config });
  return res.data;
};

export const APIProductDetails = async (data) => {
  const config = Authorization();
  const res = await API.get('/product/details', { params: data, headers: config });
  return res.data;
};

export const APILikeProduct = async (data) => {
  const config = Authorization();
  const res = await API.post('/product/like', data, { headers: config });
  return res.data;
};

export const APIDeleteProduct = async (data) => {
  const config = Authorization();
  const res = await API.delete('/product', { params: data, headers: config });
  return res.data;
};
