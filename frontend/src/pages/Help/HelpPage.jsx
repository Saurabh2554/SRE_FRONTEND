import React from "react";
import "./styles.css";
import { MuiNavbar } from "../../common/components/Navbar/navbar";

export default function HelpPage() {
return(<div className="need-help-page">
    <MuiNavbar/>
    
    <header>
      <h1>Need Help?</h1>
      <p>We are here to assist you with any questions or issues.</p>
    </header>

    <section>
      <h2>Frequently Asked Questions</h2>
      {/* <FAQ /> */}
    </section>

    <section>
      <h2>Contact Us</h2>
      {/* <ContactForm /> */}
    </section>

    <footer>
      <p>
      © 2024 Data Axle, All Rights Reserved
      </p>
    </footer>
  </div>
);
}
