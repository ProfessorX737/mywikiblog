import styled from 'styled-components';
import { TextField as MuiTextField } from '@material-ui/core';

const TextField = styled(MuiTextField)`
  && {
    display: block;
    margin-bottom: ${(props) => props.theme.spacing(2)};
  },
  && input {
    color: ${(props) => props.theme.textColor};
  }
  && .MuiFormLabel-root {
    color: ${(props) => props.theme.unfocusedTextColor};
  },
  && .MuiOutlinedInput-root > fieldset {
    border-color: ${(props) => props.theme.unfocusedInputBorderColor};
  }
  && .Mui-focused > fieldset {
    border-color: ${(props) => props.theme.focusedBorderColor};
  }
  && .Mui-error > fieldset {
    border-color: ${(props) => props.theme.errorColor};
  }
`;

export default TextField;
