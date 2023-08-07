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

export const APILinkMyAccount = async (data) => {
  const config = Authorization();
  const res = await API.post('/artwork/link', data, { headers: config });
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
  const res = await API.get('/artwork/designer-list', { params: data, headers: config });
  return res.data;
};

export const APIArtistFollowingList = async (data) => {
  const config = Authorization();
  const res = await API.get('/user/like', { params: data, headers: config });
  return res.data;
};

export const APIArtistFollowAdd = async (data) => {
  const config = Authorization();
  const res = await API.post('/user/like', data, {headers: config });
  return res.data;
};

/** SNS */
export const APISnsAdd = async (data) => {
  const config = Authorization();
  // const res = await API.post('/sns', { params: data, headers: config,'Content-Type': 'multipart/form-data' });
  const res = await FileAPI('/sns', data, config, true);
  return res.data;
};
export const APISnsModify = async (data) => {
  const config = Authorization();
  const res = await FileAPI('/sns', data, config, false);
  return res.data;
};

export const APISnsList = async (data) => {
  const config = Authorization();
  const res = await API.get('/sns/list', { params: data, headers: config });
  return res.data;
};

export const APISnsCount = async (data) => {
  const config = Authorization();
  const res = await API.get('/sns/count', { params: data, headers: config });
  return res.data;
};

export const APISnsDetails = async (data) => {
  const config = Authorization();
  const res = await API.get('/sns/details', { params: data, headers: config });
  return res.data;
};

export const APISnsLike = async (data) => {
  const config = Authorization();
  const res = await API.post('/sns/like', data, {headers: config });
  return res.data;
};

export const APISnsLikeList = async (data) => {
  const config = Authorization();
  const res = await API.get('/sns/like', { params: data, headers: config });
  return res.data;
};

export const APIBookMarkLike = async (data) => {
  const config = Authorization();
  const res = await API.post('/sns/bookmark', data, {headers: config });
  return res.data;
};

export const APIBookMarkLikeList = async (data) => {
  const config = Authorization();
  const res = await API.get('/sns/bookmark', { params: data, headers: config });
  return res.data;
};

export const APIFollowersProductList = async (data) => {
  const config = Authorization();
  const res = await API.get('/user/like-designer-sns', { params: data, headers: config });
  return res.data;
};

export const APICategoryList = async (data) => {
  const config = Authorization();
  const res = await API.get('/category/list', { params: data, headers: config });
  return res.data;
};
