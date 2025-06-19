import Header from "../Components/Header"
import { useNavigate } from 'react-router-dom';
import Styles from '../Components/Header.module.css';
import { useEffect } from "react";
function Home() {

  const navigate = useNavigate();

  const handleBarClicks = (path) => {
    navigate(path);
  };
  useEffect(() => {
    document.title = "Mini Mash - Home";
  }, []);
  return (<>
    <Header />
    <link rel="icon" href=".../public/favicon32.png" />

    <div className={Styles.paragraph}>
      <p style={{ color: "#3ea743", }}>
        &nbsp;&nbsp;&nbsp;Welcome to Mini Mash! <br />
        Your go-to spot for fun and easy-to-play web mini games, enjoy endless entertainment &nbsp;&nbsp;&nbsp;right in your browser!
      </p>
    </div>
    <button onClick={() => handleBarClicks("/games")} className={Styles.playbutton}>Play Now</button>

    <div className={Styles.loader}>
      {[...Array(8)].map((_, i) => (
        <div key={i} className={`${Styles.box} ${Styles['box' + i]}`}>
          <div></div>
        </div>
      ))}
      <div className={Styles.ground}>
        <div></div>
      </div>
    </div>
  </>)
}
export default Home