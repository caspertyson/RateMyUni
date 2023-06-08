import googleLogo from '../images/google-logo.png'; // Replace with the path to your Google logo image
import "../Login.css"
import React, { useEffect, useState } from 'react';
import { collection, query, getDocs, doc, getDoc, where } from 'firebase/firestore';
import { db } from '../firebase'; // Import your Firebase Firestore instance



const LoginPage = (props) => {
    const handleClick = () => {
        props.triggerEvent(); // Invoke the callback function from props
    };

    const [uniNames, setUniNames] = useState([]);
    const [selectedUniName, setSelectedUniName] = useState('');
  
    useEffect(() => {
      const fetchUniNames = async () => {
        try {
          const q = query(collection(db, 'record')); // Replace 'todos' with the actual collection name
          const querySnapshot = await getDocs(q);
          const uniqueUniNames = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            const { uniName } = data;
  
            if (uniName && !uniqueUniNames.includes(uniName)) {
              uniqueUniNames.push(uniName);
            }
          });
          setUniNames(uniqueUniNames);
        } catch (error) {
          console.error('Error fetching uni names: ', error);
        }
      };
  
      fetchUniNames();
    }, []);
  
    const handleUniNameChange = (event) => {
      setSelectedUniName(event.target.value);
    };
  

    return (
    <div className="container">
      <h1>Rate My Uni</h1>
      <form className="login-form">
        <button className="google-button" onClick={handleClick}>
          <img src={googleLogo} alt="Google Logo" className="google-logo" />
          Login with Google
        </button>
      </form>

      <h2>Select Uni</h2>
      <label htmlFor="uniName">Select Uni Name:</label>
      <select id="uniName" value={selectedUniName} onChange={handleUniNameChange}>
        <option value="">-- Select Uni Name --</option>
        {uniNames.map((uniName) => (
          <option key={uniName} value={uniName}>
            {uniName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LoginPage;