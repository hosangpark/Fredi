import React, { useContext } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import AskInfo from './page/contact/AskInfo';
import AskList from './page/contact/AskList';
import DashBoard from './page/admin/DashBoard';
import FaqList from './page/contact/FaqList';
import FaqListAdmin from './page/admin/FaqListAdmin';
import FindPassword from './page/user/FindPassword';
import FindUserId from './page/user/FindUserId';
import Home from './page/product/Home';
import Producer from './page/producer/Producer';
import Profile from './page/user/Profile';
import MobileProfile from './page/user/MobileProfile';
import EditProfile from './page/user/EditProfile';
import AddLink from './page/user/AddLink';
import EditLink from './page/user/EditLink';
import AddPhoto from './page/user/AddPhoto';
import RegisterAsk from './page/contact/RegisterAsk';
import RegisterFaq from './page/admin/RegisterFaq';
import RegisterProduct from './page/admin/RegisterProduct';
import SettingCompanyInfo from './page/admin/SettingCompanyInfo';
import SettingTerms from './page/admin/SettingTerms';
import SignIn from './page/user/SignIn';
import UserDetails from './page/admin/UserDetails';
import UserList from './page/admin/UserList';
import Admin from './page/admin/Admin';
import Contact from './page/contact/Contact';
import AskListAdmin from './page/admin/AskListAdmin';
import ProductList from './page/admin/ProductList';
import ProducerList from './page/admin/ProducerList';
import RegisterProducer from './page/admin/RegisterProducer';
import ModifyUserInfo from './page/user/ModifyUserInfo';
import StoredAskList from './page/admin/StoredAskList';
import SignUpKakao from './page/user/SignUpKaKao';
import SignUpNaver from './page/user/SignUpNaver';
import SettingBanner from './page/admin/SettingBanner';
import { UserContext } from './context/user';
import { APIUserDetails } from './api/UserAPI';
import { useLayoutEffect } from 'react';
import Request from './page/user/Request';
import Privacy from './page/user/Privacy';
import RegisterShopAsk from './page/contact/RegisterShopAsk';

import FairContent from './page/MainTab/FairContent';
import PersonalPage from './page/user/PersonalPage';
import ArtistProducts from './page/MainTab/ArtistProducts';
import WeeklyEdition from './page/product/WeeklyEdition';
import FairTab from './page/MainTab/FairTab';
import ArtworkTab from './page/MainTab/ArtworkTab';
import ArtistTab from './page/MainTab/ArtistTab';
import ProductDetails from './page/product/ProductDetails';
import ChangePassword from './page/user/ChangePassword';
import ChangePhone from './page/user/ChangePhone';
import LikeSns from './page/LikeFeed/LikeSns';
import LikeArtwork from './page/LikeFeed/LikeArtwork';
import FeedTab from './page/community/FeedTab';
import FollowTab from './page/community/FollowTab';
import BookMarkTab from './page/community/BookMarkTab';
import SignUp1 from './page/user/SignUp1';
import SignUp2 from './page/user/SignUp2';
import SignUp3 from './page/user/SignUp3';


