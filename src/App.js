import "./App.css";
import React from "react";
import AddSubmission from "./components/AddSubmission";
import Login from "./components/Login";
import Email from "./components/Email"
import Test from "./components/submissionTest"

import Main from "./components/Main"
import { getAuth, isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";

function App() {
  const [login, setLogin] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState(false)

  React.useEffect(() => {
    const auth = getAuth();
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        email = window.prompt('Please provide your email for confirmation');
        window.localStorage.setItem('emailForSignIn', email)
      }
      signInWithEmailLink(auth, email, window.location.href)
        .then((result) => {
          console.log("sign in with link from email success!")
          setUserEmail(true)
        })
        .catch((error) => {
          window.alert("Link is not valid, try again")
          console.log(error)
        });
    }
  }, []);

  const loginEvent = () => {
    setLogin(!login)
  };
  const addedSubmission = () => {
    setUserEmail(false)
  }
  return (
    <div className="App">      
      {userEmail ? <AddSubmission triggerEvent={addedSubmission}/>
      : !login ? (<Main triggerEvent={loginEvent}/>) : 
      (<Email triggerEvent={loginEvent}/>)
      }
    </div>
  );
}
export default App;