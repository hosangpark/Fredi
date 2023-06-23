import styled from 'styled-components';

export const EmptyHeightBox = styled.div`
  width:100%;
  height:50px;
`;
export const HeaderButtom = styled.div`
// tranform: translateY(-1px);
  position:absolute;
  top:20px;
  left:50%;
  transform:translate(-50%,0);
  width:65px;
  border:1px solid #acacac;
  border-radius:20px;
  @media only screen and (max-width: 768px) {
    width:50px;
  }
`;