function Router() {
  const { patchUser } = useContext(UserContext);
  const token = sessionStorage.getItem('token');
  const getUserInfo = async () => {
    if(token){
      const result = await APIUserDetails();
      patchUser(result.idx, result.level);
    }
  };
  
  useLayoutEffect(() => {
    getUserInfo();
  }, []);

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* '작품보기' 메인 페이지 */}
          <Route path="" element={<Home />} />
          {/* 로그인 페이지 */}
          <Route path="/signin" element={<SignIn />} />
          {/* 회원가입 페이지 */}
          <Route path="/signup1" element={<SignUp1 />} />
          <Route path="/signup2" element={<SignUp2 />} />
          <Route path="/signup3" element={<SignUp3 />} />
          {/* 아이디 찾기 페이지 */}
          <Route path="/finduserid" element={<FindUserId />} />
          {/* 비밀번호 찾기 페이지 */}
          <Route path="/findpassword" element={<FindPassword />} />
          {/* 'producing' 메인 페이지 */}
          <Route path="/producer" element={<Producer />} />
          {/* 'product' 상세 페이지 */}
          <Route path="/productdetails/:idx" element={<ProductDetails />} />
          {/* 장바구니 페이지 */}
          <Route path="/personalpage/:name" element={<PersonalPage/>} />
          {/* '마이페이지' 메인 페이지 */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/MobileProfile/:idx" element={<MobileProfile />} />
          <Route path="/EditProfile/:value" element={<EditProfile />} />
          <Route path="/AddLink" element={<AddLink />} />
          <Route path="/EditLink" element={<EditLink />} />
          <Route path="/AddPhoto" element={<AddPhoto />} />
          {/* 주문상세 페이지 */}
          <Route path="/MainTab/*">
            <Route path="FairTab" element={<FairTab />}/>
            <Route path="ArtworkTab" element={<ArtworkTab />}/>
            <Route path="ArtistTab" element={<ArtistTab />}/>
          </Route>
          <Route path="/ArtistProducts/:name" element={<ArtistProducts />}/>

          <Route path="/WeeklyEdition/:idx" element={<WeeklyEdition />}/>
          {/* <Route path="Artwork" element={<Artwork />} />
          <Route path="Artist" element={<Artist />} /> */}
          <Route path="/FairContent/:idx" element={<FairContent />} />

          {/* 개인정보 수정 페이지 */}
          <Route path="/modifyuserinfo" element={<ModifyUserInfo />} />
          {/* 개인정보 수정 페이지 */}
          <Route path="/changePassword" element={<ChangePassword />} />
          {/* 개인정보 수정 페이지 */}
          <Route path="/changePhone" element={<ChangePhone />} />
          {/* 카카오 회원가입 페이지 */}
          <Route path="/SignUpKakao" element={<SignUpKakao />} />
          {/* 네이버 회원가입 페이지 */}
          <Route path="/SignUpNaver" element={<SignUpNaver />} />
          {/* '고객센터' 라우터 */}
          <Route path="/contact" element={<Contact />}/>
            {/* '고객센터' - 1:1문의 페이지 */}
          <Route path="asklist" element={<AskList />} />
          {/* '고객센터' - 1:1문의 등록 페이지 */}
          <Route path="registerask" element={<RegisterAsk />} />
          {/* '고객센터' - 1:1문의 수정 페이지 */}
          <Route path="registerask/:idx" element={<RegisterAsk />} />
          {/* '고객센터' - 입점문의 페이지 */}
          <Route path="askinfo" element={<AskInfo />} />
          {/* '고객센터' - FAQ 페이지 */}
          <Route path="faqlist" element={<FaqList />} />


          {/* '고객센터' - shop 1:1문의 등록 페이지 */}
          <Route path="registerask-shop" element={<RegisterShopAsk />} />
          <Route path="/community/FeedTab" element={<FeedTab />}/>
          <Route path="/community/FollowTab" element={<FollowTab />}/>
          <Route path="/community/BookMarkTab" element={<BookMarkTab />}/>
          <Route path="/LikeSns" element={<LikeSns />}/>
          <Route path="/LikeArtwork" element={<LikeArtwork />}/>
          {/* 'manager' 라우터 */}
          <Route path="/admin/*" element={<Admin />}>
            {/* 'manager' - 메인 페이지 */}
            <Route index element={<DashBoard />} />
            {/* 'manager' - 약관 관리 페이지 */}
            <Route path="settingterms" element={<SettingTerms />} />
            {/* 'manager' - 회원 관리 페이지 */}
            <Route path="userlist" element={<UserList />} />
            {/* 'manager' - 회사 정보 관리 페이지 */}
            <Route path="settingcompanyinfo" element={<SettingCompanyInfo />} />
            {/* 'manager' - 회원 상세 페이지 */}
            <Route path="userdetails/:idx" element={<UserDetails />} />
            {/* 'manager' - FAQ 관리 페이지 */}
            <Route path="faqlist" element={<FaqListAdmin />} />
            {/* 'manager' - FAQ 등록 페이지 */}
            <Route path="registerfaq" element={<RegisterFaq />} />
            {/* 'manager' - designer product 등록 페이지 */}
            <Route path="registerproduct" element={<RegisterProduct />} />
            {/* 'manager' - designer product 수정 페이지 */}
            <Route path="product/:idx" element={<RegisterProduct />} />
            {/* 'manager' - producing 등록 페이지 */}
            <Route path="registerproducer" element={<RegisterProducer />} />
            {/* 'manager' - producing 수정 페이지 */}
            <Route path="producer/:idx" element={<RegisterProducer />} />
            {/* 'manager' - 문의글 답변 등록 페이지(문의글 목록) */}
            <Route path="asklist" element={<AskListAdmin />} />
            {/* 'manager' - 보관된 문의골 페이지 */}
            <Route path="asklist-stored" element={<StoredAskList />} />
            {/* 'manager' - Designer Product 관리 페이지 */}
            <Route path="productlist" element={<ProductList />} />
            {/* 'manager' - Producing 관리 페이지 */}
            <Route path="producerlist" element={<ProducerList />} />
            {/* 'manager' - Designer Product 배너 관리 페이지 */}
            <Route path="settingbanner" element={<SettingBanner />} />
          </Route>

          {/* 앱 심사를 위한 페이지 - 사용하지 않음 */}
          <Route path="privacy" element={<Privacy />} />

          {/* 페이지가 없을 때 */}
          <Route
            path="*"
            element={
              <main style={{ padding: '1rem' }}>
                <p>No Page</p>
              </main>
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default Router;
