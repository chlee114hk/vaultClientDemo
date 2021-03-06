import React from 'react';
import { Link } from 'react-router';
import { VaultClient, Config } from '../logics';
import AsyncButton from './common/AsyncButton';

export default class RegistrationPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      email: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(name, event) {
    this.setState({ [name]: event.target.value });
  }

  handleSubmit(event) {
    console.log('Register account');
    const activateLink = Config.accountActivationURL;

    const { username, password, email } = this.state;

    return VaultClient.authRegisterAccount(username, password, email, activateLink, Config.webhost)
      .then(result => {
        console.log('Register sucessfully', result);
        alert('Account created. Verification email has been sent to ' + email);
        return Promise.resolve();
      }).catch(err => {
        console.error('Failed to register:', err);
        alert('Failed to register: ' + err.message);
        return Promise.reject(err);
      });
  }

  render() {
    return (
      <div className="home">
        <h1>Register Account</h1>
        <form>
          <div>
            Username: 
            <input type="text" value={this.state.username} onChange={this.handleChange.bind(this, 'username')} />
          </div>
          <div>
            Password: 
            <input type="password" value={this.state.password} onChange={this.handleChange.bind(this, 'password')} />
          </div>
          <div>
            Email: 
            <input type="text" value={this.state.email} onChange={this.handleChange.bind(this, 'email')} />
          </div>
          <AsyncButton
           type="button"
           onClick={this.handleSubmit}
           pendingText="Registering..."
           fulFilledText="Registered"
           rejectedText="Failed! Try Again"
           text="Register"
          />
        </form>
        <Link to="/">Back to login page</Link>
      </div>
    );
  }
}