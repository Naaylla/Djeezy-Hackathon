import hero_pic from "../../assets/hero/hero-pic.png";
import hero_button from "../../assets/hero/hero-button.svg";
import hero_skew from "../../assets/hero/hero-skew.svg";

export default function Hero() {
  return (
    <div className="relative w-full h-[500px] flex items-center bg-beige">
      {/* Skewed Background - Above Hero Image */}
      <img
        src={hero_skew}
        alt="Skew background"
        className="absolute left-0 top-0 h-full w-auto z-10"
      />

      {/* Hero Image - Behind Skewed Background */}
      <img
        src={hero_pic}
        alt="Hero"
        className="absolute right-0 top-0 w-auto h-full object-cover z-0"
      />

      {/* Text Content - On Top */}
      <div className="relative z-20 ml-20">
        <p className="text-6xl font-bold text-black">9OUFA</p>
        <p className="text-lg text-gray-700">Your gateway to volunteering</p>
        <button className="mt-4">
          <img src={hero_button} alt="Donate Now" />
        </button>
      </div>
    </div>
  );
}
