import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import CartCard from '../../components/Shop/CartCard';
import CheckBox from '../../components/Shop/CheckBox';
import PostModal from '../../components/Modal/PostModal';
import { replaceString } from '../../util/Price';
import { APIChangeCartItemAmount, APIDeleteCartItem, APIGetCartList, APISaveAddress } from '../../api/ShopAPI';
import { TImage, TProductListItem } from '../../types/Types';
import { checkArea2, checkArea3 } from '../../util/ExtraFeeArea';
import AlertModal from '../../components/Modal/AlertModal';


export type TCartItem = {
  idx: number;
  option: string;
  product_idx: number;
  name: string;
  designer: string;
  amount: number;
  price: number;
  delivery_fee: number;
  delivery_fee2: number;
  delivery_fee3: number;
  image: TImage[];
  selected: boolean;
};

export type deleteItem = {
  idx: number;
};

function Cart() {
  const navigate = useNavigate();

  const [checked, setChecked] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalDelivery, setTotalDelivery] = useState(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showSaveAddressModal, setShowSaveAddressModal] = useState<boolean>(false);

  const [showDeliveryInfoModal, setShowDeliveryInfoModal] = useState<boolean>(false);
  const [zipCode, setZipCode] = useState<string>('');
  const [address1, setAddress1] = useState<string>('');
  const [address2, setAddress2] = useState<string>('');
  const [recipient, setRecipient] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  const [isArea2, setIsArea2] = useState(false);
  const [isArea3, setIsArea3] = useState(false);

  const [cartList, setCartList] = useState<TCartItem[]>([]);

  const [selectedItem, setSelectedItem] = useState<TCartItem[]>(cartList.filter((item) => item.selected));
  const [allDelete, setAllDelete] = useState<any>([]);
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);

  const onAddress = (value: { address: string; zonecode: string }) => {
    console.log('zonecode', value.zonecode);
    console.log('address', value.address);
    setZipCode(value.zonecode);
    setAddress1(value.address);
  };

  const onCheckAll = () => {
    if (cartList.length > 0) {
      setChecked((prev) => {
        const newCartList = cartList.map((item) => ({
          ...item,
          selected: !prev,
        }));
        setCartList(newCartList);
        return !prev;
      });
    }
  };

  const onCheck = (idx: number) => {
    const newCartList = cartList.map((item) => (item.idx === idx ? { ...item, selected: !item.selected } : item));
    setCartList(newCartList);
  };

  const onFilter = () => {
    const found = cartList.filter((item) => item.selected);
    if (cartList.length === found.length) {
      setChecked(true);
    } else {
      setChecked(false);
    }
  };

  const getCartList = async () => {
    try {
      const res = await APIGetCartList();
      console.log('cartList', res);
      const resData = res.list;
      console.log('resData', resData.idx);
      const newList = resData.map((item: any) => ({
        ...item,
        selected: item.disabled ? false : true,
      }));
      const array = new Array();
      for(const key in Object.keys(newList)){
        console.log('newList[key]', newList[key].idx);
        array.push(newList[key].idx);
      }
      console.log('array',array);
      setAllDelete(array);
      // setCartList(newList);
      console.log('newList', newList);
      const addressData = res.address;
      setZipCode(addressData.zipcode);
      setAddress1(addressData.address1);
      setAddress2(addressData.address2);
      setRecipient(addressData.recipient);
      setPhone(addressData.hp);
    } catch (error) {
      console.log(error);
    }
  };

  const onDelete = async (idx: number) => {
    const index = allDelete.indexOf(idx);
    const array = allDelete;
    const data = {
      idx: [idx],
    };
    try {
      const res = await APIDeleteCartItem(data);
      console.log('delete', res.data);
      const newList = cartList.filter((item) => item.idx !== idx);
      setCartList(newList);
      if(index !== -1){
        array.splice(index, 1);
      }
      setAllDelete(array);
    } catch (error) {
      console.log(error);
    }
  };

  //전체삭제
  const onAllDelete = async () => {
    console.log('allDelete', allDelete);
    const data = {
      idx: allDelete,
    };
    try {
      const res = await APIDeleteCartItem(data);
      // console.log('delete', res.data);
      setCartList([]);
    } catch (error) {
      console.log(error);
    }
  };

  const onChangeAmount = async (idx: number, amount: number) => {
    console.log('amount', amount);
    const data = {
      idx: [idx],
      amount: amount,
    };
    try {
      const res = await APIChangeCartItemAmount(data);
      console.log('change amount', res);
      const newList = cartList.map((item) => (item.idx === idx ? { ...item, amount: amount } : item));
      setCartList(newList);
    } catch (error) {
      console.log(error);
    }
  };

  const onSaveAddress = async () => {
    const data = {
      zipcode: zipCode,
      address1: address1,
      address2: address2,
      recipient: recipient,
      hp: phone,
    };
    try {
      const res = await APISaveAddress(data);
      console.log(res);
      setShowSaveAddressModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  const onCheckArea = (zipCode: string) => {
    console.log('2권역 체크', checkArea2(Number(zipCode)));
    console.log('3권역 체크', checkArea3(Number(zipCode)));
    setIsArea2(checkArea2(Number(zipCode)));
    setIsArea3(checkArea3(Number(zipCode)));
  };

  useEffect(() => {
    getCartList();
    setCartList([
        {
          idx:1,
          selected:true,
          image:[
            {
            idx: 1,
            file_name: ''
            }
          ],
          option: '옵션',
          product_idx: 1,
          name: '이름',
          designer: '디자이너',
          amount: 1,
          price: 8000,
          delivery_fee: 100,
          delivery_fee2: 200,
          delivery_fee3: 300
        }
      ]);
  }, []);

  useEffect(() => {
    if (cartList.length > 0) {
      setSelectedItem(cartList.filter((item) => item.selected));
    } else if(cartList.length == 0){
      setSelectedItem([]);
      onFilter();
    }
  }, [cartList]);

  useEffect(() => {
    onCheckArea(zipCode);
  }, [zipCode]);

  useEffect(() => {
    const priceArr = selectedItem.length !== 0 ? selectedItem.map((item) => item.price * item.amount) : [0];
    const deliveryArr =
      selectedItem.length !== 0
        ? selectedItem.map((item) =>
            isArea2 ? item.delivery_fee + item.delivery_fee2 : isArea3 ? item.delivery_fee + item.delivery_fee3 : item.delivery_fee
          )
        : [0];
    const totalPrice = priceArr.reduce(function add(sum, price) {
      return sum + price;
    });
    const totalDelivery = deliveryArr.reduce(function add(sum, price) {
      return sum + price;
    });
    setTotalPrice(totalPrice);
    setTotalDelivery(totalDelivery);
  }, [selectedItem, isArea2, isArea3]);

  return (
    <Container>
      <LeftBox>
        <LeftTopBox>
          <Title>장바구니</Title>
        </LeftTopBox>
      </LeftBox>
      <RightBox>
        <CheckBoxWrap>
          <CheckBox checked={checked} onClick={onCheckAll} />
          <div onClick={onCheckAll} style={{marginRight: '1rem'}}>
            <CheckBoxText>{`전체선택(${selectedItem.length}/${cartList.length})`}</CheckBoxText>
          </div>
          <div style={{position: 'absolute', right: '1rem'}}>
          <DeleteAllButton onClick={onAllDelete}><DeleteText>전체삭제</DeleteText></DeleteAllButton>
          </div>
        </CheckBoxWrap>
        {cartList.length < 1 ? (
          <EmptyText>장바구니에 담은 상품이 없습니다.</EmptyText>
        ) : (
          <CartCardWrap>
            {cartList.map((item) => (
              <CartCard key={item.idx} cartItem={item} onCheck={onCheck} onChangeAmount={onChangeAmount} onDelete={onDelete} />
            ))}
          </CartCardWrap>
        )}
      </RightBox>
      <SideBox>
        <SideTopBox>
          <IconTitleWrap>
            <img src={require('../../asset/image/ico_pin.png')} style={{ width: 16 }} />
            <SideTopBoxTitle>배송지</SideTopBoxTitle>
            <SaveAddressButton onClick={onSaveAddress}>
              <SaveAddressButtonText>배송지 저장</SaveAddressButtonText>
            </SaveAddressButton>
          </IconTitleWrap>
          {zipCode && address1 && address2 ? (
            <SideTopBoxContent>
              ({zipCode}) {address1 + ' ' + address2}
            </SideTopBoxContent>
          ) : (
            <SideTopBoxContent>배송지를 입력해 주세요.</SideTopBoxContent>
          )}
          <DeliveryInfoButton onClick={() => setShowDeliveryInfoModal((prev) => !prev)}>
            <DeliveryInfoButtonText>{showDeliveryInfoModal ? '확인' : '배송지 변경'}</DeliveryInfoButtonText>
          </DeliveryInfoButton>
          {showDeliveryInfoModal && (
            <ModifyDeliveryInfoBox>
              <InputWrap>
                <SearchAddressInputWrap>
                  <TextInput value={zipCode} disabled placeholder="우편번호" style={{ backgroundColor: '#fff' }} />
                  <SearchButton onClick={() => setShowModal(true)}>
                    <SearchButtonText>검색</SearchButtonText>
                  </SearchButton>
                </SearchAddressInputWrap>
                <TextInput value={address1} onChange={(e) => setAddress1(e.target.value)} placeholder="주소를 검색해 주세요." />
                <TextInput value={address2} onChange={(e) => setAddress2(e.target.value)} placeholder="상세 주소 입력" />
              </InputWrap>
              <RecipientInputRowWrap>
                <RecipientInputLeftText>이름</RecipientInputLeftText>
                <RecipientInput value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="수령인 입력" />
              </RecipientInputRowWrap>
              <RecipientInputRowWrap last>
                <RecipientInputLeftText>휴대폰번호</RecipientInputLeftText>
                <RecipientInput
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value.replace(/[^0-9]/g, ''));
                  }}
                  placeholder="휴대폰 번호 입력"
                />
              </RecipientInputRowWrap>
            </ModifyDeliveryInfoBox>
          )}
        </SideTopBox>
        <SideBottomBox>
          <OrderInfoBox>
            <OrderInfoTopBox>
              <TextRowWrap>
                <LeftText>상품 금액</LeftText>
                <RightText>{replaceString(totalPrice)} 원</RightText>
              </TextRowWrap>
              <TextRowWrap>
                <LeftText>배송비</LeftText>
                <RightText>{replaceString(totalDelivery)} 원</RightText>
              </TextRowWrap>
            </OrderInfoTopBox>
            <OrderInfoBottomBox>
              <TextRowWrap>
                <LeftText>결제 예정 금액</LeftText>
                <RightText>{replaceString(totalPrice + totalDelivery)} 원</RightText>
              </TextRowWrap>
            </OrderInfoBottomBox>
          </OrderInfoBox>
          <OrderButtonWrap>
            <OrderButton
              disabled={selectedItem.length < 1 || !(zipCode && address1 && address2)}
              onClick={() => {
                if (selectedItem.length < 1) {
                  return;
                }
                if (!(zipCode && address1 && address2)) {
                  return setShowAlertModal(true);
                }
                navigate('/order', {
                  state: {
                    cartItem: selectedItem,
                    deliveryInfo: { zipCode, address1, address2, recipient, phone },
                    totalInfo: { totalPrice, totalDelivery },
                  },
                });
              }}
            >
              <OrderButtonText>주문하기</OrderButtonText>
            </OrderButton>
          </OrderButtonWrap>
          <NoticeBox>
            <NoticeText>·[결제완료, 입금대기] 상태일 경우에만 주문 취소 가능합니다.</NoticeText>
            <NoticeText>·[마이페이지 {'>'} 주문내역]에서 직접 취소하실 수 있습니다.</NoticeText>
          </NoticeBox>
        </SideBottomBox>
      </SideBox>
      <EmptyBox />
      <PostModal visible={showModal} setVisible={setShowModal} setAddress={onAddress} />
      <AlertModal
        visible={showAlertModal}
        setVisible={setShowAlertModal}
        onClick={() => {
          setShowAlertModal(false);
        }}
        text={'배송지를 입력해 주세요.'}
      />
      <AlertModal
        visible={showSaveAddressModal}
        setVisible={setShowSaveAddressModal}
        onClick={() => {
          setShowSaveAddressModal(false);
        }}
        text={'배송지가 저장되었습니다.'}
      />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex: 1;
  min-height: calc(100vh - 80px);
  flex-direction: row;
  border-top: 1px solid #121212;
  background-color: #ffffff;
  @media only screen and (max-width: 1100px) {
    flex-direction: column;
    border-top: 0;
  }
