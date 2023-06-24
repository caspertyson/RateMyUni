import React, { useEffect, useState } from 'react';
import { collection, query , where,getDocs, deleteDoc, doc, updateDoc} from 'firebase/firestore';
import { db } from '../firebase'; 
import "../Login.css"
import Rating from '@mui/material/Rating';
import SchoolIcon from '@mui/icons-material/School';

const ApproveOrDelete = ({trigger}) => {
    const [toApprove, setToApprove] = useState([])
    useEffect(() => {
        const fetchDocument = async () => {
          try {
            const ref = collection(db, 'testingAuth');
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
        const ref = doc(db, "testingAuth", id)
        await updateDoc(ref, {approved: true})

        console.log("approved doc")
        setToApprove((prevDocuments) =>
            prevDocuments.filter((doc) => doc.id !== id)
        );
      }

      const DeleteReview = async (id) => {
        const docRef = doc(db, "testingAuth", id);
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
                        <div className='otherRatings'>Course difficulty: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className='ratingsStars'><Rating name="size-small" size="small"
                          icon={<SchoolIcon fontSize="20px"/>}
                          emptyIcon={<SchoolIcon fontSize="20px"/>}
                          value={parseFloat(item.difficulty.toLocaleString("en-US"))} precision={0.1} readOnly/></span>
                        </div>
                        <div className='otherRatings'>Ease of meeting new people: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className='ratingsStars'><Rating name="size-small" size="small"
                          icon={<SchoolIcon fontSize="20px"/>}
                          emptyIcon={<SchoolIcon fontSize="20px"/>}
                          value={parseFloat(item.friends.toLocaleString("en-US"))} precision={0.1} readOnly/></span>
                        </div>
                        <div className='otherRatings'>Job chances with degree: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className='ratingsStars'><Rating name="size-small" size="small"
                          icon={<SchoolIcon fontSize="20px"/>}
                          emptyIcon={<SchoolIcon fontSize="20px"/>}
                          value={parseFloat(item.jobChances.toLocaleString("en-US"))} precision={0.1} readOnly/></span>
                        </div>
                        <div className='otherRatings'>Lecture material quality: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className='ratingsStars'><Rating name="size-small" size="small"
                          icon={<SchoolIcon fontSize="20px"/>}
                          emptyIcon={<SchoolIcon fontSize="20px"/>}
                          value={parseFloat(item.materialQuality.toLocaleString("en-US"))} precision={0.1} readOnly/></span>
                        </div>
                        <div className='otherRatings'>One on one time with lecturers/tutors: <span className='ratingsStars'><Rating name="size-small" size="small"
                          icon={<SchoolIcon fontSize="20px"/>}
                          emptyIcon={<SchoolIcon fontSize="20px"/>}
                          value={parseFloat(item.oneOnOneTime.toLocaleString("en-US"))} precision={0.1} readOnly/></span>
                        </div>
                        <div><b>Email: </b> {item.email}</div>
                        <div><b>Uni: </b> {item.uniName}</div>
                        <div><b>ID: </b> {item.id}</div>
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