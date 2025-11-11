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
              We offers easy-to-use tools for custom QR code generation, logo
              design customization and business card design helping small
              businesses and startups build strong brand identities online.
            </div>
          </div>
          <div className="col-md-2 col-xs-6">
            <h6>Company</h6>
            <ul className="menu-footer mt-40">
              <li>
                <Link to="/qrcode">QR Code Maker</Link>
              </li>
              <li>
                <Link to="/logo">Logo Maker</Link>
              </li>
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/#packages">Packages</Link>
              </li>
              <li>
                <a href="/contact">Contact Us</a>
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
                <a
                  href="https://www.facebook.com/profile.php?id=61582071836197"
                  target="_fb"
                  className="icon-socials icon-facebook"
                />
                <a
                  href="https://www.instagram.com/qrcode_generation_logomaker1/"
                  target="_insta"
                  className="icon-socials icon-instagram"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
