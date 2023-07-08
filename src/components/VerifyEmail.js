import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const EmailVerification = () => {
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [verificationSent, setVerificationSent] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, [auth]);

  const sendVerificationEmail = () => {
    if (user) {
      user.sendEmailVerification()
        .then(() => {
          setVerificationSent(true);
        })
        .catch((error) => {
          console.error('Error sending verification email:', error);
        });
    }
  };

  return (
    <div>
      <h1>Welcome to My App</h1>
      {user && !user.emailVerified && (
        <div>
          <p>
            Your email ({user.email}) is not verified.
            {verificationSent ? ' Verification email sent.' : ''}
          </p>
          {!verificationSent && (
            <button onClick={sendVerificationEmail}>
              Send Verification Email
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmailVerification;
