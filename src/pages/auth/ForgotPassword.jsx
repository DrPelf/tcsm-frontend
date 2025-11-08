import React, { useState } from 'react';
import VerificationCode from './VerificationCode';

const ForgotPassword = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    //  sending verification code to email
    setMessage('Reset code has been sent to your email');
    setShowVerification(true);
  };

  if (showVerification) {
    return <VerificationCode onClose={onClose} email={email} />;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#666639] bg-white hover:underline text-md"
        >
          ✕
        </button>
        <div className="text-center mb-6 md:mb-8">
          <img 
            src="src/assets/logo.png" 
            alt="Turtle Conservation Society" 
            className="h-10 md:h-12 mx-auto mb-2"
          />
          <h1 className="text-3xl md:text-4xl font-serif text-[#666639] mb-4">Forgot Password</h1>
          <p className="text-gray-600">
            Enter your email and we'll send you a code to reset your password
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-600 text-lg mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#666639]"
              required
              placeholder="Enter your email"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-[#666639] text-white rounded-lg hover:bg-[#4D6A4D] transition-colors"
          >
            Send Reset Code
          </button>
        </form>

        {message && (
          <div className="mt-4 text-center text-green-600">
            {message}
          </div>
        )}

        <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className="text-[#666639] bg-white hover:underline"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