`;

const LeftBox = styled.div`
  display: flex;
  min-width: 290px;
  width: 400px;
  flex-direction: column;
  text-align: left;
  border-right: 1px solid #121212;
  padding: 0 20px;
  @media only screen and (max-width: 1100px) {
    width: 300px;
  }
  @media only screen and (max-width: 768px) {
    display: flex;
    width: 100%;
    /* border-bottom: 1px solid #121212; */
    border-right: 0;
  }
`;

const RightBox = styled.div`
  display: flex;
  flex: 1;
  min-width: 700px;
  flex-direction: column;
  @media only screen and (max-width: 1100px) {
    min-width: 300px;
  }
`;

const LeftTopBox = styled.div`
  width: 100%;
  padding:20px 0;
  @media only screen and (max-width: 768px) {
    
    border-bottom:1px solid #C9C9C9;
  }
`;

// const Title = styled.h3`
// font-family:'Pretendard Variable';
//   font-weight: 410;
//   color: #121212;
//   @media only screen and (max-width: 768px) {
//     font-size: 14px;
//   }
// `;
const Title = styled.h3`
font-family:'Pretendard Variable';
  font-weight: 700;
  color: #121212;
  font-size: 36px;
  @media only screen and (max-width: 1600px) {
    font-size: 32px;
  }
  @media only screen and (max-width: 1100px) {
    font-size: 22px;
  }
`;

