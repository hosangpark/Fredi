import Authorization from '../util/Authorization';
import API from './default';

export const APIShopList = async (data) => {
  const config = Authorization();
  const res = await API.get('/shop/list', { params: data, headers: config });
  return res.data;
};

export const APILikeShopList = async (data) => {
  const config = Authorization();
  const res = await API.get('/shop/like', { params: data, headers: config });
  return res.data;
};

export const APIShopDetails = async (data) => {
  const config = Authorization();
  console.log('token'+JSON.stringify(config));
  const res = await API.get('/shop/details', { params: data, headers: config });
  return res.data;
};

export const APILikeShop = async (data) => {
  const config = Authorization();
  console.log('token'+JSON.stringify(config));
  const res = await API.post('/shop/like', data, { headers: config });
  return res.data;
};

export const APIAddCartItem = async (data) => {
  const config = Authorization();
  const res = await API.post('/shop/cart', data, { headers: config });
  return res.data;
};

export const APIGetCartList = async (data) => {
  const config = Authorization();
  const res = await API.get('/shop/cart', { params: data, headers: config });
  return res.data;
};

export const APIChangeCartItemAmount = async (data) => {
  const config = Authorization();
  const res = await API.put('/shop/cart', data, { headers: config });
  return res.data;
};

export const APIDeleteCartItem = async (data) => {
  const config = Authorization();
  const res = await API.post('/shop/dcart', data, { headers: config });
  return res.data;
};

export const APIOrder = async (data) => {
  const config = Authorization();
  const res = await API.post('/order', data, { headers: config });
  return res.data;
};

export const APIRecordOrder = async (data) => {
  const config = Authorization();
  const res = await API.post('/order/memorize', data, { headers: config });
  return res.data;
};

export const APIOrderMobile = async (data) => {
  const config = Authorization();
  const res = await API.post('/order/mobile', data, { headers: config });
  return res.data;
};

export const APIOrderList = async (data) => {
  const config = Authorization();
  const res = await API.get('/order', { params: data, headers: config });
  return res.data;
};

export const APIOrderDetails = async (data) => {
  const config = Authorization();
  const res = await API.get('/order/details', { params: data, headers: config });
  return res.data;
};

export const APIConfirm = async (data) => {
  const config = Authorization();
  const res = await API.post('/order/confirm', data, { headers: config });
  return res.data;
};

export const APICancel = async (data) => {
  const config = Authorization();
  const res = await API.post('/order/cancel', data, { headers: config });
  return res.data;
};

export const APIRefund = async (data) => {
  const config = Authorization();
  const res = await API.post('/order/refund-request', data, { headers: config });
  return res.data;
};

export const APIExchange = async (data) => {
  const config = Authorization();
  const res = await API.post('/order/exchange-request', data, { headers: config });
  return res.data;
};

export const APISaveAddress = async (data) => {
  const config = Authorization();
  const res = await API.post('/user/address', data, { headers: config });
  return res.data;
};

export const APICancelOrder = async (data) => {
  const config = Authorization();
  const res = await API.post('/order/cancels', data, { headers: config });
  return res.data;
};




