import Header from "../Components/Header.jsx"
import Styles from '../Components/About.module.css';
import { useEffect } from "react";
function About() {
    useEffect(() => {
        document.title = "Mini Mash - About";
    }, []);
    return (
        <>
            <Header />
            <h1 className={Styles.headtitle} style={{ color: "#3ea743" }}>Welcome to Mini Mash</h1>
            <p className={Styles.mainp} >your destination for quick, fun, and addictive mini games you can play anytime, anywhere. We created Mini Mash to bring joy to casual gamers looking for bite-sized entertainment without downloads or complexity. Whether you're here for a quick break or a longer session of fun, our growing library of mini games is designed to keep you engaged and smiling. We believe games should be simple, fast, and fun — and that's exactly what we deliver.</p>
        </>
    );
}
export default About