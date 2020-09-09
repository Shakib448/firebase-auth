import React, { useState } from 'react';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig)

function App() {

  const provider = new firebase.auth.GoogleAuthProvider();

  const [newUserInfo, setNewUserInfo] = useState(false)

  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    photo: '',
    password: '',
    error: ''
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
        photo: '',
        error: '',
        success: false
      }
      setUser(signOutUser);
    } catch (error) {
      console.log(error)
    }
  }

  // This method you have write this type 
  const handleSubmit = (e) => {

    if (newUserInfo && user.email && user.password) {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then(res => {
          const newUser = { ...user };
          newUser.error = ''
          newUser.success = true;
          setUser(newUser)
          console.log(res);
        }).catch(error => {
          const newUser = { ...user };
          newUser.error = error.message;
          newUser.success = false;
          setUser(newUser)
        })
    }

    if (!newUserInfo && user.email && user.password) {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(res => {
          const newUser = { ...user };
          newUser.error = ''
          newUser.success = true;
          setUser(newUser)
          console.log(res);
        }).catch(error => {
          const newUser = { ...user };
          newUser.error = error.message;
          newUser.success = false;
          setUser(newUser)
        })

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
      <input type="checkbox" onChange={() => setNewUserInfo(!newUserInfo)} name="newUserInfo" id="" />
      <label htmlFor="newUserInfo">New User Sign Up</label>
      <form onSubmit={handleSubmit}>
        {newUserInfo && <input type="text" name='name' placeholder="name" onBlur={handleChange} required />} <br />
        <input type="email" name='email' onBlur={handleChange} placeholder="Your email address" required /> <br />
        <input type="password" name="password" onBlur={handleChange} placeholder="Your password" required />
        <br />
        <input type="submit" value="Submit" />
      </form>
      <p style={{ color: 'red' }}>  {user.error} </p>
      {user.success && <p style={{ color: 'green' }}>  User {newUserInfo ? 'created' : 'Logged In'} successfully </p>}
    </div>
  );
}

export default App;
