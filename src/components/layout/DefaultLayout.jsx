import React, { useState } from 'react';
import CustomNavbar from '../navBar';
import Login from '../../pages/auth/login';
import SignUp from '../../pages/auth/signup';
import VerifyEmail from '../../pages/auth/VerifyEmail';

const DefaultLayout = ({ children }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showVerifyEmail, setShowVerifyEmail] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <div className="max-w-7.5xl mx-auto px-4 py-4">
        <CustomNavbar 
          onLoginClick={() => setShowLogin(true)} 
          onSignUpClick={() => setShowSignUp(true)} 
        />
        {children}

        {/* Render modals conditionally */}
        {showLogin && (
          <Login 
            onClose={() => setShowLogin(false)} 
            onSignUpClick={() => {
              setShowLogin(false);
              setShowSignUp(true);
            }} 
          />
        )}
        {showSignUp && (
          <SignUp 
            onClose={() => setShowSignUp(false)} 
            onLoginClick={() => {
              setShowSignUp(false);
              setShowLogin(true);
            }}
            onShowVerifyEmail={() => {
              setShowSignUp(false);
              setShowVerifyEmail(true);
            }}
          />
        )}
        {showVerifyEmail && (
          <VerifyEmail 
            onClose={() => setShowVerifyEmail(false)} 
          />
        )}
      </div>
    </div>
  );
};

export default DefaultLayout;