import React, { useState } from 'react';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig)

function App() {

  const provider = new firebase.auth.GoogleAuthProvider();

  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    photo: '',
    password: ''
  })

  const handleSingIn = async () => {

    try {
      const auth = await firebase.auth().signInWithPopup(provider);
      const { displayName, photoURL, email } = auth.user;
      console.log(displayName, email, photoURL);

      const singedInUser = {
        isSignedIn: true,
        name: displayName,
        email: email,
        photo: photoURL,
      }
      setUser(singedInUser);

    } catch (error) {
      console.log(error);

    }
  }

  // I delete the firebase app this is the method you can easily do that login and log out 

  const handleSignOut = async () => {
    try {
      await firebase.auth().signOut()
      const signOutUser = {
        isSignedIn: false,
        name: '',
        email: '',
        photo: ''
      }
      setUser(signOutUser);
    } catch (error) {
      console.log(error)
    }
  }


  const handleSubmit = (e) => {
    console.log(user.email, user.password)

    if (user.email && user.password) {
      console.log("Submitting")
    }
    e.preventDefault();
  }


  const handleChange = (e) => {
    let isValid = true;
    // console.log(e.target.name, e.target.value)
    if (e.target.name === 'email') {
      const re = /\S+@\S+\.\S+/;
      isValid = re.test(e.target.value);

    }
    if (e.target.name === 'password') {
      const isPasswordValid = e.target.value.length > 6
      const passwordHasNumber = /\d{1}/.test(e.target.value);
      isValid = passwordHasNumber && isPasswordValid;
    }
    if (isValid) {
      const newUser = { ...user };
      newUser[e.target.name] = e.target.value;
      setUser(newUser);
    }
  }

  return (
    <div className="App">

      {
        user.isSignedIn ? <button onClick={handleSignOut}>Sign Out</button> : <button onClick={handleSingIn}>Sign In</button>
      }
      {
        user.isSignedIn && <div>
          <p>Welcome, {user.name} </p>
          <p>Your email : {user.email} </p>
          <img src={user.photo} alt="" />
        </div>
      }

      <h1>Our Won Authentication </h1>

      <form onSubmit={handleSubmit}>
        <input type="text" name='name' placeholder="name" onBlur={handleChange} required /> <br />
        <input type="email" name='email' onBlur={handleChange} placeholder="Your email address" required /> <br />
        <input type="password" name="password" onBlur={handleChange} placeholder="Your password" required />
        <br />
        <input type="submit" value="Submit" />
      </form>

    </div>
  );
}

export default App;
