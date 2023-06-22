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

import PrevProductDetails from './page/product/PrevProductDetails';
import Profile from './page/user/Profile';
import MobileProfile from './page/user/MobileProfile';
import EditProfile from './page/user/EditProfile';
import AddLink from './page/user/AddLink';
import EditLink from './page/user/EditLink';
import AddPhoto from './page/user/AddPhoto';
import AddPhoto2 from './page/user/AddPhoto2';
import RegisterAsk from './page/contact/RegisterAsk';
import RegisterFaq from './page/admin/RegisterFaq';
import RegisterProduct from './page/admin/RegisterProduct';
import SettingCompanyInfo from './page/admin/SettingCompanyInfo';
import SettingTerms from './page/admin/SettingTerms';
import SignIn from './page/user/SignIn';
import SignUp from './page/user/SignUp';
import UserDetails from './page/admin/UserDetails';
import UserList from './page/admin/UserList';
import Admin from './page/admin/Admin';
import Contact from './page/contact/Contact';
import LikeList from './page/user/LikeList';
import AskListAdmin from './page/admin/AskListAdmin';
import ProductList from './page/admin/ProductList';
import ProducerList from './page/admin/ProducerList';
import RegisterProducer from './page/admin/RegisterProducer';
import ModifyUserInfo from './page/user/ModifyUserInfo';
import StoredAskList from './page/admin/StoredAskList';
import Kakao from './page/user/Kakao';
import Naver from './page/user/Naver';
import SettingBanner from './page/admin/SettingBanner';
import { UserContext } from './context/user';
import { APIUserDetails } from './api/UserAPI';
import { useLayoutEffect } from 'react';
import Shop from './page/shop/Shop';
import Cart from './page/shop/Cart';
import Order from './page/shop/Order';
import OrderList from './page/user/OrderList';
import OrderDetails from './page/user/OrderDetails';
import Request from './page/user/Request';
import OrderCompleted from './page/shop/OrderCompleted';
import Payment from './page/shop/Payment';
import OrderCompletedMobile from './page/shop/OrderCompletedMobile';
import Privacy from './page/user/Privacy';
import RegisterShopAsk from './page/contact/RegisterShopAsk';
import ShopAskList from './page/user/ShopAskList';

import MainTab from './page/MainTab/MainTab';
import FairContent from './page/MainTab/FairContent';
import PersonalPage from './page/user/PersonalPage';
import Community from './page/community/Community';
import LikeTab from './page/LikeFeed/LikeTab';
import ArtistProducts from './page/MainTab/ArtistProducts';
import WeeklyEdition from './page/product/WeeklyEdition';
import Fair from './page/MainTab/Fair';
import Artwork from './page/MainTab/Artwork';
import Artist from './page/MainTab/Artist';
import ProducerDetails from './page/producer/ProducerDetails';
import ProductDetails from './page/product/ProductDetails';
import ChangePassword from './page/user/ChangePassword';
import ChangePhone from './page/user/ChangePhone';
import ChangeAddress from './page/user/ChangeAddress';
import DeleteAccount from './page/user/DeleteAccount';


