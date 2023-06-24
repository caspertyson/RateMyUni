import React, { useEffect, useState } from 'react';
import { collection, query , where,getDocs} from 'firebase/firestore';
import { db } from '../firebase'; 

import unihat from '../images/uni_hat.png'
import uniImage from '../images/University.jpg'
import "../Login.css"
import Rating from '@mui/material/Rating';
import SchoolIcon from '@mui/icons-material/School';

const DetailComponent = ({ message, onRowClick, triggerEvent }) => {
  const [queryData, setQueryData] = useState([]);
  const[average, setAverages] = useState([])

  const calculateAverage = (array, property) => {
    const values = array.map((item) => parseFloat(item[property]));
    const sum = values.reduce((acc, val) => acc + val, 0);
    const average = sum / values.length;
    return average;
  };

  const handleRowClick = () => {
    onRowClick();
  };
  const handleClick = () => {
    triggerEvent();
  };
  useEffect(() => {
    const ref = collection(db, 'reviews');
    const q = query(ref, where('uniName', '==', message.uniName), where('approved', '==', true));
    
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
        <div id="bannerText"><div id="NZ">{message.uniName}</div> <div>Reviews</div></div>
        </div>
        <div id="UniDetails">
            <div id='divButtonReturnToRankings'>
              <button type="button" id="returnToRankings" onClick={handleRowClick}> Return to Rankings</button>
            </div>
            <div>
              <div id="overallAverageScore">
                <h2>{message.uniName} Average Score </h2>
                <Rating name="size-large" size="large"
                  icon={<SchoolIcon style={{ fontSize: "50px" }}/>}
                  emptyIcon={<SchoolIcon style={{ fontSize: "50px" }}/>}
                  value={parseFloat(message.averageOverallScore.toLocaleString("en-US"))} precision={0.1} readOnly/>            
              </div>
              <div id='averageScoreDetails'>
                <h3>{message.uniName} Score Details</h3>
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
                <h3 >Student Reviews ({message.count})</h3>
                <div>
                  {queryData.map((item, index) => (
                      <div className="review" key={index}>
                        <label>Today <span className='userIndividualRating'> 
                        <Rating name="size-small" size="small"
                          icon={<SchoolIcon fontSize="20px"/>}
                          emptyIcon={<SchoolIcon fontSize="20px"/>}
                          value={parseFloat(item.overall.toLocaleString("en-US"))} precision={0.1} readOnly/>
                          </span></label>
                          <div className='courseChoice'> {item.course}</div>
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
                <div id='divButtonReturnToRankings'>
                  <button type="button" id="returnToRankings" onClick={handleRowClick}> Return to Rankings</button>
                </div>

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
