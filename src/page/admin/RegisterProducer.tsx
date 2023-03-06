import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import arrDownImage from '../../asset/image/arr_down.png';
import { TimeRangeInput } from '@mantine/dates';
import PostModal from '../../components/Modal/PostModal';
import { dndData, DndList } from '../../components/DnD/DnD';
import { Loader, Select } from '@mantine/core';
import dayjs from 'dayjs';
import { APIModifyProducer, APIProducerDetails, APIRegisterProducer } from '../../api/ProducerAPI';
import AlertModal from '../../components/Modal/AlertModal';

const CATEGORYLIST = [
  { value: '1', label: '아크릴' },
  { value: '2', label: '목재' },
  { value: '3', label: '스틸' },
  { value: '4', label: '금속' },
  { value: '5', label: '유리' },
  { value: '6', label: '도자기' },
];

function RegisterProducer() {
  const navigate = useNavigate();
  const { idx } = useParams();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const [images, setImages] = useState<dndData[]>([]);
  const [init, setInit] = useState<dndData[]>([]);
  const [category, setCategory] = useState<'1' | '2' | '3' | '4' | '5' | '6'>('1');
  const [name, setName] = useState<string>('');
  const [addressText, setAddressText] = useState<string>('');
  const [zipCode, setZipCode] = useState<string>('');
  const [address1, setAddress1] = useState<string>('');
  const [address2, setAddress2] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const now = new Date();
  const [time, setTime] = useState<[Date, Date]>([now, now]);
  const [businessHour, setBusinessHour] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [sns, setSns] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [website, setWebsite] = useState<string>('');
  const [alertType, setAlertType] = useState<
    'image' | 'name' | 'addressText' | 'address1' | 'address2' | 'phone' | 'businessHour' | 'description' | 'sns' | 'email' | 'website'
  >();

  const onAddress = (value: { address: string; zonecode: string }) => {
    console.log('zonecode', value.zonecode);
    console.log('address', value.address);
    setZipCode(value.zonecode);
    setAddress1(value.address);
  };

  const onRegisterProducer = async () => {
    setIsLoading(true);
    if (images.length < 2) return setAlertType('image');
    if (!name) return setAlertType('name');
    if (!addressText) return setAlertType('addressText');
    if (!address1) return setAlertType('address1');
    if (!address2) return setAlertType('address2');
    if (!phone) return setAlertType('phone');
    if (!businessHour) return setAlertType('businessHour');
    if (!description) return setAlertType('description');

    const data = new FormData();
    let count = 0;
    for (const image of images) {
      if (image.file) {
        data.append('images', image.file);
        count += 1;
      } else {
        data.append('images', JSON.stringify({ ...image, index: count }));
        count += 1;
      }
    }
    if (idx) {
      data.append('idx', idx);
    }
    data.append('category', category);
    data.append('name', name);
    data.append('address_text', addressText);
    data.append('zipcode', zipCode);
    data.append('address1', address1);
    data.append('address2', address2);
    data.append('phone', phone);
    data.append('business_hour', businessHour);
    data.append('description', description);
    data.append('sns', sns);
    data.append('email', email);
    data.append('website', website);
    try {
      const res = idx ? await APIModifyProducer(data) : await APIRegisterProducer(data);
      console.log(res);
      setIsLoading(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  useEffect(() => {
    setBusinessHour(`${dayjs(time[0]).format('HH:mm')} - ${dayjs(time[1]).format('HH:mm')}`);
  }, [time]);

  useEffect(() => {
    console.log('businessHour', businessHour);
  }, [businessHour]);

  useEffect(() => {
    console.log('category', category);
  }, [category]);

  useEffect(() => {
    if (alertType) {
      setShowAlertModal(true);
    }
  }, [alertType]);

  const fetchDetail = async () => {
    const resData = await APIProducerDetails({ idx });
    console.log(resData);
    const hour: string = resData.business_hour;
    const [hour1, hour2] = hour.split('-');
    const now = dayjs().format('YYYY-MM-DD');
    setTime([dayjs(`${now} ${hour1}`).toDate(), dayjs(`${now} ${hour2}`).toDate()]);
    setCategory(String(resData.category) as '1' | '2' | '3' | '4' | '5' | '6');
    setName(resData.name);
    setAddressText(resData.address_text);
    setZipCode(resData.zipcode);
    setAddress1(resData.address1);
    setAddress2(resData.address2);
    setPhone(resData.phone);

    setBusinessHour(resData.business_hour);
    setDescription(resData.description);
    setSns(resData.sns);
    setEmail(resData.email);
    setWebsite(resData.website);
    setInit(resData.imageList.map((image: any) => ({ symbol: image.idx, name: image.file_name, url: image.file_name })));
  };

  useEffect(() => {
    if (idx) {
      fetchDetail();
    }
  }, []);

  return (
    <>
      <Box>
        <Title>이미지 등록</Title>
        <TitleBox>
          <SubTitle>첫번째 이미지는 메인에 등록되는 이미지입니다.</SubTitle>
          <SubTitle>이미지는 순서는 드래그로 변경 가능합니다.</SubTitle>
        </TitleBox>
        <DndList data={images} setData={setImages} initList={init} />
      </Box>
      <Box>
        <InputWrap>
          <InputTitle>카테고리</InputTitle>
          <UnderLineBox>
            <Select
              rightSection={<DownIcon src={arrDownImage} />}
              styles={(theme) => ({
                rightSection: { pointerEvents: 'none' },
                item: {
                  '&[data-selected]': {
                    '&, &:hover': {
                      backgroundColor: '#121212',
                      color: '#fff',
                    },
                  },
                },
                input: { fontSize: 15 },
              })}
              variant="unstyled"
              value={category}
              data={CATEGORYLIST}
              onChange={(value: '1' | '2' | '3' | '4' | '5' | '6') => setCategory(value)}
            />
          </UnderLineBox>
        </InputWrap>
        <InputWrap>
          <InputTitle>업체명</InputTitle>
          <TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder="입력해 주세요" />
        </InputWrap>
        <InputWrap>
          <InputTitle>주소</InputTitle>
          <InputDescription>(메인화면에 노출되는 주소 / ~시 ~ 동 까지 작성해주세요.)</InputDescription>
          <TextInput value={addressText} onChange={(e) => setAddressText(e.target.value)} placeholder="입력해 주세요" />
        </InputWrap>
        <InputWrap>
          <InputTitle>상세 주소</InputTitle>
          <SearchAddressInputWrap>
            <TextInput value={address1} disabled placeholder="주소를 검색해 주세요" style={{ backgroundColor: '#fff' }} />
            <SearchButton onClick={() => setShowModal(true)}>
              <SearchButtonText>검색</SearchButtonText>
            </SearchButton>
          </SearchAddressInputWrap>
          <TextInput value={address2} onChange={(e) => setAddress2(e.target.value)} placeholder="상세 주소 입력" />
        </InputWrap>
        <InputWrap>
          <InputTitle>전화번호</InputTitle>
          <TextInput maxLength={11} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="입력해 주세요" />
        </InputWrap>
        <InputWrap>
          <InputTitle>영업시간</InputTitle>
          <TimeRangeInput
            value={time}
            onChange={setTime}
            clearable
            styles={(theme) => ({
              input: {
                border: '1px solid #121212',
                borderRadius: 0,
                marginTop: 10,
                '&,&:focus': {
                  borderColor: '#121212 !important',
                },
              },
            })}
          />
        </InputWrap>
        <InputWrap last>
          <InputTitle>업체 설명</InputTitle>
          <TextArea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="입력해 주세요" />
        </InputWrap>
      </Box>
      <Box last>
        <InputWrap>
          <InputTitle>SNS</InputTitle>
          <TextInput value={sns} onChange={(e) => setSns(e.target.value)} placeholder="입력해 주세요" />
        </InputWrap>
        <InputWrap>
          <InputTitle>E-mail</InputTitle>
          <TextInput value={email} onChange={(e) => setEmail(e.target.value)} placeholder="입력해 주세요" />
        </InputWrap>
        <InputWrap last>
          <InputTitle>Website</InputTitle>
          <TextInput value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="입력해 주세요" />
        </InputWrap>
        <BlackButton isLoading={isLoading} aria-disabled={isLoading} onClick={onRegisterProducer}>
          {isLoading ? <Loader color="#121212" size="xs" /> : <BlackButtonText>{idx ? '수정' : '등록'}</BlackButtonText>}
        </BlackButton>
      </Box>
      <PostModal visible={showModal} setVisible={setShowModal} setAddress={onAddress} />
      <AlertModal
        visible={showAlertModal}
        setVisible={setShowAlertModal}
        onClick={() => {
          setShowAlertModal(false);
          setAlertType(undefined);
        }}
        text={
          alertType === 'image'
            ? '이미지를 최소 2개 이상 등록해 주세요.'
            : alertType === 'name'
            ? '업체명을 입력해 주세요.'
            : alertType === 'addressText'
            ? '주소를 입력해 주세요.'
            : alertType === 'address1'
            ? '상세 주소를 입력해 주세요.'
            : alertType === 'address2'
            ? '상세 주소를 모두 입력해 주세요.'
            : alertType === 'phone'
            ? '전화번호를 입력해 주세요.'
            : alertType === 'businessHour'
            ? '영업시간을 입력해 주세요.'
            : alertType === 'description'
            ? '업체 설명을 입력해 주세요.'
            : ''
        }
      />
      <AlertModal
        visible={showSuccessModal}
        setVisible={setShowSuccessModal}
        onClick={() => {
          setShowSuccessModal(false);
          navigate('/admin/producerlist');
        }}
        text={'등록되었습니다.'}
      />
    </>
  );
}

const Box = styled.div<{ last?: boolean }>`
  padding: 50px;
  border-bottom: ${(props) => (props.last ? 0 : '1px solid #121212')};
  text-align: left;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h4`
  font-weight: bold;
  color: #121212;
  font-size: 18px;
  margin: 0;
  margin-bottom: 5px;
`;

const TitleBox = styled.div`
  margin-bottom: 15px;
`;

const SubTitle = styled.p`
  color: #121212;
  font-size: 12px;
  font-weight: 300;
  margin: 0;
`;

const InputWrap = styled.div<{ last?: boolean }>`
  width: 520px;
  margin-bottom: ${(props) => (props.last ? 0 : 30)}px;
`;

const InputTitle = styled.h4`
  font-weight: 700;
  color: #121212;
  font-size: 17px;
  margin: 0;
  margin-bottom: 5px;
`;

const TextInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 10px 15px;
  border: 0;
  border-bottom: 1px solid #121212;
  font-size: 15px;
  font-weight: 400;
  outline: 0;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 155px;
  border: 1px solid #121212;
  padding: 15px;
  font-size: 15px;
  font-weight: 400;
  color: #121212;
  vertical-align: top;
  resize: none;
  margin-top: 10px;
  outline: 0;
`;

const BlackButton = styled.div<{ isLoading: boolean }>`
  width: 160px;
  height: 60px;
  background-color: ${(props) => (props.isLoading ? '#ccc' : '#121212')};
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: flex-end;
  cursor: pointer;
  margin-top: 50px;
`;

const BlackButtonText = styled.span`
  color: #ffffff;
  font-size: 16px;
  font-weight: 400;
`;

const InputDescription = styled.span`
  display: inline-block;
  color: #121212;
  font-size: 12px;
  font-weight: 300;
`;

const SearchAddressInputWrap = styled.div`
  display: flex;
  margin-bottom: 10px;
`;

const SearchButton = styled.div`
  width: 115px;
  height: 40px;
  background-color: #121212;
  margin-left: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const SearchButtonText = styled.span`
  font-weight: 400;
  color: #ffffff;
  font-size: 14px;
`;

const UnderLineBox = styled.div`
  width: 100%;
  padding: 5px 15px;
  border-bottom: 1px solid #121212;
  text-align: left;
`;

const DownIcon = styled.img`
  width: 14px;
  height: 14px;
  cursor: pointer;
`;

export default RegisterProducer;
