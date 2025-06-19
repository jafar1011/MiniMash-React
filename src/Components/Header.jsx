import { useNavigate, useLocation } from 'react-router-dom';
import Styles from './Header.module.css';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const routeToButton = {
    '/': 'home',
    '/games': 'games',
    '/about': 'about',
  };

  const activeButton = routeToButton[location.pathname];

  const handleBarClicks = (path) => {
    navigate(path);
  };

  return (
    <>
      <h1 className={Styles.headerTitle}>Mini Mash</h1>

      <ul className={Styles.list}>
        <li>
          <button
            onClick={() => handleBarClicks("/")}
            className={activeButton === "home" ? Styles.active : ""}
          >
            Home
          </button>
        </li>
        <li>
          <button
            onClick={() => handleBarClicks("/games")}
            className={activeButton === "games" ? Styles.active : ""}
          >
            Games
          </button>
        </li>
        <li>
          <button
            onClick={() => handleBarClicks("/about")}
            className={activeButton === "about" ? Styles.active : ""}
          >
            About
          </button>
        </li>
      </ul>
    </>
  );
}

export default Header;
