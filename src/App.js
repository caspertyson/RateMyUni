import "./App.css";
import React from "react";
import Login from "./components/Login";
import Email from "./components/Email"
import Test from "./components/submissionTest"
import AddSubmission from "./components/AddSubmission";
import FourOhFour from "./components/404"
import Main from "./components/Main"
import DetailComponent from "./components/details"
import TestKiwis from "./components/testKiwis"

import { getAuth, isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";

function App() {
  const [login, setLogin] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState(false)
  const [selectedRow, setSelectedRow] = React.useState(null);
  const [showUni, setShowUni] = React.useState(false)

  React.useEffect(() => {
    const auth = getAuth();
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        email = window.prompt('Please type in your email for confirmation');
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
  const handleRowClick = (rowData) => {
    if(rowData){
      setSelectedRow(rowData);
    }
    setShowUni(!showUni)
  };
  
  return (
    <div className="App">      
      {login ? <Email triggerEvent={loginEvent}/>:
      userEmail ? <AddSubmission triggerEvent={addedSubmission}/>:
      !showUni ? <Login triggerEvent={loginEvent} onRowClick={handleRowClick}/>
      : <DetailComponent message={selectedRow} onRowClick={handleRowClick} triggerEvent={loginEvent}/>}
      {/* <AddSubmission triggerEvent={addedSubmission}/> */}
    </div>
  );
}
export default App;