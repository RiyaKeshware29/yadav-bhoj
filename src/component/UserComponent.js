import React from "react";
import StepDots from './StepDots';

const userComponent = ({ title, subtitle, children,step }) => {
  return (
    <div className="phone-auth">
      <div className="phone-bg">
        <h2>A great meal awaits you!</h2>
      </div>
      <div className="main-phone-container">
      <StepDots step={step} />
        <h3>{title}</h3>
        <div className="phone-auth-wrap">
          {subtitle && <span>{subtitle}</span>}
          {children}
        </div>
      </div>
    </div>
  );
};

export default userComponent;
