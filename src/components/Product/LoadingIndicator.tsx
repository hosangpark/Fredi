import { Modal } from '@mantine/core';
import { useState } from 'react';
import { Audio, Oval } from 'react-loader-spinner'
import styled from 'styled-components';
function LoadingIndicator(
{loading,setLoading}
:
{loading:boolean, setLoading:(e:boolean)=>void}
){
  const [color, setColor] = useState("#19DBB4");
return(
   <>
      <Modal
          opened={loading} onClose={()=>setLoading(false)} overlayOpacity={0.5} size="auto" centered withCloseButton={false}
      >
          <LoadingContainer>
            <Oval
              height={80}
              width={80}
              color="#4fa94d"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
              ariaLabel='oval-loading'
              secondaryColor="#4fa94d"
              strokeWidth={2}
              strokeWidthSecondary={2}
            />
          </LoadingContainer>
      </Modal>
  </>
  
)
}

const LoadingContainer = styled.div`
  flex:1;
`

export default LoadingIndicator