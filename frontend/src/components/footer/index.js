import { Box, Text } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer mt-50 pt-50">
      <div className="container">
        <div className="row">
          <div className="col-md-4 col-sm-12">
            <Link to="/">
              <img
                alt="logomaker"
                src="../../assets/imgs/theme/logo-maker-logo0-removebg.png"
              />
            </Link>
            <div className="mt-20 mb-20">
              We are a SaaS company that offers graphic design maker tools for
              startups, small business owners, website designers, and online
              entrepreneurs. We make branding accessible and affordable. Try our
              tools today!
            </div>
          </div>
          <div className="col-md-2 col-xs-6">
            <h6>Company</h6>
            <ul className="menu-footer mt-40">
              <li>
                <a href="#">About us</a>
              </li>
              <li>
                <a href="#">Our Team</a>
              </li>
              <li>
                <a href="#">Products</a>
              </li>
              <li>
                <a href="#">Contact</a>
              </li>
            </ul>
          </div>
          <div className="col-md-2 col-xs-6">
            <h6>Product</h6>
            <ul className="menu-footer mt-40">
              <li>
                <a href="#">Feature</a>
              </li>
              <li>
                <a href="#">Pricing</a>
              </li>
              <li>
                <a href="#">Credit</a>
              </li>
              <li>
                <a href="#">FAQ</a>
              </li>
            </ul>
          </div>
          <div className="col-md-2 col-xs-6">
            <h6>Download</h6>
            <ul className="menu-footer mt-40">
              <li>
                <a href="#">iOS</a>
              </li>
              <li>
                <a href="#">Android</a>
              </li>
              <li>
                <a href="#">Microsoft</a>
              </li>
              <li>
                <a href="#">Desktop</a>
              </li>
            </ul>
          </div>
          <div className="col-md-2 col-xs-6">
            <h6>Support</h6>
            <ul className="menu-footer mt-40">
              <li>
                <a href="#">Privacy</a>
              </li>
              <li>
                <a href="#">Help</a>
              </li>
              <li>
                <a href="#">Terms</a>
              </li>
              <li>
                <a href="#">FAQ</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom mt-50">
          <div className="row">
            <div className="col-md-6">
              Copyright ©2025{" "}
              <a href="#">
                <strong>zinitechnologies</strong>
              </a>
              . All Rights Reserved
            </div>
            <div className="col-md-6 text-md-end text-start">
              <div className="footer-social">
                <a href="#" className="icon-socials icon-facebook" />
                <a href="#" className="icon-socials icon-twitter" />
                <a href="#" className="icon-socials icon-instagram" />
                <a href="#" className="icon-socials icon-linkedin" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
