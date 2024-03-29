import styled from 'styled-components';

export const Wrapper = styled.div`
  min-height: calc(100vh - 112px);
  padding: 24px 20px 40px 20px;
  margin: 0 auto;
  margin-top: 56px;

  @media screen and (max-width: 319px) {
    width: 100%;
  }

  @media screen and (min-width: 320px) {
    width: 320px;
  }

  @media screen and (min-width: 768px) {
    width: 768px;
    min-height: calc(100vh - 128px);
    margin-top: 64px;
    padding: 40px 32px 44px 32px;
  }

  @media screen and (min-width: 1440px) {
    width: 1440px;
    min-height: calc(100vh - 120px);
    margin-top: 60px;
    padding: 20px 112px 44px 112px;
  }
`;

export const CalendarWrapper = styled.div`

  @media screen and (max-width: 319px) {
    width: 100%;
  }

  @media screen and (min-width: 320px) {
    width: 320px;
  }

  @media screen and (min-width: 768px) {
    width: 768px;
    min-height: calc(100vh - 128px);
    margin-top: 64px;
    padding: 40px 32px 44px 32px;
  }

  @media screen and (min-width: 1440px) {
    width: 1700px;
    min-height: calc(100vh - 120px);
    margin: 0 auto;
    padding: 20px 112px 44px 112px;
  }
`;