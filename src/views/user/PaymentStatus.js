import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RightImage from '../../image/right-icon.png';
import ErrorImage from '../../image/cross2.png';
import Button from '../../component/CustomButton';

const PaymentStatusPage = () => {
  const { status } = useParams();
  const navigate = useNavigate();

  const isSuccess = status === 'success';

  const handleSuccessClick = () => {
    navigate("/u/menu");
  };

  const handleFailureClick = () => {
    navigate('/u/order-history');
  };

  const now = new Date();
  const formattedDate = now.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const formattedTime = now.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className='payment-status-wrapper'>
      <div className={`payment-status ${isSuccess ? 'success' : 'failed'}`}>
        <div className="status-icon-container">
          <img src={isSuccess ? RightImage : ErrorImage} alt={isSuccess ? 'Success' : 'Failed'} />
        </div>
        <p>{isSuccess ? 'Payment successful' : 'Payment failed'}</p>
        <p style={{ fontSize: '14px', color: '#555', marginTop: '5px' }}>
          {formattedTime}, {formattedDate}
        </p>
      </div>

      <Button
        text={isSuccess ? 'Still Hungry ?' : 'View Orders'}
        width="96%"
        onClick={isSuccess ? handleSuccessClick : handleFailureClick}
      />
    </div>
  );
};

export default PaymentStatusPage;
