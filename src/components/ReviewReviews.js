import React, { useState } from 'react';
import "../Email.css"
import { getAuth, sendSignInLinkToEmail } from "firebase/auth";
import unihat from '../images/uni_hat.png'
import { db } from "../firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import ApproveOrDelete from "./ApproveOrDelete"


const ReviewReviews = ({triggerEvent}) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [login, setLogin] = useState(false)

    const onLogin = () => { 
        console.log("Email: " + email)
        console.log("Password: " + password)
        const fetchPassword = async () => {
            try {
                const q = query(collection(db, 'Admin'), where('Email', '==', email));
                const querySnapshot = await getDocs(q);
      
              if (!querySnapshot.empty) {
                const documentData = querySnapshot.docs[0].data();
                if(documentData.Password == password){
                    setLogin(true);
                }else{
                    window.alert('Wrong Password Or Email');
                }
                console.log("Password: " + documentData.Password)
              } else {
                window.alert('Wrong Password Or Email');
            }
            } catch (error) {
                window.alert('Error fetching password:', error);
            }
        };
        fetchPassword();
    }

    const onBack = () => {
        setLogin(false);
        triggerEvent()
    }
    const handleEmail = (e) => {
        setEmail(e.target.value);
    };
    const handlePassword = (e) => {
        setPassword(e.target.value);
    }


  return (
    <div id='emailContainer'>
      {
        login ? <ApproveOrDelete trigger={onBack}/>
        :
        <div>
            <div className='header'>
            <h1 className="title">RateMy<span id="uniLogin">Uni</span><span id="conz">.co.nz</span></h1>
            </div>
            <div className='main'>
                <h2 id='emailTitel'>Email</h2>
                <input id='emailInput'
                    autoCapitalize='none'
                    type="text"
                    placeholder="example@example.com"
                    value={email}
                    onChange={handleEmail}
                />
                <div></div>
                <br></br>
                <br></br>
                <h2 id='emailTitel'>Password</h2>
                <input id='emailInput'
                    type="text"
                    placeholder="password"
                    value={password}
                    onChange={handlePassword}
                />
                <button type="button" id='goBackButton' onClick={onBack}>Go Back</button>
                <button type="button" id='emailButton' onClick={onLogin}>Login</button>
            </div>
            <footer id='emailFooter'>
            <div id="emailFooterDiv">
                <h1 className="title">RateMy<span id="uniLogin">Uni</span><span id="conz">.co.nz</span></h1>
            </div>
            </footer>
        </div>
      }
    </div>
  );
};
export default ReviewReviews;