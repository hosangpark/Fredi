import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import arrDownImage from '../../asset/image/arr_down.png';
import { dndData, DndList } from '../../components/DnD/DnD';
import { Loader, Select } from '@mantine/core';
import AlertModal from '../../components/Modal/AlertModal';
import { APIModifyProduct, APIProductDetails, APIRegisterProduct } from '../../api/ProductAPI';

const CATEGORYLIST = [
  { value: '1', label: 'all' },
  { value: '2', label: 'furniture' },
  { value: '3', label: 'lighting' },
  { value: '4', label: 'fabric' },
  { value: '5', label: 'tableware' },
  { value: '6', label: 'art&objet' },
];

function RegisterProduct() {
  const navigate = useNavigate();
  const { idx } = useParams();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const [images, setImages] = useState<dndData[]>([]);
  const [init, setInit] = useState<dndData[]>([]);
  const [category, setCategory] = useState<'1' | '2' | '3' | '4' | '5' | '6'>('1');
  const [name, setName] = useState<string>('');
  const [designer, setDesigner] = useState<string>('');
  const [size, setSize] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [sns, setSns] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [website, setWebsite] = useState<string>('');
  const [alertType, setAlertType] = useState<
    'image' | 'name' | 'designer' | 'size' | 'weight' | 'country' | 'description' | 'sns' | 'email' | 'website'
  >();

  const onRegisterProduct = async () => {
    setIsLoading(true);
    if (images.length < 2) return setAlertType('image');
    if (!name) return setAlertType('name');
    if (!designer) return setAlertType('designer');
    if (!size) return setAlertType('size');
    if (!weight) return setAlertType('weight');
    if (!country) return setAlertType('country');
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
    data.append('designer', designer);
    data.append('size', size);
    data.append('weight', weight);
    data.append('country', country);
    data.append('description', description);
    data.append('sns', sns);
    data.append('email', email);
    data.append('website', website);
    try {
      const res = idx ? await APIModifyProduct(data) : await APIRegisterProduct(data);
      console.log(res);
      setIsLoading(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  useEffect(() => {
    console.log('category', category);
  }, [category]);

  useEffect(() => {
    if (alertType) {
      setShowAlertModal(true);
    }
  }, [alertType]);

  const fetchDetail = async () => {
    const resData = await APIProductDetails({ idx });
    console.log(resData);
    setCategory(String(resData.category) as '1' | '2' | '3' | '4' | '5' | '6');
    setWeight(resData.weight);
    setInit(resData.imageList.map((image: any) => ({ symbol: image.idx, name: image.file_name, url: image.file_name })));
    setName(resData.name);
    setDesigner(resData.designer);
    setSize(resData.size);
    setCountry(resData.country);
    setDescription(resData.description);
    setSns(resData.sns);
    setEmail(resData.email);
    setWebsite(resData.website);
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
          <InputTitle>제품명</InputTitle>
          <TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder="입력해 주세요" />
        </InputWrap>
        <InputWrap>
          <InputTitle>디자이너 이름</InputTitle>
          <TextInput value={designer} onChange={(e) => setDesigner(e.target.value)} placeholder="입력해 주세요" />
        </InputWrap>
        <InputWrap>
          <InputTitle>제품 사이즈</InputTitle>
          <InputDescription>width*depth*height</InputDescription>
          <TextInput value={size} onChange={(e) => setSize(e.target.value)} placeholder="입력해 주세요" />
        </InputWrap>
        <InputWrap>
          <InputTitle>제품 무게</InputTitle>
          <TextInput value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="입력해 주세요" />
        </InputWrap>
        <InputWrap>
          <InputTitle>제조</InputTitle>
          <TextInput value={country} onChange={(e) => setCountry(e.target.value)} placeholder="입력해 주세요" />
        </InputWrap>
        <InputWrap last>
          <InputTitle>디자이너&작품 설명</InputTitle>
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
        <BlackButton isLoading={isLoading} aria-disabled={isLoading} onClick={onRegisterProduct}>
          {isLoading ? <Loader color="#121212" size="xs" /> : <BlackButtonText>{idx ? '수정' : '등록'}</BlackButtonText>}
        </BlackButton>
      </Box>
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
            ? '제품명을 입력해 주세요.'
            : alertType === 'designer'
            ? '디자이너 이름을 입력해 주세요.'
            : alertType === 'size'
            ? '제품 사이즈를 입력해 주세요.'
            : alertType === 'weight'
            ? '제품 무게를 입력해 주세요.'
            : alertType === 'country'
            ? '제조 국가를 입력해 주세요.'
            : alertType === 'description'
            ? '디자이너&작품 설명을 입력해 주세요.'
            : ''
        }
      />
      <AlertModal
        visible={showSuccessModal}
        setVisible={setShowSuccessModal}
        onClick={() => {
          setShowSuccessModal(false);
          navigate('/admin/productlist');
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

export default RegisterProduct;
