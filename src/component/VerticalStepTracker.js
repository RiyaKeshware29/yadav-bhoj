import ReadyIcon from '../image/ready-icon.png';
import receiveIcon from '../image/recieved-icon.svg';
import prepareIcon from '../image/prepare-icon.svg';
import rightIcon from '../image/right-icon.png';

const VerticalStepTracker = ({ currentStatus }) => {
  const normalizedStatus = currentStatus?.toLowerCase();

  // Define the main steps
  const steps = [
    { label: "Order received", icon: receiveIcon },
    { label: "Food being prepared", icon: prepareIcon },
    { label: "Food served", icon: ReadyIcon },
  ];

  // Map order status to step label
  const statusToStepLabel = {
    accepted: "Order received",
    ready: "Food being prepared",
    served: "Food served",
  };

  const currentStepLabel = statusToStepLabel[normalizedStatus];
  const statusIndex = steps.findIndex(step => step.label === currentStepLabel);

  // Special handling for rejected
  if (normalizedStatus === 'rejected') {
    return (
      <div className="vertical-tracker">
        <div className="step-container rejected-step">
          <div className="step-icon rejected-icon">
            ❌
          </div>
          <div className="step-content">
            <p className="step-label rejected-label">Order Rejected</p>
          </div>
        </div>
      </div>
    );
  }

  // For pending, show no active/completed steps
  if (normalizedStatus === 'pending' || !currentStepLabel) {
    return (
      <div className="vertical-tracker">
        {steps.map((step, idx) => (
          <div key={idx} className="step-container">
            <div className="step-row upcoming">
              <div className="step-icon upcoming-icon">
                <img src={step.icon} alt={step.label} className="upcoming-icon" />
              </div>
              <div className="step-content">
                <p className="step-label upcoming-label">{step.label}</p>
              </div>
            </div>
            {idx < steps.length - 1 && <div className="vertical-line" />}
          </div>
        ))}
      </div>
    );
  }

  // For received, ready, served
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
            {idx < steps.length - 1 && <div className="vertical-line" />}
          </div>
        );
      })}
    </div>
  );
};

export default VerticalStepTracker;
