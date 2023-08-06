// SignIn.jsx
import React, { useState } from 'react';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import './SignIn.css';

const SignIn = () => {
  const navigate = useNavigate();
  const [usernameValue, setUsernameValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');

  const handleUsernameInputChange = (event) => {
    setUsernameValue(event.value);
    /* eslint-disable no-console */

    console.log('Username:', event.value);
  };

  const handlePasswordInputChange = (event) => {
    setPasswordValue(event.value);
    /* eslint-disable no-console */

    console.log('Password:', event.value);
  };

  const handleSignIn = async () => {
    if (!usernameValue || !passwordValue) {
      console.log('Both username and password must be filled out.');
      return;
    }

    try {
      const response = await axios.post('https://formen.onrender.com/login', {
        username: usernameValue,
        password: passwordValue,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      /* eslint-disable no-console */
      console.log('Response:', response);

      if (response.status === 200) {
        console.log('Login successful');
        navigate('/RDV');
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error('An error occurred during login:', error);
    }
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
