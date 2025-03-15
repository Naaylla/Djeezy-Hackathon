import ContactUs from "../../components/ContactUs"
import Mission from "../../components/Mission"
import Sponsors from "../../components/Sponsors"
import Hero from "../../components/Hero";
import Donation from "../../components/Donation/Index";
import Fund from "../../components/Fund";

export default function Home() {
    return (
        <div>
            <Hero />
            <Donation/>
            <Fund/>
            <Mission/>
            <Sponsors/>
            <ContactUs/>
        </div>
    )
}