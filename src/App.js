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
import Image from "./components/image"
import ReviewReviews from "./components/ReviewReviews"
import StudentAmbassador from "./components/StudentAmbassador"

import { getAuth, isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { BrowserRouter as Router, Switch, Route, Routes, useNavigate  } from 'react-router-dom';
import { collection, query , where,getDocs, deleteDoc, doc, updateDoc} from 'firebase/firestore';
import { db } from './firebase'; 

function App() {
  const [addSub, setAddSub] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState(false)
  const [selectedRow, setSelectedRow] = React.useState(null);
  const [showUni, setShowUni] = React.useState(false)
  const [login, setLogin] = React.useState(false)
  const navigate = useNavigate();
  const handleOnClick = (rowData) => navigate(`/detail/${rowData.uniName}`);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    window.scrollTo(0, 0)
    const fetchData = async (email) => {
      try {
        const reviewsRef = collection(db, 'reviews');
        const q = query(reviewsRef, where('email', '==', email));
        const querySnapshot = await getDocs(q);

        const document = querySnapshot.docs[0];

        await updateDoc(doc(db, 'reviews', document.id), {
          verifiedUniStudent: true
        });
        console.log('verifiedUniStudent updated successfully!');
      } catch (error) {
        console.error('Error updating document:', error);
      }
    };

    const auth = getAuth();
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        email = window.prompt('Please type in your email for confirmation');
        window.localStorage.setItem('emailForSignIn', email)
      }
      signInWithEmailLink(auth, email, window.location.href)
        .then((result) => {
          fetchData(email);
          setIsOpen(true)
          navigate('/')
          console.log("sign in with link from email success!")
          setUserEmail(true)
        })
        .catch((error) => {
          window.alert("Link is not valid, try again")
          console.log(error)
        });
    }
  }, []);

  const triggerAddSub = () => {
    setAddSub(!addSub)
  };
  const addedSubmission = () => {
    setUserEmail(false)
  }
  const handleRowClick = (rowData) => {
    if(rowData){
      setSelectedRow(rowData);
    }
    // window.location.href = `/detail/${rowData.uniName}`;
    handleOnClick(rowData)
  };
  const showLogin = () => {
    setLogin(!login)
  }
  const closePopDown = () => {
    setIsOpen(false)
  }

  
  return (
      <div className="App">
      {isOpen && (
      <div className={`pop-down ${isOpen ? "open" : ""}`} >
        <h2 className="pop-down-title">Thank You For Your Submission!</h2>
        <button id='closePopDown' onClick={closePopDown}>Take Me Home</button>
        </div>
      )}
        <Routes>
          <Route path="/" element={<Login login={showLogin} triggerEvent={triggerAddSub} onRowClick={handleRowClick}/>} />
          <Route path="/detail/:id" element={<DetailComponent message={selectedRow} onRowClick={handleRowClick} triggerEvent={triggerAddSub}/>} />
          <Route path="/add-submission" element={<AddSubmission />} />
          <Route path="/review-reviews" element={<ReviewReviews />} />
          <Route path="/ambassador" element={<StudentAmbassador />} />
        </Routes>
      </div>

    // <div className="App">      
    //   {login? <ReviewReviews triggerEvent={showLogin}/>
    //   :addSub ? <AddSubmission triggerEvent={triggerAddSub}/>:
    //   !showUni ? <Login login={showLogin} triggerEvent={triggerAddSub} onRowClick={handleRowClick}/>
    //   : <DetailComponent message={selectedRow} onRowClick={handleRowClick} triggerEvent={triggerAddSub}/>}
    // </div>
  );
}
export default App;