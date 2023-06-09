import googleLogo from '../images/google-logo.png'; // Replace with the path to your Google logo image
import "../Login.css"
import React, { useEffect, useState } from 'react';
import { collection, query, getDocs, doc, getDoc, where , onSnapshot} from 'firebase/firestore';
import { db, auth, provider } from '../firebase'; // Import your Firebase Firestore instance
import {signInWithPopup} from "firebase/auth"
import Title from "./Title";


const LoginPage = (props) => {
    const [data, setData] = useState([]);

    // Sign in. Set local storage email to "email"
    // if value is successful, trigger event
    const handleClick = (e) => {
      e.preventDefault(); 
      signInWithPopup(auth, provider)
        .then((data) => {
          localStorage.setItem("email", data.user.email);
          props.triggerEvent();
        })
        .catch((error) => {
          console.error("Error signing in: ", error);
        });
    };
    
  
    useEffect(() => {
      // Create a Firestore query for the "record" collection
      const q = query(collection(db, 'record'));
  
      // Subscribe to real-time updates using onSnapshot
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const records = querySnapshot.docs.map((doc) => doc.data());
  
        // Group records by uniName and calculate average currentPay
        const groupedData = records.reduce((acc, record) => {
          if (!acc[record.uniName]) {
            acc[record.uniName] = {
              uniName: record.uniName,
              currentPaySum: Number(record.currentPay),
              count: 1,
            };
          } else {
            acc[record.uniName].currentPaySum += Number(record.currentPay);
            acc[record.uniName].count += 1;
          }
          return acc;
        }, {});
        // Calculate average currentPay for each uniName
        const averages = Object.values(groupedData).map((group) => ({
          uniName: group.uniName,
          averageCurrentPay: parseInt(group.currentPaySum / group.count),
        }));
  
        // Sort averages by currentPay in descending order
        const sortedAverages = averages.sort(
          (a, b) => b.averageCurrentPay - a.averageCurrentPay
        );
  
        setData(sortedAverages);
      });
  
      // Unsubscribe from the query when the component unmounts
      return () => {
        unsubscribe();
      };
    }, []);  

    return (
      <div className="container">
      <h1 className="title">Rate My Uni</h1>
      <form className="login-form">
        <button className="google-button" onClick={handleClick}>
        <img src={googleLogo} alt="Google Logo" className="google-logo" />
          Login And Rate With Google
        </button>
      </form>

      <div className="query-results">
        <h2>University Rankings by Average Pay</h2>
        <table>
          <thead>
            <tr>
              <th>Index</th>
              <th>University Name</th>
              <th>Average Pay</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.uniName}>
                <td>{index + 1}</td>
                <td>{item.uniName}</td>
                <td>{item.averageCurrentPay}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LoginPage;