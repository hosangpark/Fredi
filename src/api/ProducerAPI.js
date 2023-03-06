import Authorization from '../util/Authorization';
import API, { FileAPI } from './default';

export const APIRegisterProducer = async (data) => {
  const config = Authorization();
  const res = await FileAPI('/producer', data, config);
  return res.data;
};
export const APIModifyProducer = async (data) => {
  const config = Authorization();
  const res = await FileAPI('/producer', data, config, false);
  return res.data;
};

export const APIProducerList = async (data) => {
  const config = Authorization();
  const res = await API.get('/producer/list', { params: data, headers: config });
  return res.data;
};

export const APIProducerListAdmin = async (data) => {
  const config = Authorization();
  const res = await API.get('/producer/list-admin', { params: data, headers: config });
  return res.data;
};

export const APILikeProducerList = async (data) => {
  const config = Authorization();
  const res = await API.get('/producer/like', { params: data, headers: config });
  return res.data;
};

export const APIProducerDetails = async (data) => {
  const config = Authorization();
  const res = await API.get('/producer/details', { params: data, headers: config });
  return res.data;
};

export const APILikeProducer = async (data) => {
  const config = Authorization();
  const res = await API.post('/producer/like', data, { headers: config });
  return res.data;
};

export const APIDeleteProducer = async (data) => {
  const config = Authorization();
  const res = await API.delete('/producer', { params: data, headers: config });
  return res.data;
};
