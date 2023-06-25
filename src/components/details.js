import React, { useEffect, useState } from 'react';
import { collection, query , where,getDocs} from 'firebase/firestore';
import { db } from '../firebase'; 

import unihat from '../images/uni_hat.png'
import uniImage from '../images/University.jpg'
import "../Login.css"
import Rating from '@mui/material/Rating';
import SchoolIcon from '@mui/icons-material/School';
import { useParams } from 'react-router-dom';
import { BrowserRouter as Router, Switch, Route, Routes, useNavigate  } from 'react-router-dom';

const DetailComponent = ({ onRowClick, triggerEvent }) => {
  const {id} = useParams();
  const [queryData, setQueryData] = useState([]);
  const[average, setAverages] = useState([])
  const navigate = useNavigate();

  const calculateAverage = (array, property) => {
    const values = array.map((item) => parseFloat(item[property]));
    const sum = values.reduce((acc, val) => acc + val, 0);
    const average = sum / values.length;
    return average;
  };
  const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const nth = function(d) {
    if (d > 3 && d < 21) return 'th';
    switch (d % 10) {
      case 1:  return "st";
      case 2:  return "nd";
      case 3:  return "rd";
      default: return "th";
    }
  }
  
  function toDateTime(secs) {
    var t = new Date(1970, 0, 1); // Epoch
    t.setSeconds(secs);
    
    return t.getDate().toString() + nth(t.getDate().toString()) + " " + month[(t.getMonth() + 1).toString()]
  }
  
  const handleRowClick = () => {
    // window.location.href = '/'
    navigate(`/`)
  };

  const handleClick = () => {
    // triggerEvent();
    // window.location.href = `/add-submission`
    navigate(`/add-submission`)
  };
  useEffect(() => {
    const ref = collection(db, 'reviews');
    const q = query(ref, where('uniName', '==', id), where('approved', '==', true));
    
    getDocs(q)
      .then((querySnapshot) => {
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push(doc.data());
        });

        const averages = {
          difficulty: calculateAverage(data, 'difficulty'),
          friends: calculateAverage(data, 'friends'),
          jobChances: calculateAverage(data, 'jobChances'),
          materialQuality: calculateAverage(data, 'materialQuality'),
          oneOnOneTime: calculateAverage(data, 'oneOnOneTime'),
          overallScore: calculateAverage(data, 'overall'),
        };
  
        setAverages(averages)
        setQueryData(data);
      })
      .catch((error) => {
        console.log('Error getting documents:', error);
      });
      window.scrollTo(0, 0)

    },[]);
  
  return (
    <div className="container">
        <div className='header'>
        <h1 onClick={handleRowClick} className="title">RateMy<span id="uniLogin">Uni</span><span id="conz">.co.nz</span></h1>
        <form className="login-form">
            <button type="button" className="review-button" onClick={handleClick}>
            <span className="button-text">Write a review </span>
            </button>
        </form>
        </div>
        <div id="banner">
        <img id="uniImage" src={uniImage}></img>
        <div id="bannerText"><div id="NZ">{id}</div> <div>Reviews</div></div>
        </div>
        <div id="UniDetails">
            <div>
              <div id="overallAverageScore">
                <h2>{id} Average Score </h2>
                <Rating name="size-large" size="large"
                  icon={<SchoolIcon style={{ fontSize: "50px" }}/>}
                  emptyIcon={<SchoolIcon style={{ fontSize: "50px" }}/>}
                  value={parseFloat(average.overallScore)} precision={0.1} readOnly/>            
              </div>
              <div id='averageScoreDetails'>
                <h3>{id} Score Details</h3>
                  <table id="averagesReviewTable">
                    <tr>
                      <td id='leftColumn'>Course difficulty:</td>
                      <td>
                      <span className='ratingAverageDetailsStars'><Rating name="size-small" size="small"
                      icon={<SchoolIcon style={{ fontSize: "30px" }}/>}
                      emptyIcon={<SchoolIcon style={{ fontSize: "30px" }}/>}
                      value={parseFloat(average.difficulty)} precision={0.1} readOnly/></span>
                      </td>
                    </tr>
                    <tr>
                      <td>Meeting people: </td>
                      <td>
                      <span className='ratingAverageDetailsStars'><Rating name="size-small" size="small"
                      icon={<SchoolIcon style={{ fontSize: "30px" }}/>}
                      emptyIcon={<SchoolIcon style={{ fontSize: "30px" }}/>}
                      value={parseFloat(average.friends)} precision={0.1} readOnly/></span>
                      </td>
                    </tr>
                    <tr>
                      <td>Job chances: </td>
                      <td>
                      <span className='ratingAverageDetailsStars'><Rating name="size-small" size="small"
                      icon={<SchoolIcon style={{ fontSize: "30px" }}/>}
                      emptyIcon={<SchoolIcon style={{ fontSize: "30px" }}/>}
                      value={parseFloat(average.jobChances)} precision={0.1} readOnly/></span>
                      </td>
                    </tr>
                    <tr>
                      <td>Lecture quality: </td>
                      <td>
                      <Rating name="size-small" size="small"
                      icon={<SchoolIcon style={{ fontSize: "30px" }}/>}
                      emptyIcon={<SchoolIcon style={{ fontSize: "30px" }}/>}
                      value={parseFloat(average.materialQuality)} precision={0.1} readOnly/>
                      </td>
                    </tr>
                    <tr>
                      <td>One on one time:</td>
                      <td>
                      <Rating name="size-small" size="small"
                      icon={<SchoolIcon style={{ fontSize: "30px" }}/>}
                      emptyIcon={<SchoolIcon style={{ fontSize: "30px" }}/>}
                      value={parseFloat(average.oneOnOneTime)} precision={0.1} readOnly/>
                      </td>
                    </tr>

                  </table>
                  <button id="writeReview" type="button" onClick={handleClick}>Write a review</button>
              </div>
              <div id='browseRatings'>
                <h3 >Student Reviews ({queryData.length})</h3>
                <div>
                  {queryData.map((item, index) => (
                      <div className="review" key={index}>
                        <div className='userIndividualRating'> 
                        <Rating name="size-small" size="small"
                          icon={<SchoolIcon style={{ fontSize: "25px" }}/>}
                          emptyIcon={<SchoolIcon style={{ fontSize: "25px" }}/>}
                          value={parseFloat(item.overall.toLocaleString("en-US"))} precision={0.1} readOnly/>
                          </div><label>{item.course } </label>
                          <div className='dateReview'> {toDateTime(item.date.seconds)}</div>
                        <div className='notes'>{item.notes}</div>
                      <table id='reviewTable'>
                        <tbody>
                          <tr>
                            <td id='leftColumn'>
                            Course difficulty:
                            </td>
                            <td>
                            <span className='ratingsStars'><Rating name="size-small" size="small"
                              icon={<SchoolIcon fontSize="20px"/>}
                              emptyIcon={<SchoolIcon fontSize="20px"/>}
                              value={parseFloat(item.difficulty.toLocaleString("en-US"))} precision={0.1} readOnly/></span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                            Meeting people: 
                            </td>
                            <td>
                            <span className='ratingsStars'><Rating name="size-small" size="small"
                              icon={<SchoolIcon fontSize="20px"/>}
                              emptyIcon={<SchoolIcon fontSize="20px"/>}
                              value={parseFloat(item.friends.toLocaleString("en-US"))} precision={0.1} readOnly/>
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                            Job chances: 
                            </td>
                            <td>
                            <span className='ratingsStars'><Rating name="size-small" size="small"
                              icon={<SchoolIcon fontSize="20px"/>}
                              emptyIcon={<SchoolIcon fontSize="20px"/>}
                              value={parseFloat(item.jobChances.toLocaleString("en-US"))} precision={0.1} readOnly/>
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                            Lecture quality: 
                            </td>
                            <td>
                            <span className='ratingsStars'><Rating name="size-small" size="small"
                              icon={<SchoolIcon fontSize="20px"/>}
                              emptyIcon={<SchoolIcon fontSize="20px"/>}
                              value={parseFloat(item.materialQuality.toLocaleString("en-US"))} precision={0.1} readOnly/>
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td>One on one time: </td>
                            <td>
                              <span className='ratingsStars'><Rating name="size-small" size="small"
                                icon={<SchoolIcon fontSize="20px"/>}
                                emptyIcon={<SchoolIcon fontSize="20px"/>}
                                value={parseFloat(item.oneOnOneTime.toLocaleString("en-US"))} precision={0.1} readOnly/>
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              </div>
            </div>
        </div>
        <footer>
        <div id="footer">
          <h1 onClick={handleRowClick} className="title">RateMy<span id="uniLogin">Uni</span><span id="conz">.co.nz</span></h1>
        </div>

        </footer>

    </div>
  );
};

export default DetailComponent;