function Router() {
  const { patchUser } = useContext(UserContext);

  const getUserInfo = async () => {
    const result = await APIUserDetails();
    patchUser(result.idx, result.level);
  };

  useLayoutEffect(() => {
    getUserInfo();
  }, []);

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* '작품보기' 메인 페이지 */}
          <Route path="/" element={<Home />} />
          {/* 로그인 페이지 */}
          <Route path="/signin" element={<SignIn />} />
          {/* 회원가입 페이지 */}
          <Route path="/signup" element={<SignUp />} />
          {/* 아이디 찾기 페이지 */}
          <Route path="/finduserid" element={<FindUserId />} />
          {/* 비밀번호 찾기 페이지 */}
          <Route path="/findpassword" element={<FindPassword />} />
          {/* '작품보기' 상세 페이지 */}
          <Route path="/prevproductdetails/:idx" element={<PrevProductDetails />} />
          {/* 'producing' 메인 페이지 */}
          <Route path="/producer" element={<Producer />} />
          {/* 'producing' 상세 페이지 */}
          <Route path="/producerdetails/:idx" element={<ProducerDetails/>} />
          {/* 'shop' 메인 페이지 */}
          <Route path="/shop" element={<Shop />} />
          {/* 'shop' 상세 페이지 */}
          <Route path="/productdetails/:idx" element={<ProductDetails />} />
          {/* 장바구니 페이지 */}
          <Route path="/personalpage/:name" element={<PersonalPage/>} />
          {/* 장바구니 페이지 */}
          <Route path="/cart" element={<Cart />} />
          {/* 주문하기 페이지 */}
          <Route path="/order" element={<Order />} />
          {/* 결제 페이지 */}
          <Route path="/payment" element={<Payment />} />
          {/* 결제완료 페이지 */}
          <Route path="/ordercompleted" element={<OrderCompleted />} />
          {/* 결제완료 페이지 - 모바일용 */}
          <Route path="/ordercompleted-mobile" element={<OrderCompletedMobile />} />
          {/* '마이페이지' 메인 페이지 */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/MobileProfile" element={<MobileProfile />} />
          <Route path="/EditProfile" element={<EditProfile />} />
          <Route path="/AddLink" element={<AddLink />} />
          <Route path="/EditLink" element={<EditLink />} />
          <Route path="/AddPhoto" element={<AddPhoto />} />
          <Route path="/AddPhoto2" element={<AddPhoto2 />} />
          {/* 주문내역 페이지 */}
          <Route path="/orderlist" element={<OrderList />} />
          {/* 주문상세 페이지 */}

          <Route path="/MainTab" element={<MainTab />}/>
          <Route path="/Fair" element={<Fair />}/>
          <Route path="/Artwork" element={<Artwork />}/>
          <Route path="/Artist" element={<Artist />}/>

          <Route path="/ArtistProducts/:name" element={<ArtistProducts />}/>

          <Route path="/WeeklyEdition" element={<WeeklyEdition />}/>
          {/* <Route path="Artwork" element={<Artwork />} />
          <Route path="Artist" element={<Artist />} /> */}
          <Route path="/FairContent/:idx" element={<FairContent />} />

          <Route path="/orderdetails/:idx" element={<OrderDetails />} />
          {/* 주문취소/반품요청/교환요청 페이지 */}
          <Route path="/request/:type/:idx" element={<Request />} />
          {/* 개인정보 수정 페이지 */}
          <Route path="/modifyuserinfo" element={<ModifyUserInfo />} />
          {/* 개인정보 수정 페이지 */}
          <Route path="/changePassword" element={<ChangePassword />} />
          {/* 개인정보 수정 페이지 */}
          <Route path="/changePhone" element={<ChangePhone />} />
          {/* 개인정보 수정 페이지 */}
          <Route path="/changeAddress" element={<ChangeAddress />} />
          {/* 개인정보 수정 페이지 */}
          <Route path="/deleteAccount" element={<DeleteAccount />} />
          {/* 찜한상품 페이지 */}
          <Route path="/likelist" element={<LikeList />} />
          {/* 카카오 회원가입 페이지 */}
          <Route path="/kakao" element={<Kakao />} />
          {/* 네이버 회원가입 페이지 */}
          <Route path="/naver" element={<Naver />} />
          {/* 상품문의내역 페이지 */}
          <Route index path="/asklist-shop" element={<ShopAskList />} />
          {/* '고객센터' 라우터 */}
          <Route path="/contact/*" element={<Contact />}>
            {/* '고객센터' - 1:1문의 페이지 */}
            <Route index path="asklist" element={<AskList />} />
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
          </Route>
          <Route path="/community/*" element={<Community />}/>
          <Route path="/LikeTab" element={<LikeTab />}/>
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
