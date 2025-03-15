import logo from "../../../assets/header/logo.svg";
import login_button from "../../../assets/header/login_button.svg";

export default function Header() {
  return (
    <div className="flex items-center justify-between p-4 bg-beige">
      <img src={logo} alt="Logo" className="h-10" />
      <ul className="flex gap-[83px] font-medium">
        <li className="cursor-pointer">Donate</li>
        <li className="cursor-pointer">Funds</li>
        <li className="cursor-pointer">About</li>
        <li className="cursor-pointer">Sponsors</li>
        <li className="cursor-pointer">Contact</li>
      </ul>

      <button className="flex items center ">
        <img src={login_button} className="cursor-pointer" />
      </button>
    </div>
  );
}
