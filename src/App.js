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
    photo: ''
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

  const handleSignOut = async() => {
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
    </div>
  );
}

export default App;
