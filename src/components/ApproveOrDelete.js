import React, { useEffect, useState } from 'react';
import { collection, query , where,getDocs, deleteDoc, doc, updateDoc} from 'firebase/firestore';
import { db } from '../firebase'; 
import "../Login.css"
import Rating from '@mui/material/Rating';
import SchoolIcon from '@mui/icons-material/School';
import { TableBar } from '@mui/icons-material';

const ApproveOrDelete = ({trigger}) => {
    const [toApprove, setToApprove] = useState([])
    useEffect(() => {
  
        const fetchDocument = async () => {
          try {
            const ref = collection(db, 'reviews');
            const q = query(ref, where('approved', '==', false));
            getDocs(q)
            .then((querySnapshot) => {
              const data = [];
                querySnapshot.forEach((doc) => {
                    data.push({
                    id: doc.id,
                    ...doc.data(),
                    });
                });
                setToApprove(data);
            })
            } catch (error) {
            console.error('Error fetching document:', error);
          }
        };
        fetchDocument();
  
      }, []);

      const ApproveReview = async (id) => {
        const ref = doc(db, "reviews", id)
        await updateDoc(ref, {approved: true})

        console.log("approved doc")
        setToApprove((prevDocuments) =>
            prevDocuments.filter((doc) => doc.id !== id)
        );
      }

      const DeleteReview = async (id) => {
        const docRef = doc(db, "reviews", id);
        deleteDoc(docRef).then(() => {
            console.log("Entire Document has been deleted successfully.")
        })
        .catch(error => {
            console.log(error);
        })
        setToApprove((prevDocuments) =>
            prevDocuments.filter((doc) => doc.id !== id)
        );
      }
      const handleReturn = () => {
        trigger()
      }

    return (
        <div id='emailContainer'>
            <div>
                <div className='header'>
                <h1 className="title">RateMy<span id="uniLogin">Uni</span><span id="conz">.co.nz</span></h1>
                </div>

                <div id='approveContainer'>
                    {toApprove.map((item,index) => (
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
                            <td>
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
                            Meeting new people: 
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
                      <div><b>Email: </b> {item.email}</div>
                      <div><b>Uni: </b> {item.uniName}</div>
                      <div><b>ID: </b> {item.id}</div>
                      <div><b>Verified Student: </b> {item.verifiedUniStudent && "True"}</div>
                      <div><b>Referral Code: </b> {item.referralCode}</div>

                      <button onClick={() => ApproveReview(item.id)}>Approve</button>
                      <button onClick={() => DeleteReview(item.id)}>Delete</button>

                      </div>
                      ))
                    }</div>
                <div id='divButtonReturnToRankings'>
                  <button type="button" id="returnToRankings" onClick={handleReturn}> Return to Rankings</button>
                </div>


                <footer id='emailFooter'>
                    <div id="emailFooterDiv">
                        <h1 className="title">RateMy<span id="uniLogin">Uni</span><span id="conz">.co.nz</span></h1>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default ApproveOrDelete;