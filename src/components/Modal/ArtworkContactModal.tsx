import React from 'react';
import { Modal } from '@mantine/core';
import styled from 'styled-components';
import RightArrowImage from '../../asset/image/right.svg'
import linkImage from '../../asset/image/rink.svg';
import { useNavigate } from 'react-router-dom';
import closeImage from '../../asset/image/close.svg'
import Nodata from '../Product/NoData';
import { ArtworkLinkListType } from '../../types/Types';


function ArtworkContactModal({
  visible,
  setVisible,
  contactUrl,
  onClick,
}: {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  contactUrl?: ArtworkLinkListType;
  onClick: () => void;
}) {
  return (
    <Modal opened={visible} onClose={()=>setVisible(false)} padding={0} radius={14} overlayOpacity={0.5} size="auto" centered withCloseButton={false}>
      <ModalBox>
        <Xheader>
          <CloseImage onClick={()=>setVisible(false)} src={closeImage}/>
        </Xheader>
        {contactUrl?.sns &&
        <LayoutWrap onClick={() => {
          if(contactUrl.link_sns_title == '인스타그램' || contactUrl.link_sns_title == 'instagram'){
                window.open(`https://www.instagram.com/${contactUrl.sns}`, '_blank')
          }
        }}>
          <LinkImageWrap>
            <LinksImage src={linkImage}/>
          </LinkImageWrap>
          <LinkItemBox>
            <LinkTitleBox>
              <LinkName>
                {contactUrl.link_sns_title? contactUrl.link_sns_title : 'SNS' }
              </LinkName>
              <LinkUrl>
                {contactUrl.sns}
              </LinkUrl>
            </LinkTitleBox>
          </LinkItemBox>
        </LayoutWrap>
        }
        {contactUrl?.link_buy && contactUrl?.link_buy_title &&
          <LayoutWrap onClick={() => window.open(`${contactUrl.link_buy}`, '_blank')}>
            <LinkImageWrap>
              <LinksImage src={linkImage}/>
            </LinkImageWrap>
            <LinkItemBox>
              <LinkTitleBox>
                <LinkName>
                  {contactUrl?.link_buy_title? contactUrl.link_buy_title : '' }
                </LinkName>
                <LinkUrl>
                  {contactUrl?.link_buy? contactUrl.link_buy:''}
                </LinkUrl>
              </LinkTitleBox>
            </LinkItemBox>
          </LayoutWrap>
        }
        {contactUrl?.link_etc1 && contactUrl?.link_etc_title1 &&
          <LayoutWrap onClick={() => window.open(`${contactUrl?.link_etc1}`, '_blank')}>
            <LinkImageWrap>
              <LinksImage src={linkImage}/>
            </LinkImageWrap>
            <LinkItemBox>
              <LinkTitleBox>
                <LinkName>
                  {contactUrl?.link_etc_title1? contactUrl.link_etc_title1 : '' }
                </LinkName>
                <LinkUrl>
                  {contactUrl?.link_etc1? contactUrl.link_etc1:''}
                </LinkUrl>
              </LinkTitleBox>
            </LinkItemBox>
          </LayoutWrap>
        }
      {!contactUrl?.sns && !contactUrl?.link_buy && !contactUrl?.link_buy_title && !contactUrl?.link_etc1 && !contactUrl?.link_etc_title1
        && !contactUrl?.link_sns_title &&
        <Nodata Text={'등록된 링크가 없습니다.'}/>
      }
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
  @media only screen and (max-width: 768px) {
    width:438px;
  }
  @media only screen and (max-width: 460px) {
    width:338px;
  }
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
const LayoutWrap = styled.div`
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
  width:40px;
  height:40px;
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

export default ArtworkContactModal;
