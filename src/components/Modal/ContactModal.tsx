import React from 'react';
import { Modal } from '@mantine/core';
import styled from 'styled-components';
import RightArrowImage from '../../asset/image/right.svg'
import linkImage from '../../asset/image/rink.svg';
import { useNavigate } from 'react-router-dom';
import closeImage from '../../asset/image/close.svg'

interface ContactObject {
  title:string
  url:string
}

function ContactModal({
  visible,
  setVisible,
  contactUrl,
  onClick,
}: {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  contactUrl: ContactObject[];
  onClick: () => void;
}) {
  return (
    <Modal opened={visible} onClose={()=>setVisible(false)} padding={0} radius={14} overlayOpacity={0.5} size="auto" centered withCloseButton={false}>
      <ModalBox>
        <Xheader>
          <CloseImage onClick={()=>setVisible(false)} src={closeImage}/>
        </Xheader>
        {contactUrl.map((item,index) => {
          return(
        <LayoutWrap key={index} href={'https://'+item.url}>
          <LinkImageWrap>
            <LinksImage src={linkImage}/>
          </LinkImageWrap>
          <LinkItemBox>
            <LinkTitleBox>
              <LinkName>
                {item.title}
              </LinkName>
              <LinkUrl>
                {item.url}
              </LinkUrl>
            </LinkTitleBox>
          </LinkItemBox>
        </LayoutWrap>
        )})}
      </ModalBox>
    </Modal>
  );
}


const ModalBox = styled.div`
  width:538px;
  background-color: #fff;
  border-radius:14px;
  display: flex;
  padding:0 5px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const CloseImage = styled.img`
  width:26px;
  height:26px;
  cursor: pointer;
`
const Xheader = styled.div`
  width:100%;
  height:67px;
  display:flex;
  padding:0 20px;
  justify-content:flex-end;
  align-items:center;
`
const LayoutWrap = styled.a`
  border-top:0.5px solid #CBCBCB;
  text-decoration:none;
  display: flex;
  width:100%;
  padding:20px 25px;
  cursor: pointer;
`;

const LinkImageWrap = styled.div`
  position:relative;
  display:flex;
  justify-content:center;
  align-items:center;
  width:57px;
  height:57px;
  margin-right:30px;
  border: 1px solid #B8B7B8;
  border-radius:50%;
  /* width:40%; */
  @media only screen and (max-width: 1440px) {
  width:50px;
  height:50px;
  }
`;
const LinksImage = styled.img`
  width:45%;
  height:45%;
  object-fit:contain;
`;
const LinkItemBox = styled.div`
  flex:1;
  display:flex;
  justify-content:space-between;
  align-items:center;
`;
const LinkTitleBox = styled.div`
font-family:'Pretendard Variable';
  display:flex;
  font-weight: 410;
  flex-direction:column;
  justify-content:center;
  @media only screen and (max-width: 768px) {
    font-size:14px;
  }
`;
const LinkName = styled.p`
font-family:'Pretendard Variable';
  font-weight: 410;
  text-align:start;
  color:#000000;
  line-height:21px;
  margin:0;
  font-size:21px;
  @media only screen and (max-width: 1440px) {
    font-size:18px;
    line-height:18px;
  }
`
const LinkUrl = styled.p`
  font-family:'Pretendard Variable';
  font-weight: 310;
  text-align:start;
  color:#000000;
  margin:7px 0 0 0;
  font-size:17px;
  line-height:17px;
  @media only screen and (max-width: 1440px) {
    line-height:15px;
    font-size:15px;
  }
`;

export default ContactModal;
