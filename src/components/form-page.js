import styled from 'styled-components';
import { Button } from '@material-ui/core';
import { emphasize, fade, darken } from '@material-ui/core/styles/colorManipulator';

export const Page = styled.div`
  height: 100%;
  width: 100%;
  background: ${(props) => props.theme.formBackground};
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Form = styled.form`
  width: calc(100% - ${(props) => props.theme.spacing(5)});
  padding: ${(props) => props.theme.spacing(4)};
  max-width: 290px;
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  box-sizing: border-box;
  background-color: ${(props) => props.theme.textBackgroundColor};
  color: ${(props) => props.theme.textColor};
  box-shadow: 3px 3px 10px 3px rgba(0,0,0,0.425);
  border-radius: ${(props) => props.theme.borderRadius};
`;

export const Title = styled.h1`
  font-size: 30px;
  color: ${(props) => props.theme.textColor};
  text-align: center;
  margin-top: 0;
`;

export const Intro = styled.div`
  font-size: 18px;
  text-align: center;
  color: ${(props) => props.theme.unfocusedTextColor};
  font-weight: bold;
  margin-bottom: ${(props) => props.theme.spacing(2)};
`;

export const Submit = styled(Button)`
  && {
    background-color: ${(props) => props.theme.primaryButtonFillColor};
    color: white;
    font-weight: bold;
  },
  &&:hover {
    background-color: ${(props) => emphasize(props.theme.primaryButtonFillColor)};
  }
`;

export const Error = styled.div`
  text-align: center;
  padding: ${(props) => props.theme.spacing(1)};
  margin-bottom: ${(props) => props.theme.spacing(2)};
  width: 100%; 
  color: ${(props) => darken(props.theme.errorColor, 0.2)};
  background-color: ${((props) => fade(props.theme.errorColor, 0.2))};
  box-sizing: border-box;
  border-radius: ${(props) => props.theme.borderRadius};
  font-size: 15px;
`;

export const Modal = styled.div`
  z-index: 1300;
  position: fixed;
  top: 0;
  left: 0;
  overflow: auto;
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  align-items: center;
  padding: ${(props) => props.theme.spacing(6)} 0;
  background-color: #00000077;
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
`;
