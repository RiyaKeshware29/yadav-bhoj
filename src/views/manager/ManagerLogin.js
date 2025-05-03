import { useManager } from "../../context/ManagerContext";
import { useNavigate } from "react-router-dom";
import Button from '../../component/CustomButton';

function ManagerLogin() {
  const { updateManager } = useManager();  
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    const MANAGER_EMAIL = "admin@yb.com";
    const MANAGER_PASSWORD = "yb2916";

    if (email === MANAGER_EMAIL && password === MANAGER_PASSWORD) {
      updateManager({
        uid: "manager_uid_123",
        isVerified: true,
        role: "manager",
      });
      navigate("/m/dashboard");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="manager-login-wrapper">
      <form onSubmit={handleLogin}>
        <input className="input" name="email" placeholder="Email" required />
        <input className="input" name="password" type="password" placeholder="Password" required />
        <Button width="50%" text="Login" type="submit" />
      </form>
    </div>
  );
}

export default ManagerLogin;
