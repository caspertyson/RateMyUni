import "../Login.css"
import React, { useEffect, useState } from 'react';
import { collection, query , onSnapshot} from 'firebase/firestore';
import { db } from '../firebase'; 

const LoginPage = (props) => {
    const [data, setData] = useState([]);
    const [numUsers, setNumUsers] = useState("");

    const handleClick = () => {
      props.triggerEvent();
    };

    useEffect(() => {
      const q = query(collection(db, 'record'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {

        const records = querySnapshot.docs.map((doc) => doc.data());
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

        const averages = Object.values(groupedData).map((group) => ({
          uniName: group.uniName,
          averageCurrentPay: parseInt(group.currentPaySum / group.count),
        }));
  
        const sortedAverages = averages.sort(
          (a, b) => b.averageCurrentPay - a.averageCurrentPay
        );
  
        setData(sortedAverages);
      });

      const q1 = query(collection(db, 'testingAuth'));

      const unsubscribe1 = onSnapshot(q1, (querySnapshot) => {
        const numDocuments = querySnapshot.size;
        setNumUsers(numDocuments);
      });

      return () => {
        unsubscribe();
        unsubscribe1();
      };
    }, []);  

    return (
      <div className="container">
      <div className='header'>
        <h1 className="title">Rate My Uni</h1>
        <form className="login-form">
          <button className="google-button" onClick={handleClick}>
          <span className="button-text">Login And Rate! </span>
          </button>
        </form>
      </div>

      <div className="query-results">
        <h2>Find out which universities   <br></br> lead to higher-paying jobs!</h2>
        <h5>-- Note: Fake Data Currently --<br></br>Going Live at: 200 Users<br></br>Number of Users  = {numUsers + 87}</h5>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>University Name</th>
              <th>Average Ex-Students Salary</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.uniName}>
                <td>{index + 1}</td>
                <td>{item.uniName}</td>
                <td>{item.averageCurrentPay.toLocaleString("en-US")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LoginPage;