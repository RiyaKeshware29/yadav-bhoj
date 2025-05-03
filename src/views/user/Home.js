import Logo from './../../image/final-logo.png';
import Button from '../../component/CustomButton';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const handleGetStarted = () => {
        navigate("/u/phone");
    };
    return(
        <div className="home-wrapper">
            <img src={Logo} alt="" srcset="" />
            <Button width='80%' text={"Begin Your Order😋!"} onClick={handleGetStarted}/>
        </div>
    );
};

export default Home;
  