const EmptyBox = styled.div`
  width: 280px;
  display: flex;
  border-left: 1px solid #121212;
`;

const SideBox = styled.div`
  width: 400px;
  display: flex;
  border-left: 1px solid #121212;
  flex-direction: column;
  text-align: left;
  @media only screen and (max-width: 1100px) {
    width: 100%;
    border-left: 0;
  }
`;

const CheckBoxWrap = styled.div`
  display: flex;
  position: relative;
  flex-direction: row;
  align-items: center;
  height: 70px;
  border-bottom: 1px solid #121212;
  padding: 0 20px;
  @media only screen and (max-width: 768px) {
    height: 40px;
    padding: 0 10px;
    border-bottom: 0px
  }
`;

const CheckBoxText = styled.span`
  font-family:'Pretendard Variable';
  font-size: 15px;
  margin-left: 7px;
  font-weight: 500;
  @media only screen and (max-width: 768px) {
    font-size: 13px;
  }
`;

const EmptyText = styled.span`
  font-family:'Pretendard Variable';
  font-size: 14px;
  color: #121212;
  margin: 130px 0 130px;
`;

const SideTopBox = styled.div`
  width: 100%;
  padding: 35px 30px;
  display: flex;
  flex-direction: column;
  @media only screen and (max-width: 1100px) {
    padding: 30px 18px;
  }
`;
const SideBottomBox = styled.div`
  width: 100%;
  
  padding: 30px;
  @media only screen and (max-width: 1100px) {
    padding: 0 18px 30px;
  }
`;

const IconTitleWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  @media only screen and (max-width: 768px) {
    border-top:2px solid #dfdfdf; 
    padding-top:20px
  }
`;

const SideTopBoxTitle = styled.span`
  font-family:'Pretendard Variable';
  font-weight: 600;
  color: #121212;
  font-size: 15px;
  margin-left: 5px;
  @media only screen and (max-width: 1100px) {
  }
  @media only screen and (max-width: 768px) {
    font-size: 14px;
  }
`;
const SideTopBoxContent = styled.span`
  font-family:'Pretendard Variable';
  font-weight: 410;
  color: #121212;
  font-size: 14px;
  margin: 15px 0 20px;
  @media only screen and (max-width: 1100px) {
  }
  @media only screen and (max-width: 768px) {
    font-size: 12px;
    margin: 5px 0 10px;
  }
`;

const OrderButton = styled.div<{ disabled: boolean }>`
  width: 100%;
  height: 50px;
  background-color: ${(props) => (props.disabled ? '#ccc' : '#398049')};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  @media only screen and (max-width: 1100px) {
  }
`;

const OrderButtonText = styled.span`
  font-family:'Pretendard Variable';
  font-size: 15px;
  font-weight: 500;
  color: #fff;
  @media only screen and (max-width: 1100px) {
  }
  @media only screen and (max-width: 768px) {
    font-size: 15px;
  }
`;

const DeliveryInfoButton = styled.div`
  width: 100%;
  height: 45px;
  background-color: #fff;
  border: 1px solid #121212;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  margin-top: 10px;
  cursor: pointer;
  @media only screen and (max-width: 1100px) {
  }
`;

const DeliveryInfoButtonText = styled.span`
  font-family:'Pretendard Variable';
  font-size: 14px;
  font-weight: 410;
  color: #121212;
  @media only screen and (max-width: 1100px) {
    font-size: 13px;
  }
