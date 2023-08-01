import React, { useState } from 'react';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs/textbox';
import './SignIn.css';

const SignIn = () => {
  const [usernameValue, setUsernameValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');

  // Handle username input change
  const handleUsernameInputChange = (event) => {
    setUsernameValue(event.target.value);
  };

  // Handle password input change
  const handlePasswordInputChange = (event) => {
    setPasswordValue(event.target.value);
  };

  // Handle sign in button click
  const handleSignIn = () => {
    // Insert authentication logic here
    // eslint-disable-next-line no-console
    console.log('Username: , Password: ');
  };

  return (
    <div className="modal">
      <div className="signin-container">
        <h2>Connexion</h2>
        <TextBoxComponent
          name="username"
          placeholder="Nom d'utilisateur"
          floatLabelType="Auto"
          value={usernameValue}
          change={handleUsernameInputChange}
        />
        <TextBoxComponent
          name="password"
          type="password"
          placeholder="Mot de passe"
          floatLabelType="Auto"
          value={passwordValue}
          change={handlePasswordInputChange}
        />
        <button className="btn" type="button" onClick={handleSignIn}>Se connecter</button>
      </div>
    </div>
  );
};

export default SignIn;
