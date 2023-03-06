import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import CheckBox from '../../components/Shop/CheckBox';
import OrderCard from '../../components/Shop/OrderCard';
import PostModal from '../../components/Modal/PostModal';
import { replaceString } from '../../util/Price';
import { TCartItem } from './Cart';
import { checkArea2, checkArea3 } from '../../util/ExtraFeeArea';
import AlertModal from '../../components/Modal/AlertModal';
import { APIRecordOrder, APISaveAddress } from '../../api/ShopAPI';

const PAYMENTTYPES = {
  1: 'card',
  2: 'vbank',
  3: 'trans',
};

function Order() {
  const navigate = useNavigate();
  const location = useLocation();
  console.log('location', location);
  const propsData = location.state;
  console.log('props data', propsData);
  const idxs = propsData.cartItem.map((item: any) => item.idx);

  const [agree1, setAgree1] = useState(false);
  const [agree2, setAgree2] = useState(false);
  const [agree3, setAgree3] = useState(false);
  const [agree4, setAgree4] = useState(false);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const [showAlertModal2, setShowAlertModal2] = useState<boolean>(false);
  const [showAlertModal3, setShowAlertModal3] = useState<boolean>(false);
  const [showSaveAddressModal, setShowSaveAddressModal] = useState<boolean>(false);
  const [showSavePeopleModal, setShowSavePeopleModal] = useState<boolean>(false);

  const [showDeliveryInfoModal, setShowDeliveryInfoModal] = useState<boolean>(false);
  const [zipCode, setZipCode] = useState<string>('');
  const [address1, setAddress1] = useState<string>('');
  const [address2, setAddress2] = useState<string>('');
  const [memo, setMemo] = useState<string>('');
  const [recipient, setRecipient] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  const [isArea2, setIsArea2] = useState(false);
  const [isArea3, setIsArea3] = useState(false);
  const [totalDelivery, setTotalDelivery] = useState(0);

  const [paymentType, setPaymentType] = useState<1 | 2 | 3>(1);

  const uid = `fredi_${new Date().getTime()}`;

  const onAddress = (value: { address: string; zonecode: string }) => {
    console.log('zonecode', value.zonecode);
    console.log('address', value.address);
    setZipCode(value.zonecode);
    setAddress1(value.address);
  };
  console.log('propsData', propsData);
  const onOrder = async () => {
    const data = {
      payment: PAYMENTTYPES[paymentType],
      idxs: idxs,
      name: propsData.cartItem.length > 1 ? `${propsData.cartItem[0].name} 외 ${propsData.cartItem.length - 1}건` : propsData.cartItem[0].name,
      price: propsData.totalInfo.totalPrice,
      delivery: totalDelivery,
      recipient: recipient,
      hp: phone,
      zipcode: zipCode,
      address1: address1,
      address2: address2,
      memo: memo,
    };
    navigate('/payment', {
      state: { orderInfo: data, uid },
      replace: true,
    });
  };

  const onRecordOrder = async () => {
    const data = {
      payment: PAYMENTTYPES[paymentType],
      idxs: idxs,
      name: propsData.cartItem.length > 1 ? `${propsData.cartItem[0].name} 외 ${propsData.cartItem.length - 1}건` : propsData.cartItem[0].name,
      price: propsData.totalInfo.totalPrice,
      delivery: totalDelivery,
      recipient: recipient,
      hp: phone,
      zipcode: zipCode,
      address1: address1,
      address2: address2,
      memo: memo,
      imp: uid,
    };
    try {
      const res = await APIRecordOrder(data);
      console.log(res);
      onOrder();
    } catch (error) {
      console.log(error);
      alert('주문기록에러' + error);
    }
  };

  const onCheckArea = (zipCode: string) => {
    console.log('2권역 체크', checkArea2(Number(zipCode)));
    console.log('3권역 체크', checkArea3(Number(zipCode)));
    setIsArea2(checkArea2(Number(zipCode)));
    setIsArea3(checkArea3(Number(zipCode)));
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
      console.log('res', res);
      setShowSaveAddressModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  const onSavePeople = async () => {
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
      setShowSavePeopleModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    onCheckArea(zipCode);
  }, [zipCode]);

  useEffect(() => {
    setZipCode(propsData.deliveryInfo.zipCode);
    setAddress1(propsData.deliveryInfo.address1);
    setAddress2(propsData.deliveryInfo.address2);
    setRecipient(propsData.deliveryInfo.recipient);
    setPhone(propsData.deliveryInfo.phone);
  }, []);

  useEffect(() => {
    const deliveryArr =
      propsData.cartItem.length !== 0
        ? propsData.cartItem.map((item: TCartItem) =>
            isArea2 ? item.delivery_fee + item.delivery_fee2 : isArea3 ? item.delivery_fee + item.delivery_fee3 : item.delivery_fee
          )
        : [0];
    const totalDelivery = deliveryArr.reduce(function add(sum: number, price: number) {
      return sum + price;
    });
    setTotalDelivery(totalDelivery);
  }, [isArea2, isArea3]);

  return (
    <Container>
      <LeftBox>
        <LeftTopBox>
          <Title>결제하기</Title>
        </LeftTopBox>
      </LeftBox>
      <RightBox>
        <SubTitleBox>
          <SubTitleText>주문 상품</SubTitleText>
        </SubTitleBox>
        <CartCardWrap>
          {propsData.cartItem.map((item: TCartItem) => (
            <OrderCard cartItem={item} />
          ))}
        </CartCardWrap>
        <SubTitleBox>
          <SubTitleText>수령인 정보</SubTitleText>
          <SaveAddressButton onClick={onSavePeople}>
            <SaveAddressButtonText>수령인 저장</SaveAddressButtonText>
          </SaveAddressButton>
        </SubTitleBox>
        <ContentBox>
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
        </ContentBox>
        <SubTitleBox>
          <SubTitleText>배송 정보</SubTitleText>
          <SaveAddressButton onClick={onSaveAddress}>
            <SaveAddressButtonText>배송지 저장</SaveAddressButtonText>
          </SaveAddressButton>
        </SubTitleBox>
        <ContentBox>
          <ContentTextRowWrap>
            <ContentLeftText>배송지</ContentLeftText>
            <ContentRightBox>
              {zipCode && address1 && address2 ? (
                <ContentRightText>
                  ({zipCode}) {address1 + ' ' + address2}
                </ContentRightText>
              ) : (
                <ContentRightText>배송지를 입력해 주세요.</ContentRightText>
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
                </ModifyDeliveryInfoBox>
              )}
            </ContentRightBox>
          </ContentTextRowWrap>
          <ContentTextRowWrap last>
            <ContentLeftText>배송 메모</ContentLeftText>
            <ContentRightBox>
              <TextArea value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="배송 메모 입력" />
            </ContentRightBox>
          </ContentTextRowWrap>
        </ContentBox>
        <SubTitleBox>
          <SubTitleText>결제 수단 선택</SubTitleText>
        </SubTitleBox>
        <ContentBox last>
          <ContentTextRowWrap last>
            <CheckBoxWrap onClick={() => setPaymentType(1)}>
              <CheckBox checked={paymentType === 1} />
              <PaymentTypeCheckboxText>신용카드</PaymentTypeCheckboxText>
            </CheckBoxWrap>
            <CheckBoxWrap onClick={() => setPaymentType(2)}>
              <CheckBox checked={paymentType === 2} />
              <PaymentTypeCheckboxText>무통장 입금</PaymentTypeCheckboxText>
            </CheckBoxWrap>
            <CheckBoxWrap onClick={() => setPaymentType(3)}>
              <CheckBox checked={paymentType === 3} />
              <PaymentTypeCheckboxText>계좌이체</PaymentTypeCheckboxText>
            </CheckBoxWrap>
          </ContentTextRowWrap>
        </ContentBox>
      </RightBox>
      <SideBox>
        <SideTopBox>
          <CheckBoxWrap
            onClick={() => {
              if (agree1 && agree2 && agree3 && agree4) {
                setAgree1(false);
                setAgree2(false);
                setAgree3(false);
                setAgree4(false);
              } else {
                setAgree1(true);
                setAgree2(true);
                setAgree3(true);
                setAgree4(true);
              }
            }}
          >
            <CheckBox checked={agree1 && agree2 && agree3 && agree4} />
            <CheckBoxText>결제 진행 필수 전체 동의</CheckBoxText>
          </CheckBoxWrap>
          <CheckBoxListWrap>
            <CheckBoxWrap onClick={() => setAgree1((prev) => !prev)}>
              <CheckBox checked={agree1} />
              <InnerCheckBoxText>(필수) 개인정보 수집 이용 및 처리 동의</InnerCheckBoxText>
            </CheckBoxWrap>
            <CheckBoxWrap onClick={() => setAgree2((prev) => !prev)}>
              <CheckBox checked={agree2} />
              <InnerCheckBoxText>(필수) 개인정보 제3자 제공 동의</InnerCheckBoxText>
            </CheckBoxWrap>
            <CheckBoxWrap onClick={() => setAgree3((prev) => !prev)}>
              <CheckBox checked={agree3} />
              <InnerCheckBoxText>(필수) 결제대행 서비스 약관 동의</InnerCheckBoxText>
            </CheckBoxWrap>
            <CheckBoxWrap onClick={() => setAgree4((prev) => !prev)}>
              <CheckBox checked={agree4} />
              <InnerCheckBoxText>(필수) 전자지급 결제대행 서비스 이용약관 동의</InnerCheckBoxText>
            </CheckBoxWrap>
          </CheckBoxListWrap>
          <NoticeText>
            ·프레디에서 판매되는 상품 중에는 프레디에 입점한 개별 판매자가 판매하는 마켓플레이스(오픈마켓)상품이 포함되어 있습니다.
            마켓플레이스(오픈마켓)상품의 경우 프레디는 통신판매중개자로서 통신판매의 당사자가 아닙니다. 프레디는 해당 상품의 주문, 품질, 교환/환불 등
            의무와 책임을 부담하지 않습니다.
          </NoticeText>
        </SideTopBox>
        <SideBottomBox>
          <OrderInfoBox>
            <OrderInfoTopBox>
              <TextRowWrap>
                <LeftText>상품 금액</LeftText>
                <RightText>{replaceString(propsData.totalInfo.totalPrice)} 원</RightText>
              </TextRowWrap>
              <TextRowWrap>
                <LeftText>배송비</LeftText>
                <RightText>{replaceString(totalDelivery)} 원</RightText>
              </TextRowWrap>
            </OrderInfoTopBox>
            <OrderInfoBottomBox>
              <TextRowWrap>
                <LeftText>최종 결제 금액</LeftText>
                <RightText>{replaceString(propsData.totalInfo.totalPrice + totalDelivery)} 원</RightText>
              </TextRowWrap>
            </OrderInfoBottomBox>
          </OrderInfoBox>
          <OrderButtonWrap>
            <OrderButton
              disabled={!(zipCode && address1 && address2 && agree1 && agree2 && agree3 && agree4)}
              onClick={() => {
                if (!(zipCode && address1 && address2)) {
                  return setShowAlertModal(true);
                }
                if (!(recipient && phone)) {
                  return setShowAlertModal3(true);
                }
                if (!(agree1 && agree2 && agree3 && agree4)) {
                  return setShowAlertModal2(true);
                }
                onRecordOrder();
              }}
            >
              <OrderButtonText>결제하기</OrderButtonText>
            </OrderButton>
          </OrderButtonWrap>
          <NoticeBox>
            <NoticeText>·[결제완료, 입금대기] 상태일 경우에만 주문 취소 가능합니다.</NoticeText>
            <NoticeText>·배송 불가 시, 결제수단으로 환불됩니다.</NoticeText>
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
        visible={showAlertModal2}
        setVisible={setShowAlertModal2}
        onClick={() => {
          setShowAlertModal2(false);
        }}
        text={'모든 약관에 동의해 주세요.'}
      />
      <AlertModal
        visible={showAlertModal3}
        setVisible={setShowAlertModal3}
        onClick={() => {
          setShowAlertModal3(false);
        }}
        text={'수령인 정보를 입력해 주세요.'}
      />
      <AlertModal
        visible={showSaveAddressModal}
        setVisible={setShowSaveAddressModal}
        onClick={() => {
          setShowSaveAddressModal(false);
        }}
        text={'배송지가 저장되었습니다.'}
      />
      <AlertModal
        visible={showSavePeopleModal}
        setVisible={setShowSavePeopleModal}
        onClick={() => {
          setShowSavePeopleModal(false);
        }}
        text={'수령인 정보가 저장되었습니다.'}
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
  @media only screen and (max-width: 1600px) {
    width: 300px;
  }
  @media only screen and (max-width: 1400px) {
    display: none;
  }

  @media only screen and (max-width: 1100px) {
    display: flex;
    width: 100%;
    border-bottom: 1px solid #121212;
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
  padding: 10px 50px;
  @media only screen and (max-width: 1100px) {
    padding: 0 18px;
  }
`;

const Title = styled.h3`
  font-family: 'NotoSans';
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
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  @media only screen and (max-width: 768px) {
  }
`;

const CheckBoxText = styled.span`
  font-family: 'NotoSans';
  font-size: 15px;
  margin-left: 7px;
  font-weight: 500;
  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
`;

const PaymentTypeCheckboxText = styled(CheckBoxText)`
  font-weight: 400;
  font-size: 14px;
  margin-right: 15px;
  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
`;

const SideTopBox = styled.div`
  width: 100%;
  padding: 35px 30px;
  display: flex;
  flex-direction: column;
  @media only screen and (max-width: 1100px) {
    padding: 30px 18px;
    border-top: 1px solid #121212;
  }
`;
const SideBottomBox = styled.div`
  width: 100%;
  border-top: 1px solid #121212;
  padding: 30px;
  @media only screen and (max-width: 1100px) {
    padding: 0 18px 30px;
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
  font-family: 'NotoSans';
  font-size: 15px;
  font-weight: 500;
  color: #fff;
  @media only screen and (max-width: 1100px) {
  }
  @media only screen and (max-width: 768px) {
    font-size: 14px;
  }
`;

const DeliveryInfoButton = styled.div`
  width: 100%;
  height: 42px;
  background-color: #fff;
  border: 1px solid #121212;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 5px 0 10px;
  cursor: pointer;
  @media only screen and (max-width: 1100px) {
  }
`;

const DeliveryInfoButtonText = styled.span`
  font-family: 'NotoSans';
  font-size: 14px;
  font-weight: 400;
  color: #121212;
  @media only screen and (max-width: 1100px) {
    font-size: 13px;
  }
  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
`;

const OrderInfoBox = styled.div``;

const OrderInfoTopBox = styled.div`
  border-bottom: 1px solid #121212;
  padding: 10px 0;
  @media only screen and (max-width: 1100px) {
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
  font-family: 'NotoSans';
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
  font-family: 'NotoSans';
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
  font-family: 'NotoSans';
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

const InnerCheckBoxText = styled(CheckBoxText)`
  font-size: 12px;
  font-weight: 400;
  @media only screen and (max-width: 768px) {
    font-size: 11px;
  }
`;

const CheckBoxListWrap = styled.div`
  margin: 10px 0 30px;
`;

const SubTitleBox = styled.div`
  height: 65px;
  border-bottom: 1px solid #121212;
  display: flex;
  align-items: center;
  padding-left: 20px;
  @media only screen and (max-width: 768px) {
    height: 48px;
  }
`;

const SubTitleText = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: #121212;
  @media only screen and (max-width: 768px) {
    font-size: 14px;
  }
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
  font-family: 'NotoSans';
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

const ContentRightText = styled.span`
  display: flex;
  flex: 1;
  font-family: 'NotoSans';
  color: #121212;
  font-size: 14px;
  font-weight: 400;
  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
`;

const InputWrap = styled.div<{ last?: boolean }>`
  display: flex;
  flex-direction: column;
  flex: 1;
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
  font-weight: 400;
  outline: 0;
  margin-bottom: 10px;
  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
`;

const RecipientInput = styled(TextInput)`
  width: 250px;

  @media only screen and (max-width: 768px) {
    width: 100%;
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
  font-weight: 400;
  color: #ffffff;
  font-size: 13px;
  @media only screen and (max-width: 768px) {
    font-size: 11px;
  }
`;

const ModifyDeliveryInfoBox = styled.div`
  padding: 30px 10px 0 0;
  width: 100%;
  max-width: 500px;
  @media only screen and (max-width: 768px) {
    padding: 25px 0 0;
  }
`;
const ContentRightBox = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 0;
  border-radius: 0;
  border: 1px solid #121212;
  font-size: 14px;
  font-weight: 400;
  outline: 0;
  margin-bottom: 10px;
  width: 100%;
  min-height: 100px;
  color: #121212;
  vertical-align: top;
  resize: none;
  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
`;

const SaveAddressButton = styled(SearchButton)`
  width: 75px;
  height: 27px;
  background-color: #121212;
  border-radius: 3px;
  margin-left: 15px;
`;

const SaveAddressButtonText = styled(SearchButtonText)`
  font-size: 10px;
`;

export default Order;
