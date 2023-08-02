import React, { useState } from 'react';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs/textbox';
import './SignIn.css';
import axios from 'axios';

const SignIn = () => {
  const [usernameValue, setUsernameValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');

  // Handle username input change
  const handleUsernameInputChange = (event) => {
    setUsernameValue(event.target.value);
    console.log('Username:', event.target.value);
  };
  
  const handlePasswordInputChange = (event) => {
    setPasswordValue(event.target.value);
    console.log('Password:', event.target.value);
  };
  

  // Handle sign in button click
  // Handle sign in button click
// Handle sign in button click
const handleSignIn = async () => {
  console.log('Signing in with:', usernameValue, passwordValue);
  try {
    const response = await axios.post('http://localhost:3000/login', {
      username: usernameValue,
      password: passwordValue,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    
    if (response.status === 200) {
      // Store the access token somewhere (e.g. localStorage)
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      // Do something after successful login (e.g. redirect to a different page)
    } else {
      // Handle error (e.g. display error message)
      console.error(response.data.message);
    }
  } catch (error) {
    console.error(error);
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