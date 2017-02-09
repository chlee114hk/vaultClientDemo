import React from 'react';
import { Link } from 'react-router';
import VaultClientDemo, { Utils } from '../logics/VaultClientDemo';
import { CurrentLogin } from './Data';

function PhoneInfoDiv(props) {
  if (!props.oldPhoneInfo) {
    return null;
  }

  const maskedPhone = Utils.maskphone(props.oldPhoneInfo.phoneNumber);

  return (
    <div>
      Phone number: {props.oldPhoneInfo.countryCode} {maskedPhone}
      [{props.verified?'Verified':'Not verified'}]
    </div>
  );
}

export default class VerifyPhonePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      countryCode: '',
      phoneNumber: '',
      token: '',
      oldPhoneInfo: CurrentLogin.loginInfo ? CurrentLogin.loginInfo.blob.data.phone : null,
      verified: CurrentLogin.loginInfo ? CurrentLogin.loginInfo.phoneVerified : false,
    };
    this.handleSubmitSend = this.handleSubmitSend.bind(this);
    this.handleSubmitVerify = this.handleSubmitVerify.bind(this);
  }

  handleChange(name, event) {
    this.setState({ [name]: event.target.value });
  }

  handleSubmitSend(event) {
    console.log('Handle send verification code by sms');

    const oldPhoneNumber = this.state.oldPhoneInfo ? this.state.oldPhoneInfo.phoneNumber : null;
    const phoneNumber = this.state.phoneNumber ? this.state.phoneNumber : oldPhoneNumber;

    const oldCountryCode = this.state.oldPhoneInfo ? this.state.oldPhoneInfo.countryCode : null;
    const countryCode = this.state.countryCode ? this.state.countryCode : oldCountryCode;

    const phoneChanged = oldPhoneNumber !== phoneNumber || oldCountryCode !== countryCode;
    console.log(`old phone: (${oldCountryCode})${oldPhoneNumber}`);
    console.log(`new phone: (${countryCode})${phoneNumber}`);
    console.log(`phone changed: ${phoneChanged}`);

    if (phoneNumber && countryCode) {
      if (!phoneChanged && this.state.verified) {
        alert('Phone has been verified');
      } else {
        VaultClientDemo.sendPhoneVerificationCode(CurrentLogin.loginInfo,
                                                  countryCode,
                                                  phoneNumber,
                                                  CurrentLogin.username)
          .then((result) => {
            console.log('request phone token', result);
            CurrentLogin.loginInfo = result.loginInfo;
            alert('Success!');
          }).catch((err) => {
            console.error('Failed to send verification code by sms:', err);
            alert(`Failed to send verification code by sms: ${err.message}`);
          });
      }
    } else {
      alert('Missing country code / phone number');
    }
    event.preventDefault();
  }

  handleSubmitVerify(event) {
    console.log('Handle verify phone');
    const phone = {
      countryCode: this.state.countryCode,
      phoneNumber: this.state.phoneNumber,
    };

    if (phone.phoneNumber && phone.countryCode) {
      VaultClientDemo.verifyPhone(this.state.token,
                                  CurrentLogin.username,
                                  phone)
        .then((result) => {
          console.log('verify phone token:', result);
          return VaultClientDemo.updatePhone(CurrentLogin.username, CurrentLogin.username, CurrentLogin.password, CurrentLogin.loginInfo, phone);
        })
        .then((result) => {
          console.log('update phone:', result);
          CurrentLogin.loginInfo = result.loginInfo;
          this.setState({
            oldPhoneInfo: CurrentLogin.loginInfo.blob.data.phone,
            verified: CurrentLogin.loginInfo.phoneVerified,
          });
          alert('Success!');
        }).catch((err) => {
          console.error('Failed to verify phone:', err);
          alert(`Failed to verify phone: ${err.message}`);
        });
    } else {
      alert('Missing country code / phone number');
    }
    event.preventDefault();
  }

  render() {
    return (
      <div className="home">
        <h1>Send Verification Code</h1>
        <PhoneInfoDiv oldPhoneInfo={this.state.oldPhoneInfo} verified={this.state.verified} />
        <form onSubmit={this.handleSubmitSend}>
          <div>
            <label>
              Country code:
              <input type="text" value={this.state.countryCode} onChange={this.handleChange.bind(this, 'countryCode')} />
            </label>
            <label>
              Phone number:
              <input type="text" value={this.state.phoneNumber} onChange={this.handleChange.bind(this, 'phoneNumber')} />
            </label>
            <input type="submit" value="Send" />
          </div>
        </form>
        <form onSubmit={this.handleSubmitVerify}>
          <div>
            <label>
              Received token:
              <input type="text" value={this.state.token} onChange={this.handleChange.bind(this, 'token')} />
            </label>
            <input type="submit" value="Verify" />
          </div>
        </form>
        <Link to="/main">Back to main page</Link>
      </div>
    );
  }
}
