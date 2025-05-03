import ReadyIcon from '../image/ready-icon.png';
import receiveIcon from '../image/recieved-icon.svg';
import prepareIcon from '../image/prepare-icon.svg';
import rightIcon from '../image/right-icon.png';

const VerticalStepTracker = ({ currentStatus }) => {
    const steps = [
      { label: "Order received", icon: receiveIcon },
      { label: "Food being prepared", icon: prepareIcon },
      { label: "Food served", icon: ReadyIcon },
    ];
  
    const statusToStep = {
      rejected: "Order rejected",
      pending: "Order received",
      ready: "Food being prepared",
      served: "Food served",
    };
  
    const stepLabel = statusToStep[currentStatus?.toLowerCase()];
    const statusIndex = steps.findIndex(step => step.label === stepLabel);
  
    return (
      <div className="vertical-tracker">
        {steps.map((step, idx) => {
          const isActive = idx === statusIndex;
          const isCompleted = idx < statusIndex;
          const isUpcoming = idx > statusIndex;
  
          return (
            <div key={idx} className="step-container">
              <div className={`step-row ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""}`}>
                <div className={`step-icon ${isCompleted ? 'completed-icon' : isActive ? 'active-icon' : 'upcoming-icon'}`}>
                  <img
                    src={step.icon}
                    alt={step.label}
                    className={`${isCompleted ? 'completed-icon' : isActive ? 'active-icon' : 'upcoming-icon'}`}
                  />
                </div>
                <div className="step-content">
                  <p className={`step-label ${isUpcoming ? 'upcoming-label' : ''}`}>
                    {step.label}
                    {isActive && (
                      <div className="current-stts-icon">
                        <img src={rightIcon} alt="Current" className="right-icon" />
                      </div>
                    )}
                  </p>
                </div>
              </div>
          
              {/* Dashed line between steps */}
              {idx < steps.length - 1 && <div className="vertical-line" />}
            </div>
          );
          
        })}
      </div>
    );
  };

  export default VerticalStepTracker;
