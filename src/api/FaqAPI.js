import Authorization from '../util/Authorization';
import API from './default';

export const APIRegisterFaq = async (data) => {
  const config = Authorization();
  const res = await API.post('/faq', data, { headers: config });
  return res.data;
};

export const APIFaqList = async (data) => {
  const res = await API.get('/faq/list', { params: data });
  return res.data;
};

export const APIDeleteFaq = async (data) => {
  const config = Authorization();
  const res = await API.delete('/faq', { params: data, headers: config });
  return res.data;
};

// export const APIDeleteFaq = async (data) => {
//   try {
//     const config = Authorization();
//     const res = await API.delete('/faq', { params: data, headers: config });
//     return res.data;
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       if (error.response.status === 401) {
//         if (error.response.data.message === 'expired') {
//           /*리프레시 토큰 + 액세트 토큰 보내서 다시 새로운 액세스 토큰을 발급받는 API함수 */
//           /* APIReAccessToken(callback) */
//         }
//       }
//     }
//   }
// };
