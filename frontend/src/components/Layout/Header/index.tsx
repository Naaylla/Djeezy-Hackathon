import logo from "../../../assets/header/logo.svg";
import login_button from "../../../assets/header/login_button.svg";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <div className="flex items-center justify-between p-4 bg-beige">
      <img src={logo} alt="Logo" className="h-10" />
      <ul className="flex gap-[83px] font-medium">
        <li>Donate</li>
        <li>Funds</li>
        <li>About</li>
        <li>Sponsors</li>
        <li>Contact</li>
      </ul>
      <Link to="/Login">
        <button className="flex items center ">
          <img src={login_button} alt="" />
        </button>
      </Link>
    </div>
  );
}
