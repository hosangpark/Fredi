import Authorization from '../util/Authorization';
import API from './default';

export const APIWeeklyList = async (data) => {
  const config = Authorization();
  const res = await API.get('/weekly/list', { params: data, headers: config });
  return res.data;
};
export const APIWeeklyDetails = async (data) => {
  const config = Authorization();
  const res = await API.get('/weekly/list-details', { params: data, headers: config });
  return res.data;
};

export const APITrendingArtist = async (data) => {
  const config = Authorization();
  const res = await API.get('/user/designer-tranding-list', { params: data, headers: config });
  return res.data;
}
export const APIFeaturedWorksList = async (data) => {
  const config = Authorization();
  const res = await API.get('/sns/list-featured', { params: data, headers: config });
  return res.data;
}