import React from 'react';
import history from '../../common/history';
import TextField from '../../components/text-field';
import * as Form from '../../components/form-page';
import store from '../../redux/store';
import * as routes from '../../constants/routes';
import * as authActions from '../../redux/auth-actions';

export default function Login() {
  const [errorMsg, setErrorMsg] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    store.dispatch(authActions.login({ email, password }));
  }
  const handleEmailChange = (e) => {
    setErrorMsg('');
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setErrorMsg('');
    setPassword(e.target.value);
  };
  return (
    <Form.Page>
      <Form.Form>
        <Form.Title>Log In</Form.Title>
        <TextField label="Email" variant="outlined" onChange={handleEmailChange} />
        <TextField label="Password" variant="outlined" type="password" onChange={handlePasswordChange} />
        {errorMsg && <Form.Error>{errorMsg}</Form.Error>}
        <Form.Submit onClick={handleSubmit}>Log In</Form.Submit>
      </Form.Form>
    </Form.Page>
  )
}