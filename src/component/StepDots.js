import React from "react";

const StepDots = ({ step }) => {
  return (
    <div className="step-dots">
      {[1, 2, 3].map((s) => (
        <div
          key={s}
          className={`dot ${step === s ? 'active' : ''}`}
        ></div>
      ))}
    </div>
  );
};

export default StepDots;
