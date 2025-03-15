import { motion, useInView } from "framer-motion";
import famImage from "../../assets/fam.png";
import { Link } from "react-router-dom";
import { useRef } from "react";

export default function Mission() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef);

  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <section
      ref={sectionRef}
      className="bg-gradient-to-br from-amber-400 to-orange-500 py-16 px-4 md:px-8 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        <motion.h1
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeInVariants}
          className="text-3xl md:text-5xl font-bold mb-8 md:mb-12 text-center text-white drop-shadow-sm" // Responsive font sizes and margin
        >
          OUR MISSION
        </motion.h1>

        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeInVariants}
          className="flex flex-col md:flex-row items-center gap-6 md:gap-8 rounded-2xl bg-white/10 backdrop-blur-sm p-6 md:p-8 shadow-xl" // Responsive gap
        >
          <div className="w-full md:w-1/2 relative">
            <div className="aspect-square md:aspect-[4/3] relative rounded-xl overflow-hidden shadow-lg">
              <img
                src={famImage}
                alt="Families receiving food aid during Ramadan"
                className="object-cover h-full w-full transition-transform hover:scale-105 duration-700"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/800x600?text=Mission+Image";
                }}
              />
            </div>
            <div className="absolute -bottom-4 -right-4 h-20 w-20 md:h-32 md:w-32 bg-amber-300 rounded-full -z-10"></div>
            <div className="absolute -top-4 -left-4 h-12 w-12 md:h-24 md:w-24 bg-orange-600/30 rounded-full -z-10"></div>
          </div>

          <div className="w-full md:w-1/2 space-y-4 md:space-y-6">
            <h2 className="text-xl md:text-3xl font-semibold text-white drop-shadow-sm">
              Bridging the Gap: Direct, Transparent Ramadan Food Aid
            </h2>

            <p className="text-lg md:text-xl font-medium text-amber-100">
              Empowering Donors, Supporting Those in Need
            </p>

            <div className="bg-white/20 backdrop-blur-sm p-4 md:p-5 rounded-xl">
              <p className="text-sm md:text-base text-white leading-relaxed">
                9oufa provides essential food baskets (قفة رمضان) during Ramadan, ensuring transparency via blockchain
                technology. Donors can track their contributions as they move through vetted charity societies, directly
                seeing how their support provides sustenance to families experiencing food insecurity.
              </p>
            </div>

            <div className="pt-2 md:pt-4">
              <Link to="/Donate">
                <button className="px-4 py-2 md:px-6 md:py-3 bg-white text-orange-600 rounded-full font-medium hover:bg-orange-50 transition-colors shadow-md">
                  Learn More
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}