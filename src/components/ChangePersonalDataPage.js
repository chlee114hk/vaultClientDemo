import React from 'react';
import { Link } from 'react-router';
import { VaultClient } from '../logics';
import { CurrentLogin } from './Data';
import AsyncButton from './common/AsyncButton';

function PersonalDataForm(props) {
  const self = props.self;
  return (
    <form>
      <div>
        <label>
          First Name: 
          <input type="text" value={self.state.firstName} onChange={self.handleChange.bind(self, 'firstName')} />
        </label>
        <label>
          Last Name: 
          <input type="text" value={self.state.lastName} onChange={self.handleChange.bind(self, 'lastName')} />
        </label>
      </div>
      <AsyncButton
        type="button"
        onClick={self.handleSubmitForm}
        pendingText="Updating..."
        fulFilledText="Updated"
        rejectedText="Failed! Try Again"
        text="Update"
      />
    </form>
  );
}

export default class ChangePersonalDataPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
    };
    this.handleSubmitForm = this.handleSubmitForm.bind(this);
  }

  handleSubmitForm() {
    const username = CurrentLogin.loginInfo.username;

    // update blob
    const blob = CurrentLogin.loginInfo.blob;
    blob.data.firstName = this.state.firstName;
    blob.data.lastName = this.state.lastName;
    
    return VaultClient.updateBlob(username, CurrentLogin.loginInfo)
      .then((result) => {
        console.log('update blob:', result);
        CurrentLogin.loginInfo = result.loginInfo;
        alert('Updated!');
        return Promise.resolve();
      }).catch(err => {
        console.error('Failed to update blob:', err);
        alert('Failed to update: ' + err.message);
        return Promise.reject(err);
      });
  }

  handleChange(name, event) {
    this.setState({[name]: event.target.value});
  }

  render() {
    return (
      <div className="home">
        <h1>Update Personal Data</h1>
        <PersonalDataForm self={this} />
        <Link to="/main">Back to main page</Link>
      </div>
    );
  }
}
