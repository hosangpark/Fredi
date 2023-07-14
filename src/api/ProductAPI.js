import Authorization from '../util/Authorization';
import API, { FileAPI } from './default';


export const UPDATEURL = 'https://fredi.co.kr/upload/'


/** Artwork */
export const APIRegisterProduct = async (data) => {
  const config = Authorization();
  const res = await FileAPI('/artwork', data, config);
  return res.data;
};
export const APIModifyProduct = async (data) => {
  const config = Authorization();
  const res = await FileAPI('/artwork', data, config, false);
  return res.data;
};

export const APIProductList = async (data) => {
  const config = Authorization();
  const res = await API.get('/artwork/list', { params: data, headers: config });
  return res.data;
};

export const APIProductListAdmin = async (data) => {
  const config = Authorization();
  const res = await API.get('/artwork/list-admin', { params: data, headers: config });
  return res.data;
};

export const APILikeProductList = async (data) => {
  const config = Authorization();
  const res = await API.get('/artwork/like', { params: data, headers: config });
  return res.data;
};

export const APIProductDetails = async (data) => {
  const config = Authorization();
  const res = await API.get('/artwork/details', { params: data, headers: config });
  return res.data;
};

export const APILikeProduct = async (data) => {
  const config = Authorization();
  const res = await API.post('/artwork/like', data, { headers: config });
  return res.data;
};

export const APIDeleteProduct = async (data) => {
  const config = Authorization();
  const res = await API.delete('/artwork', { params: data, headers: config });
  return res.data;
};

/** Fair */
export const APIFairList = async (data) => {
  const config = Authorization();
  const res = await API.get('/fair/list', { params: data, headers: config });
  return res.data;
};
export const APIFairDetails = async (data) => {
  const config = Authorization();
  const res = await API.get('/fair/details', { params: data, headers: config });
  return res.data;
};

/** Artist */
export const APIArtistList = async (data) => {
  const config = Authorization();
  const res = await API.get('/user/designer-list', { params: data, headers: config });
  return res.data;
};

export const APIArtistFollowingList = async (data) => {
  const config = Authorization();
  const res = await API.get('/user/like', { params: data, headers: config });
  return res.data;
};

export const APIArtistFollowAdd = async (data) => {
  const config = Authorization();
  const res = await API.post('/user/like', { params: data, headers: config });
  return res.data;
};