`;

const OrderInfoBox = styled.div``;

const OrderInfoTopBox = styled.div`
  border-bottom: 2px solid #dfdfdf;
  border-Top: 2px solid #dfdfdf;
  padding: 10px 0;
  @media only screen and (max-width: 768px) {
    padding: 40px 0 20px;
  }
`;

const OrderInfoBottomBox = styled.div`
  padding: 20px 0;
`;

const TextRowWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 13px;
  @media only screen and (max-width: 768px) {
    margin-bottom: 10px;
  }
`;

const LeftText = styled.span`
  font-family:'Pretendard Variable';
  color: #121212;
  font-size: 16px;
  font-weight: 500;
  width: 200px;
  @media only screen and (max-width: 1100px) {
  }
  @media only screen and (max-width: 768px) {
    font-size: 14px;
  }
`;

const RightText = styled.span`
  font-family:'Pretendard Variable';
  font-weight: 600;
  font-size: 16px;
  @media only screen and (max-width: 1100px) {
  }
  @media only screen and (max-width: 768px) {
    font-size: 14px;
  }
`;

const NoticeBox = styled.div`
  margin-top: 40px;
`;

const NoticeText = styled.p`
  font-family:'Pretendard Variable';
  font-weight: 500;
  font-size: 13px;
  color: #666;
  margin: 0;
  @media only screen and (max-width: 768px) {
    font-size: 10px;
  }
`;

const OrderButtonWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`;

const CartCardWrap = styled.div``;

const InputWrap = styled.div<{ last?: boolean }>`
  margin-bottom: ${(props) => (props.last ? 0 : 30)}px;
`;

const TextInput = styled.input`
  width: 100%;
  height: 35px;
  padding: 10px;
  border: 0;
  border-radius: 0;
  border-bottom: 1px solid #121212;
  font-size: 14px;
  font-weight: 410;
  outline: 0;
  margin-bottom: 10px;
  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
`;

const SearchAddressInputWrap = styled.div`
  display: flex;
`;

const SearchButton = styled.div`
  width: 80px;
  height: 35px;
  background-color: #121212;
  margin-left: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  @media only screen and (max-width: 768px) {
  }
`;

const SearchButtonText = styled.span`
  font-weight: 410;
  color: #ffffff;
  font-size: 12px;
  @media only screen and (max-width: 768px) {
    font-size: 11px;
  }
`;

const ModifyDeliveryInfoBox = styled.div`
  padding: 30px 0 0;
  @media only screen and (max-width: 768px) {
    padding: 25px 0 0;
  }
`;

const SaveAddressButton = styled(SearchButton)`
  width: 75px;
  height: 27px;
  background-color: #121212;
  border-radius: 3px;
  margin-left: 10px;
`;

const SaveAddressButtonText = styled(SearchButtonText)`
  font-size: 10px;
`;

const ContentBox = styled.div<{ last?: boolean }>`
  width: 100%;
  padding: 30px 20px;
  border-bottom: ${(props) => (props.last ? 0 : '1px solid #121212')};
  text-align: left;
  @media only screen and (max-width: 768px) {
    padding: 18px 20px;
  }
`;

const ContentTextRowWrap = styled.div<{ last?: boolean }>`
  display: flex;
  align-items: flex-start;
  margin-bottom: ${(props) => (props.last ? 0 : '7px')};
`;

const RecipientInputRowWrap = styled(ContentTextRowWrap)<{ last?: boolean }>`
  align-items: center;
`;

const ContentLeftText = styled.span`
  font-family:'Pretendard Variable';
  color: #121212;
  font-size: 14px;
  font-weight: 500;
  width: 100px;
  @media only screen and (max-width: 768px) {
    width: 80px;
    font-size: 12px;
  }
`;

const RecipientInputLeftText = styled(ContentLeftText)`
  @media only screen and (max-width: 768px) {
    width: 100px;
  }
`;

const RecipientInput = styled(TextInput)`
  width: 250px;

  @media only screen and (max-width: 768px) {
    width: 100%;
  }
`;

const DeleteAllButton = styled.div`
  width: 100px;
  height: 41px;
  background-color: #fff;
  border: 1px solid #121212;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  cursor: pointer;
  float: right;
  @media only screen and (max-width: 768px) {
    border: 0
  }
  @media only screen and (max-width: 1100px) {
  }
`;

const DeleteText = styled.span`
  font-family:'Pretendard Variable';
  font-size: 15px;
  font-weight: 500;
  @media only screen and (max-width: 768px) {
    font-size: 13px;
  }
`;

export default Cart;
