

import ContactUs from "../../components/ContactUs"
import Mission from "../../components/Mission"
import Sponsors from "../../components/Sponsors"
import Hero from "../../components/Hero";

export default function Home() {
    return (
        <div>
            <Hero />
            <Mission/>
            <Sponsors/>
            <ContactUs/>
        </div>
    )
}