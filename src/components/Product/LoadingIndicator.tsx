import { Audio, Oval } from 'react-loader-spinner'
import styled from 'styled-components';
function LoadingIndicator(){

return(
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
)
}

const LoadingContainer = styled.div`
  flex:1;
  background:rgba(0,0,0,0.1);
  justify-content:center;
  align-items:center;
`

export default LoadingIndicator