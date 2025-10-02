import {
  Avatar,
  Box,
  Button,
  Container,
  Flex,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCategories } from "../../store/actions/categories.action";
import { Link, useNavigate } from "react-router-dom";
import { searchGraphics } from "../../store/actions/graphics.action";
import { signOut } from "../../store/actions/auth.action";
import Cookies from "universal-cookie";
import { getSubscription } from "../../store/actions/subscription.action";

const Header = () => {
  const [search, setSearch] = useState("");

  const dispatch = useDispatch();
  const { isOpen, onToggle } = useDisclosure();
  const navigate = useNavigate();

  const { data } = useSelector((x) => x.AuthReducer);

  const uploadSvg = (e) => {
    const reader = new FileReader();

    reader.onload = function (f) {
      localStorage.setItem("svg", f.target.result);
      navigate("/edit");
    };

    reader.readAsText(e.target.files[0]);
  };

  useEffect(() => {
    window.addEventListener("scroll", () => {
      var navbar = document.querySelector(".second_navbar");
      var sticky = 15;
      if (navbar && window.pageYOffset > sticky) {
        navbar.classList.add("sticky");
        navbar.classList.remove("main-headersuit");
      } else {
        navbar && navbar.classList.remove("sticky");
        navbar.classList.add("main-headersuit");
      }
    });
  });

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  useEffect(() => {
    if (data?.id) {
      dispatch(getSubscription());
    }
  }, [dispatch, data]);

  return (
    <>
      <div className="header topbar sticky-bar">
        <div className="container">
          <div className="main-topbar">
            <a className="cmr-lg-20" href="mailto:support@logomaker.com">
              <i className="bookmark"></i>
              <strong>support@logomaker.com</strong>
            </a>
          </div>
        </div>
      </div>
      <header className="second_navbar header main-headersuit sticky-bar">
        <div className="container">
          <div className="main-header">
            <div className="header-left">
              <div className="header-logo">
                <Link to="/" className="d-flex">
                  <img
                    alt="logomaker"
                    src="/assets/imgs/theme/logo-maker-logo0-removebg.png"
                  />
                </Link>
              </div>
              <div className="header-nav">
                <nav className="nav-main-menu d-none d-xl-block">
                  <ul className="main-menu">
                    <li>
                      <Link className="active" to="qrcode">
                        QR Code Maker
                      </Link>
                    </li>
                    <li>
                      <Link className="active" to="/logo">
                        Logo Maker
                      </Link>
                    </li>
                    <li>
                      <Link className="active" to="/about">
                        About Us
                      </Link>
                    </li>
                    <li>
                      <Link className="active" to="/#packages">
                        Packages
                      </Link>
                    </li>
                    <li>
                      <Link className="active" to="/contact">
                        Contact Us
                      </Link>
                    </li>
                  </ul>
                </nav>
                <div
                  className={`d-block d-xl-none burger-icon burger-icon-white ${
                    isOpen && "burger-close"
                  }`}
                  onClick={onToggle}
                >
                  <span className="burger-icon-top" />
                  <span className="burger-icon-mid" />
                  <span className="burger-icon-bottom" />
                </div>
              </div>
            </div>
            <div className="d-none d-xl-block">
              {data?.id ? (
                <Menu>
                  <MenuButton>
                    <Avatar name={data.name} />
                  </MenuButton>
                  <MenuList>
                    <MenuItem>
                      <div
                        className="block-signin"
                        onClick={() => dispatch(signOut())}
                      >
                        <button className="btn btn-default btn-shadow ml-40 hover-up">
                          Sign Out
                        </button>
                      </div>
                    </MenuItem>
                  </MenuList>
                </Menu>
              ) : (
                <div className="block-signin">
                  <Link
                    to="/login"
                    className="btn btn-default btn-shadow ml-40 hover-up"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/signup"
                    className="btn btn-default btn-shadow ml-40 hover-up"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <div
        className={`mobile-header-active ${
          isOpen && "sidebar-visible"
        } mobile-header-wrapper-style`}
      >
        <div
          className="mobile-header-wrapper-inner"
          style={{ overflow: "hidden" }}
        >
          <div className="mobile-header-top">
            {data?.id ? (
              <div className="user-account">
                <Avatar name={data?.name} mr="5px" />
                <div className="content">
                  <h6 className="user-name">
                    Hi, <span className="text-brand">{data?.name}</span>
                  </h6>
                </div>
              </div>
            ) : null}
            <div
              className={`burger-icon burger-icon-white ${
                isOpen && "burger-close"
              }`}
              onClick={onToggle}
            >
              <span className="burger-icon-top" />
              <span className="burger-icon-mid" />
              <span className="burger-icon-bottom" />
            </div>
          </div>
          <div className="mobile-header-content-area">
            <div className="perfect-scroll">
              <div className="mobile-menu-wrap mobile-header-border">
                <nav>
                  <ul className="mobile-menu font-heading">
                    <li>
                      <Link className="active" to="qrcode">
                        QR Code Maker
                      </Link>
                    </li>
                    <li>
                      <Link className="active" to="/logo">
                        Logo Maker
                      </Link>
                    </li>
                    <li>
                      <Link className="active" to="/about">
                        About Us
                      </Link>
                    </li>
                    <li>
                      <Link className="active" to="/#packages">
                        Packages
                      </Link>
                    </li>
                    <li>
                      <Link className="active" to="/contact">
                        Contact Us
                      </Link>
                    </li>
                  </ul>
                  {data?.id ? (
                    <button
                      className="btn btn-default btn-shadow hover-up"
                      onClick={() => dispatch(signOut())}
                    >
                      Sign Out
                    </button>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="btn btn-default btn-shadow hover-up"
                        style={{ width: "100%", marginBottom: "10px" }}
                      >
                        Sign in
                      </Link>
                      <Link
                        to="/signup"
                        className="btn btn-default btn-shadow hover-up"
                        style={{ width: "100%" }}
                      >
                        Sign up
                      </Link>
                    </>
                  )}
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
