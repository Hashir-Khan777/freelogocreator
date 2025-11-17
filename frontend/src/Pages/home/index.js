import { Box, Container, SimpleGrid, Text } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllGraphics } from "../../store/actions/graphics.action";
import { toggleGeneratePostModal } from "../../store/reducers/modals.reducer";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { getPackages } from "../../store/actions/package.action";
import { subscribe } from "./../../store/actions/newsletter.action";
import {
  getSubscription,
  subscribeFreePackage,
  subscribePackage,
  updateSubcription,
} from "../../store/actions/subscription.action";
import { showToast } from "../../store/reducers/toast.reducer";
import { Helmet } from "react-helmet-async";

const Home = () => {
  const [inputValue, setInputValue] = useState("");
  const [email, setEmail] = useState("");

  const { packages } = useSelector((state) => state.PackageReducer);
  const { data } = useSelector((state) => state.AuthReducer);
  const { subscription, subscribed } = useSelector(
    (x) => x.SubscriptionReducer
  );

  const [searchParams, setSearchParams] = useSearchParams();

  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const dispatch = useDispatch();
  const { hash } = useLocation();

  useEffect(() => {
    console.log({
      prevEl: prevRef.current,
      nextEl: nextRef.current,
    });
  }, []);

  useEffect(() => {
    dispatch(getPackages());
  }, [dispatch]);

  useEffect(() => {
    if (searchParams.get("payment") === "success") {
      dispatch(
        updateSubcription({
          package_id: searchParams.get("package"),
          user_id: data?.id,
        })
      );
    }
  }, [searchParams]);

  useEffect(() => {
    if (subscribed) {
      dispatch(getSubscription());
      setSearchParams({});
    }
  }, [subscribed]);

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }, [hash]);

  return (
    <main className="main">
      <Helmet>
        <title>
          Smart QR Code & Logo | Fast & Powerful QR Code Generator & Logo Maker
        </title>
        <meta
          name="description"
          content="Create stunning QR codes, custom logos, and business cards in minutes. Smart QR Code & Logo offers fast, easy, and affordable tools for branding and business identity design."
        />
      </Helmet>
      <section className="section-box">
        <div className="banner-hero hero-1">
          <div className="banner-inner">
            <div className="row">
              <div className="col-lg-8">
                <div className="block-banner">
                  <span className="text-small-primary text-small-primary--disk text-uppercase wow animate__animated animate__fadeInUp">
                    Smart QR Code & Logo
                  </span>
                  <h1 className="heading-banner wow animate__animated animate__fadeInUp">
                    Fast & Powerful QR Code Generation & Logo Maker for Business
                    Design
                  </h1>
                  {/* <div
                    className="banner-description mt-30 wow animate__animated animate__fadeInUp"
                    data-wow-delay=".1s"
                  >
                    <p>
                      Design. Scan. Impress. Create professional QR Codes,
                      Logos, and Business Cards — all in one place. Start
                      customizing now and give your brand a digital identity
                      that stands out!
                    </p>
                    <p className="mt-10 mb-10">
                      Choose from 1000’s of logo designs. Browse 1000’s of
                      personalized and AI generated logo designs online. Use
                      filters and explore diverse logo ideas until you discover
                      the ideal logo to fine-tune.
                    </p>
                    <p>
                      Customize colors, fonts, layout, and more! Save your logo
                      design as is or make edits using our online logo maker
                      tool until it’s the perfect logo design for your business
                      or event.
                    </p>
                  </div> */}
                  <div
                    className="form-find mt-60 wow animate__animated animate__fadeInUp"
                    data-wow-delay=".2s"
                  >
                    <form>
                      <input
                        type="text"
                        className="form-input input-keysearch mr-10"
                        placeholder="Logo Maker's Site"
                        onChange={(e) => setInputValue(e.target.value)}
                      />
                      <Link to={`/logo?query=${inputValue}`}>
                        <button className="btn btn-default btn-find">
                          Find now
                        </button>
                      </Link>
                    </form>
                  </div>
                  {/* <div
                    className="list-tags-banner mt-60 wow animate__animated animate__fadeInUp"
                    data-wow-delay=".3s"
                  >
                    <strong>Popular Searches:</strong>
                    <a href="#">Tech</a>, <a href="#">Social Icons</a>,{" "}
                    <a href="#">Web</a>, <a href="#">Engineer</a>
                  </div> */}
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="banner-imgs">
                  <img
                    alt="logomaker"
                    src="/assets/imgs/banner/banner.png"
                    className="img-responsive shape-1"
                  />
                  <span className="union-icon">
                    <img
                      alt="logomaker"
                      src="/assets/imgs/banner/union.svg"
                      className="img-responsive shape-3"
                    />
                  </span>
                  <span className="congratulation-icon">
                    <img
                      alt="logomaker"
                      src="/assets/imgs/banner/congratulation.svg"
                      className="img-responsive shape-2"
                    />
                  </span>
                  <span className="docs-icon">
                    <img
                      alt="logomaker"
                      src="/assets/imgs/banner/docs.svg"
                      className="img-responsive shape-2"
                    />
                  </span>
                  <span className="course-icon">
                    <img
                      alt="logomaker"
                      src="/assets/imgs/banner/course.svg"
                      className="img-responsive shape-3"
                    />
                  </span>
                  <span className="web-dev-icon">
                    <img
                      alt="logomaker"
                      src="/assets/imgs/banner/web-dev.svg"
                      className="img-responsive shape-3"
                    />
                  </span>
                  <span className="tick-icon">
                    <img
                      alt="logomaker"
                      src="/assets/imgs/banner/tick.svg"
                      className="img-responsive shape-3"
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="section-box wow animate__animated animate__fadeIn mt-70">
        <div className="container">
          <div className="box-swiper">
            <div className="swiper-button-next" ref={nextRef} />
            <Swiper
              modules={[Navigation, Autoplay]}
              breakpoints={{
                992: {
                  slidesPerView: 5,
                },
                768: {
                  slidesPerView: 2,
                },
                320: {
                  slidesPerView: 1,
                },
              }}
              spaceBetween={20}
              navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              }}
              autoplay
              loop
              style={{ padding: "15px 0" }}
            >
              <SwiperSlide className="swiper-slide hover-up">
                <div
                  style={{
                    border: "1px solid rgba(6, 18, 36, 0.1)",
                    height: "100px",
                    width: "100%",
                    minWidth: "100px",
                    borderRadius: "12px",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <div>
                    <img
                      style={{ margin: "0 auto", width: "100px" }}
                      alt="logomaker"
                      src="/assets/imgs/slider/logo/google.svg"
                    />
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide className="swiper-slide hover-up">
                <div
                  style={{
                    border: "1px solid rgba(6, 18, 36, 0.1)",
                    height: "100px",
                    width: "100%",
                    minWidth: "100px",
                    borderRadius: "12px",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <div>
                    <img
                      style={{ margin: "0 auto" }}
                      alt="logomaker"
                      src="/assets/imgs/slider/logo/airbnb.svg"
                    />
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide className="swiper-slide hover-up">
                <div
                  style={{
                    border: "1px solid rgba(6, 18, 36, 0.1)",
                    height: "100px",
                    width: "100%",
                    minWidth: "100px",
                    borderRadius: "12px",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <div>
                    <img
                      style={{ margin: "0 auto" }}
                      alt="logomaker"
                      src="/assets/imgs/slider/logo/dropbox.svg"
                    />
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide className="swiper-slide hover-up">
                <div
                  style={{
                    border: "1px solid rgba(6, 18, 36, 0.1)",
                    height: "100px",
                    width: "100%",
                    minWidth: "100px",
                    borderRadius: "12px",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <div>
                    <img
                      style={{ margin: "0 auto" }}
                      alt="logomaker"
                      src="/assets/imgs/slider/logo/fedex.svg"
                    />
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide className="swiper-slide hover-up">
                <div
                  style={{
                    border: "1px solid rgba(6, 18, 36, 0.1)",
                    height: "100px",
                    width: "100%",
                    minWidth: "100px",
                    borderRadius: "12px",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <div>
                    <img
                      style={{ margin: "0 auto" }}
                      alt="logomaker"
                      src="/assets/imgs/slider/logo/wallmart.svg"
                    />
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide className="swiper-slide hover-up">
                <div
                  style={{
                    border: "1px solid rgba(6, 18, 36, 0.1)",
                    height: "100px",
                    width: "100%",
                    minWidth: "100px",
                    borderRadius: "12px",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <div>
                    <img
                      style={{ margin: "0 auto" }}
                      alt="logomaker"
                      src="/assets/imgs/slider/logo/hubspot.svg"
                    />
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
            <div className="swiper-button-prev" ref={prevRef} />
          </div>
        </div>
      </div>
      <section className="section-box mt-90">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="box-image-findjob box-image-about ml-0">
                <figure>
                  <img
                    alt="logomaker"
                    src="/assets/imgs/page/about/banner-price.png"
                  />
                </figure>
                <a
                  href="https://www.youtube.com/watch?v=ea-I4sqgVGY"
                  className="btn-play-video popup-youtube"
                />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="box-info-job box-info-about pl-90">
                <span className="text-blue text-uppercase wow animate__animated animate__fadeInUp">
                  About us
                </span>
                <h5 className="heading-36 mb-30 mt-10 wow animate__animated animate__fadeInUp">
                  {" "}
                  We help you to set your business{" "}
                </h5>
                {/* <p className="text-md mb-10 wow animate__ animate__fadeInUp animated">
                  {" "}
                  with a beautiful logo design that you can be proud of. Whether
                  you opt for an online A.I. logo generator or custom logo
                  design service!
                </p> */}
                <h5 className="heading-md-regular mt-10 mb-10 wow animate__animated animate__fadeInUp">
                  1. Smart QR Codes:
                </h5>
                <p className="text-md wow animate__animated animate__fadeInUp">
                  Generate dynamic, mobile-friendly QR codes that fit your brand
                  identity.
                </p>
                <h5 className="heading-md-regular mt-10 mb-10 wow animate__animated animate__fadeInUp">
                  2. Logo Customization:
                </h5>
                <p className="text-md wow animate__animated animate__fadeInUp">
                  Design or personalize logos that stand out in every niche.
                </p>
                <h5 className="heading-md-regular mt-10 mb-10 wow animate__animated animate__fadeInUp">
                  3. Business Card Customization:
                </h5>
                <p className="text-md wow animate__animated animate__fadeInUp">
                  Elevate your brand with digital and printable business cards.
                </p>
                <h5 className="heading-md-regular mt-10 mb-10 wow animate__animated animate__fadeInUp">
                  4. All-in-One Branding Hub:
                </h5>
                <p className="text-md wow animate__animated animate__fadeInUp">
                  Manage all your brand visuals in one place—fast, affordable,
                  and professional.
                </p>
                <div className="mt-20 wow animate__animated animate__fadeInUp">
                  <Link
                    to="/about"
                    className="mt-sm-15 mt-lg-30 btn btn-border icon-chevron-right"
                  >
                    Browse all
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section-box mt-50 mt-md-0">
        <div className="container">
          <div className="row align-items-end">
            <div className="col-lg-7">
              <h2 className="section-title mb-20 wow animate__animated animate__fadeInUp">
                Browse by category
              </h2>
              <p className="text-md-lh28 color-black-5 wow animate__animated animate__fadeInUp">
                With our Logo Maker, you can easily create or customize
                professional-grade logos for any industry using our modern
                templates and AI design tools.
              </p>
            </div>
            <div
              className="col-lg-5 text-lg-end text-start wow animate__animated animate__fadeInUp"
              data-wow-delay=".2s"
            >
              <Link
                to="/logo"
                className="mt-sm-15 mt-lg-30 btn btn-border icon-chevron-right"
              >
                View more
              </Link>
            </div>
          </div>
          <div className="row mt-70">
            <div className="col-lg-3 col-md-6 col-sm-12 col-12">
              <div className="card-grid hover-up wow animate__animated animate__fadeInUp">
                <div className="text-center">
                  <Link to="/logo?cat=10">
                    <figure>
                      <img
                        style={{ margin: "0 auto" }}
                        alt="logomaker"
                        src="/assets/imgs/theme/icons/marketing.svg"
                      />
                    </figure>
                  </Link>
                </div>
                <h5 className="text-center mt-20 card-heading">
                  <Link to="/logo?cat=10">Real Estate</Link>
                </h5>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12 col-12">
              <div
                className="card-grid hover-up wow animate__animated animate__fadeInUp"
                data-wow-delay=".1s"
              >
                <div className="text-center">
                  <Link to="/logo?cat=9">
                    <figure>
                      <img
                        style={{ margin: "0 auto" }}
                        alt="logomaker"
                        src="/assets/imgs/theme/icons/content-writer.svg"
                      />
                    </figure>
                  </Link>
                </div>
                <h5 className="text-center mt-20 card-heading">
                  <Link to="/logo?cat=9">Education</Link>
                </h5>
              </div>
            </div>
            <div
              className="col-lg-3 col-md-6 col-sm-12 col-12 wow animate__animated animate__fadeInUp"
              data-wow-delay=".2s"
            >
              <div className="card-grid hover-up">
                <div className="text-center">
                  <Link to="/logo?cat=8">
                    <figure>
                      <img
                        style={{ margin: "0 auto" }}
                        src="/assets/imgs/theme/icons/marketing-director.svg"
                        alt="logomaker"
                      />
                    </figure>
                  </Link>
                </div>
                <h5 className="text-center mt-20 card-heading">
                  <Link to="/logo?cat=8">Apparel</Link>
                </h5>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12 col-12">
              <div
                className="card-grid hover-up wow animate__animated animate__fadeInUp"
                data-wow-delay=".3s"
              >
                <div className="text-center">
                  <Link to="/logo?cat=7">
                    <figure>
                      <img
                        style={{ margin: "0 auto" }}
                        src="/assets/imgs/theme/icons/system-analyst.svg"
                        alt="logomaker"
                      />
                    </figure>
                  </Link>
                </div>
                <h5 className="text-center mt-20 card-heading">
                  <Link to="/logo?cat=7">Fitness</Link>
                </h5>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12 col-12">
              <div className="card-grid hover-up wow animate__animated animate__fadeInUp">
                <div className="text-center">
                  <Link to="/logo">
                    <figure>
                      <img
                        style={{ margin: "0 auto" }}
                        src="/assets/imgs/theme/icons/business-development.svg"
                        alt="logomaker"
                      />
                    </figure>
                  </Link>
                </div>
                <h5 className="text-center mt-20 card-heading">
                  <Link to="/logo?cat=6">Beauty</Link>
                </h5>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12 col-12">
              <div
                className="card-grid hover-up wow animate__animated animate__fadeInUp"
                data-wow-delay=".1s"
              >
                <div className="text-center">
                  <Link to="/logo?cat=5">
                    <figure>
                      <img
                        style={{ margin: "0 auto" }}
                        src="/assets/imgs/theme/icons/proof-reading.svg"
                        alt="logomaker"
                      />
                    </figure>
                  </Link>
                </div>
                <h5 className="text-center mt-20 card-heading">
                  <Link to="/logo?cat=5">Transportation</Link>
                </h5>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12 col-12">
              <div
                className="card-grid hover-up wow animate__animated animate__fadeInUp"
                data-wow-delay=".2s"
              >
                <div className="text-center card-img">
                  <Link to="/logo?cat=4">
                    <figure>
                      <img
                        style={{ margin: "0 auto" }}
                        src="/assets/imgs/theme/icons/testing.svg"
                        alt="logomaker"
                      />
                    </figure>
                  </Link>
                </div>
                <h5 className="text-center mt-20 card-heading">
                  <Link to="/logo?cat=4">Restaurants</Link>
                </h5>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12 col-12">
              <div
                className="card-grid hover-up wow animate__animated animate__fadeInUp"
                data-wow-delay=".3s"
              >
                <div className="text-center mt-15">
                  <h3>18,265+</h3>
                </div>
                <div className="text-center mt-45">
                  <div className="box-button-shadow">
                    <Link to="/logo" className="btn btn-default">
                      Explore more
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section-box mt-50 mb-70 bg-patern">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-sm-12">
              <div className="content-job-inner">
                <h2 className="section-title heading-lg wow animate__animated animate__fadeInUp">
                  Logo Customization Made Simple
                </h2>
                <div className="mt-40 pr-50 text-md-lh28 wow animate__animated animate__fadeInUp">
                  Your logo defines your identity — make it stand out. Our Logo
                  Maker lets you customize your brand’s symbol effortlessly.
                </div>
                <h5 className="section-title mt-40 wow animate__animated animate__fadeInUp">
                  What You’ll Get:
                </h5>
                <ul>
                  <li className="text-md-lh28 mt-3 mb-3 wow animate__animated animate__fadeInUp">
                    Editable and scalable logo templates
                  </li>
                  <li className="text-md-lh28 mt-3 mb-3 wow animate__animated animate__fadeInUp">
                    AI-powered customization
                  </li>
                  <li className="text-md-lh28 mt-3 mb-3 wow animate__animated animate__fadeInUp">
                    Professional fonts and icons
                  </li>
                  <li className="text-md-lh28 mt-3 mb-3 wow animate__animated animate__fadeInUp">
                    Multiple file formats (SVG, PNG, JPG)
                  </li>
                  <li className="text-md-lh28 mt-3 mb-3 wow animate__animated animate__fadeInUp">
                    100% unique design ownership
                  </li>
                </ul>
                <div className="mt-40 pr-50 text-md-lh28 wow animate__animated animate__fadeInUp">
                  Create your logo in minutes and download it instantly!
                </div>
                <div className="mt-40">
                  <div className="box-button-shadow wow animate__animated animate__fadeInUp">
                    <Link to="/logo" className="btn btn-default">
                      Get Started
                    </Link>
                  </div>
                  <Link
                    to="/contact"
                    className="btn btn-link wow animate__animated animate__fadeInUp"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-sm-12">
              <div className="box-image-job">
                <figure className=" wow animate__animated animate__fadeIn">
                  <img alt="logomaker" src="/assets/imgs/blog/img-job.png" />
                </figure>
                <div className="job-top-creator">
                  <div className="job-top-creator-head">
                    <h5>Our Top Logo's</h5>
                  </div>
                  <ul>
                    <li>
                      <div>
                        <figure>
                          <img
                            alt="logomaker"
                            src="/assets/imgs/avatar/ava_13.png"
                          />
                        </figure>
                        <div className="job-info-creator">
                          <strong>Beauty</strong>
                          <span>UI/UX Designer</span>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div>
                        <figure>
                          <img
                            alt="logomaker"
                            src="/assets/imgs/avatar/ava_14.png"
                          />
                        </figure>
                        <div className="job-info-creator">
                          <strong>Avatar</strong>
                          <span>Director</span>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div>
                        <figure>
                          <img
                            alt="logomaker"
                            src="/assets/imgs/avatar/ava_15.png"
                          />
                        </figure>
                        <div className="job-info-creator">
                          <strong>Fashion</strong>
                          <span>Photographer</span>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div>
                        <figure>
                          <img
                            alt="logomaker"
                            src="/assets/imgs/avatar/ava_16.png"
                          />
                        </figure>
                        <div className="job-info-creator">
                          <strong>Sarah Harding</strong>
                          <span>Motion Designer</span>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section-box">
        <div className="container pt-50">
          <div className="row">
            <div className="col-lg-2" />
            <div className="col-lg-8 text-center">
              <h1 className="section-title-large mb-30 wow animate__animated animate__fadeInUp">
                Create Smart QR Codes in Seconds
              </h1>
              <h5 className="text-muted wow animate__animated animate__fadeInUp">
                Design branded QR codes that connect instantly with your
                audience. Our QR Code Maker gives you complete control over
                style, color, and design.
              </h5>
              <h5 className="mb-30 text-muted wow animate__animated animate__fadeInUp">
                Make your QR codes beautiful and brand-driven — not boring.
              </h5>
            </div>
            <div
              className="col-lg-12 text-lg-center wow animate__animated animate__fadeInUp"
              data-wow-delay=".2s"
            >
              <Link
                to="/qrcode"
                className="mt-sm-15 mt-lg-30 btn btn-border icon-chevron-right"
              >
                Browse all
              </Link>
            </div>
          </div>
          <div className="box-banner-services mt-40">
            <div className="box-banner-services--inner wow animate__animated animate__fadeInUp">
              <video
                src="/assets/qrvideo.mp4"
                loop
                autoPlay
                controls
                style={{ borderRadius: 20 }}
              />
            </div>
          </div>
        </div>
      </section>
      <div className="section-box">
        <div className="container">
          <ul className="list-partners">
            <li
              className="wow animate__animated animate__fadeInUp hover-up"
              data-wow-delay="0s"
            >
              <a href="#">
                <figure>
                  <img
                    alt="logomaker"
                    src="/assets/imgs/jobs/logos/samsung.svg"
                  />
                </figure>
              </a>
            </li>
            <li
              className="wow animate__animated animate__fadeInUp hover-up"
              data-wow-delay=".1s"
            >
              <a href="#">
                <figure>
                  <img
                    alt="logomaker"
                    src="/assets/imgs/jobs/logos/google.svg"
                  />
                </figure>
              </a>
            </li>
            <li
              className="wow animate__animated animate__fadeInUp hover-up"
              data-wow-delay=".2s"
            >
              <a href="#">
                <figure>
                  <img
                    alt="logomaker"
                    src="/assets/imgs/jobs/logos/facebook.svg"
                  />
                </figure>
              </a>
            </li>
            <li
              className="wow animate__animated animate__fadeInUp hover-up"
              data-wow-delay=".3s"
            >
              <a href="#">
                <figure>
                  <img
                    alt="logomaker"
                    src="/assets/imgs/jobs/logos/pinterest.svg"
                  />
                </figure>
              </a>
            </li>
            <li
              className="wow animate__animated animate__fadeInUp hover-up"
              data-wow-delay=".4s"
            >
              <a href="#">
                <figure>
                  <img
                    alt="logomaker"
                    src="/assets/imgs/jobs/logos/avaya.svg"
                  />
                </figure>
              </a>
            </li>
            <li
              className="wow animate__animated animate__fadeInUp hover-up"
              data-wow-delay=".5s"
            >
              <a href="#">
                <figure>
                  <img
                    alt="logomaker"
                    src="/assets/imgs/jobs/logos/forbes.svg"
                  />
                </figure>
              </a>
            </li>
            <li
              className="wow animate__animated animate__fadeInUp hover-up"
              data-wow-delay=".1s"
            >
              <a href="#">
                <figure>
                  <img alt="logomaker" src="/assets/imgs/jobs/logos/avis.svg" />
                </figure>
              </a>
            </li>
            <li
              className="wow animate__animated animate__fadeInUp hover-up"
              data-wow-delay=".2s"
            >
              <a href="#">
                <figure>
                  <img
                    alt="logomaker"
                    src="/assets/imgs/jobs/logos/nielsen.svg"
                  />
                </figure>
              </a>
            </li>
            <li
              className="wow animate__animated animate__fadeInUp hover-up"
              data-wow-delay=".3s"
            >
              <a href="#">
                <figure>
                  <img
                    alt="logomaker"
                    src="/assets/imgs/jobs/logos/doordash.svg"
                  />
                </figure>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <section className="section-box mt-90 mb-80">
        <div className="container">
          <div className="block-job-bg block-job-bg-homepage-2">
            <div className="row">
              <div className="col-lg-6 col-md-12 col-sm-12 col-12 d-none d-md-block">
                <div className="box-image-findjob findjob-homepage-2 ml-0 wow animate__animated animate__fadeIn">
                  <figure>
                    <img
                      alt="logomaker"
                      src="/assets/imgs/page/about/img-findjob.png"
                    />
                  </figure>
                </div>
              </div>
              <div className="col-lg-6 col-md-12 col-sm-12 col-12">
                <div className="box-info-job pl-90 pt-30 pr-90">
                  <span className="text-blue wow animate__animated animate__fadeInUp">
                    Find Awesome Designs
                  </span>
                  <h5 className="heading-36 mb-30 mt-30 wow animate__animated animate__fadeInUp">
                    Your Brand. Your Design. Your Way.
                  </h5>
                  <p className="text-lg wow animate__animated animate__fadeInUp">
                    From startups to small businesses, event planners and
                    marketers — everyone can build a brand identity in minutes.
                  </p>
                  <p className="text-lg wow animate__animated animate__fadeInUp">
                    Design smarter. Print faster. Grow bigger.
                  </p>
                  <div className="box-button-shadow mt-30 wow animate__animated animate__fadeInUp">
                    <Link to="/logo" className="btn btn-default">
                      Explore more
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section-box mt-50 mt-md-0">
        <div className="container">
          <h2 className="section-title text-center mb-15 wow animate__animated animate__fadeInUp">
            Our Happy Customer
          </h2>
          <div className="text-normal text-center color-black-5 box-mw-60 wow animate__animated animate__fadeInUp mt-20">
            When it comes to choosing the right web hosting provider, we know
            how easy it is to get overwhelmed with the number.
          </div>
          <div className="row mt-70">
            <div className="box-swiper">
              <div className="swiper-container swiper-group-3">
                <Swiper
                  modules={[Autoplay]}
                  autoplay
                  loop
                  breakpoints={{
                    992: {
                      slidesPerView: 3,
                    },
                    768: {
                      slidesPerView: 2,
                    },
                    320: {
                      slidesPerView: 1,
                    },
                  }}
                  spaceBetween={20}
                  style={{ padding: "15px 0" }}
                >
                  <SwiperSlide className="swiper-slide">
                    <div
                      className="card-grid-3 hover-up"
                      // style={{ width: "420px", height: "393px" }}
                    >
                      <div className="text-center card-grid-3-image card-grid-3-image-circle">
                        <div>
                          <figure>
                            <img
                              style={{ margin: "0 auto" }}
                              alt="logomaker"
                              src="/assets/imgs/page/about/profile.png"
                            />
                          </figure>
                        </div>
                      </div>
                      <div className="card-block-info mt-10">
                        <p className="text-lg text-center">
                          We are on the hunt for a designer who is exceptional
                          in both making incredible product interfaces as well
                          as
                        </p>
                        <div className="text-center mt-20 mb-25">
                          <div className="rate">
                            <input
                              type="radio"
                              id="star5"
                              name="rate"
                              defaultValue={5}
                            />
                            <label
                              htmlFor="star5"
                              title="text"
                              className="checked"
                            >
                              5 stars
                            </label>
                            <input
                              type="radio"
                              id="star4"
                              name="rate"
                              defaultValue={4}
                            />
                            <label
                              htmlFor="star4"
                              title="text"
                              className="checked"
                            >
                              4 stars
                            </label>
                            <input
                              type="radio"
                              id="star3"
                              name="rate"
                              defaultValue={3}
                            />
                            <label
                              htmlFor="star3"
                              title="text"
                              className="checked"
                            >
                              3 stars
                            </label>
                            <input
                              type="radio"
                              id="star2"
                              name="rate"
                              defaultValue={2}
                            />
                            <label
                              htmlFor="star2"
                              title="text"
                              className="checked"
                            >
                              2 stars
                            </label>
                            <input
                              type="radio"
                              id="star1"
                              name="rate"
                              defaultValue={1}
                            />
                            <label
                              htmlFor="star1"
                              title="text"
                              className="checked"
                            >
                              1 star
                            </label>
                          </div>
                        </div>
                        <div className="card-profile text-center">
                          <strong>Katy Perry</strong>
                          <span>Visual Designer</span>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide className="swiper-slide">
                    <div
                      className="card-grid-3 hover-up"
                      // style={{ width: "420px", height: "393px" }}
                    >
                      <div className="text-center card-grid-3-image card-grid-3-image-circle">
                        <div>
                          <figure>
                            <img
                              style={{ margin: "0 auto" }}
                              alt="logomaker"
                              src="/assets/imgs/page/about/profile2.png"
                            />
                          </figure>
                        </div>
                      </div>
                      <div className="card-block-info mt-10">
                        <p className="text-lg text-center">
                          We are on the hunt for a designer who is exceptional
                          in both making incredible product interfaces as well
                          as
                        </p>
                        <div className="text-center mt-20 mb-25">
                          <div className="rate">
                            <input
                              type="radio"
                              id="star52"
                              name="rate"
                              defaultValue={5}
                            />
                            <label htmlFor="star52" title="text">
                              5 stars
                            </label>
                            <input
                              type="radio"
                              id="star42"
                              name="rate"
                              defaultValue={4}
                            />
                            <label
                              htmlFor="star42"
                              title="text"
                              className="checked"
                            >
                              4 stars
                            </label>
                            <input
                              type="radio"
                              id="star32"
                              name="rate"
                              defaultValue={3}
                            />
                            <label
                              htmlFor="star32"
                              title="text"
                              className="checked"
                            >
                              3 stars
                            </label>
                            <input
                              type="radio"
                              id="star22"
                              name="rate"
                              defaultValue={2}
                            />
                            <label
                              htmlFor="star22"
                              title="text"
                              className="checked"
                            >
                              2 stars
                            </label>
                            <input
                              type="radio"
                              id="star12"
                              name="rate"
                              defaultValue={1}
                            />
                            <label
                              htmlFor="star12"
                              title="text"
                              className="checked"
                            >
                              1 star
                            </label>
                          </div>
                        </div>
                        <div className="card-profile text-center">
                          <strong>Chris Brown</strong>
                          <span>Visual Designer</span>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide className="swiper-slide">
                    <div
                      // style={{ width: "420px", height: "393px" }}
                      className="card-grid-3 hover-up"
                    >
                      <div className="text-center card-grid-3-image card-grid-3-image-circle">
                        <div>
                          <figure>
                            <img
                              style={{ margin: "0 auto" }}
                              alt="logomaker"
                              src="/assets/imgs/page/about/profile3.png"
                            />
                          </figure>
                        </div>
                      </div>
                      <div className="card-block-info mt-10">
                        <p className="text-lg text-center">
                          We are on the hunt for a designer who is exceptional
                          in both making incredible product interfaces as well
                          as
                        </p>
                        <div className="text-center mt-20 mb-25">
                          <div className="rate">
                            <input
                              type="radio"
                              id="star53"
                              name="rate"
                              defaultValue={5}
                            />
                            <label
                              htmlFor="star53"
                              title="text"
                              className="checked"
                            >
                              5 stars
                            </label>
                            <input
                              type="radio"
                              id="star43"
                              name="rate"
                              defaultValue={4}
                            />
                            <label
                              htmlFor="star43"
                              title="text"
                              className="checked"
                            >
                              4 stars
                            </label>
                            <input
                              type="radio"
                              id="star33"
                              name="rate"
                              defaultValue={3}
                            />
                            <label
                              htmlFor="star33"
                              title="text"
                              className="checked"
                            >
                              3 stars
                            </label>
                            <input
                              type="radio"
                              id="star23"
                              name="rate"
                              defaultValue={2}
                            />
                            <label
                              htmlFor="star23"
                              title="text"
                              className="checked"
                            >
                              2 stars
                            </label>
                            <input
                              type="radio"
                              id="star13"
                              name="rate"
                              defaultValue={1}
                            />
                            <label
                              htmlFor="star13"
                              title="text"
                              className="checked"
                            >
                              1 star
                            </label>
                          </div>
                        </div>
                        <div className="card-profile text-center">
                          <strong>Justin Bieber</strong>
                          <span>Visual Designer</span>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide className="swiper-slide">
                    <div
                      className="card-grid-3 hover-up"
                      // style={{ width: "420px", height: "393px" }}
                    >
                      <div className="text-center card-grid-3-image card-grid-3-image-circle">
                        <div>
                          <figure>
                            <img
                              style={{ margin: "0 auto" }}
                              alt="logomaker"
                              src="/assets/imgs/page/about/profile.png"
                            />
                          </figure>
                        </div>
                      </div>
                      <div className="card-block-info mt-10">
                        <p className="text-lg text-center">
                          We are on the hunt for a designer who is exceptional
                          in both making incredible product interfaces as well
                          as
                        </p>
                        <div className="text-center mt-20 mb-25">
                          <div className="rate">
                            <input
                              type="radio"
                              id="star5"
                              name="rate"
                              defaultValue={5}
                            />
                            <label
                              htmlFor="star5"
                              title="text"
                              className="checked"
                            >
                              5 stars
                            </label>
                            <input
                              type="radio"
                              id="star4"
                              name="rate"
                              defaultValue={4}
                            />
                            <label
                              htmlFor="star4"
                              title="text"
                              className="checked"
                            >
                              4 stars
                            </label>
                            <input
                              type="radio"
                              id="star3"
                              name="rate"
                              defaultValue={3}
                            />
                            <label
                              htmlFor="star3"
                              title="text"
                              className="checked"
                            >
                              3 stars
                            </label>
                            <input
                              type="radio"
                              id="star2"
                              name="rate"
                              defaultValue={2}
                            />
                            <label
                              htmlFor="star2"
                              title="text"
                              className="checked"
                            >
                              2 stars
                            </label>
                            <input
                              type="radio"
                              id="star1"
                              name="rate"
                              defaultValue={1}
                            />
                            <label
                              htmlFor="star1"
                              title="text"
                              className="checked"
                            >
                              1 star
                            </label>
                          </div>
                        </div>
                        <div className="card-profile text-center">
                          <strong>Katy Perry</strong>
                          <span>Visual Designer</span>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide className="swiper-slide">
                    <div
                      className="card-grid-3 hover-up"
                      // style={{ width: "420px", height: "393px" }}
                    >
                      <div className="text-center card-grid-3-image card-grid-3-image-circle">
                        <div>
                          <figure>
                            <img
                              style={{ margin: "0 auto" }}
                              alt="logomaker"
                              src="/assets/imgs/page/about/profile2.png"
                            />
                          </figure>
                        </div>
                      </div>
                      <div className="card-block-info mt-10">
                        <p className="text-lg text-center">
                          We are on the hunt for a designer who is exceptional
                          in both making incredible product interfaces as well
                          as
                        </p>
                        <div className="text-center mt-20 mb-25">
                          <div className="rate">
                            <input
                              type="radio"
                              id="star52"
                              name="rate"
                              defaultValue={5}
                            />
                            <label htmlFor="star52" title="text">
                              5 stars
                            </label>
                            <input
                              type="radio"
                              id="star42"
                              name="rate"
                              defaultValue={4}
                            />
                            <label
                              htmlFor="star42"
                              title="text"
                              className="checked"
                            >
                              4 stars
                            </label>
                            <input
                              type="radio"
                              id="star32"
                              name="rate"
                              defaultValue={3}
                            />
                            <label
                              htmlFor="star32"
                              title="text"
                              className="checked"
                            >
                              3 stars
                            </label>
                            <input
                              type="radio"
                              id="star22"
                              name="rate"
                              defaultValue={2}
                            />
                            <label
                              htmlFor="star22"
                              title="text"
                              className="checked"
                            >
                              2 stars
                            </label>
                            <input
                              type="radio"
                              id="star12"
                              name="rate"
                              defaultValue={1}
                            />
                            <label
                              htmlFor="star12"
                              title="text"
                              className="checked"
                            >
                              1 star
                            </label>
                          </div>
                        </div>
                        <div className="card-profile text-center">
                          <strong>Chris Brown</strong>
                          <span>Visual Designer</span>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide className="swiper-slide">
                    <div
                      // style={{ width: "420px", height: "393px" }}
                      className="card-grid-3 hover-up"
                    >
                      <div className="text-center card-grid-3-image card-grid-3-image-circle">
                        <div>
                          <figure>
                            <img
                              style={{ margin: "0 auto" }}
                              alt="logomaker"
                              src="/assets/imgs/page/about/profile3.png"
                            />
                          </figure>
                        </div>
                      </div>
                      <div className="card-block-info mt-10">
                        <p className="text-lg text-center">
                          We are on the hunt for a designer who is exceptional
                          in both making incredible product interfaces as well
                          as
                        </p>
                        <div className="text-center mt-20 mb-25">
                          <div className="rate">
                            <input
                              type="radio"
                              id="star53"
                              name="rate"
                              defaultValue={5}
                            />
                            <label
                              htmlFor="star53"
                              title="text"
                              className="checked"
                            >
                              5 stars
                            </label>
                            <input
                              type="radio"
                              id="star43"
                              name="rate"
                              defaultValue={4}
                            />
                            <label
                              htmlFor="star43"
                              title="text"
                              className="checked"
                            >
                              4 stars
                            </label>
                            <input
                              type="radio"
                              id="star33"
                              name="rate"
                              defaultValue={3}
                            />
                            <label
                              htmlFor="star33"
                              title="text"
                              className="checked"
                            >
                              3 stars
                            </label>
                            <input
                              type="radio"
                              id="star23"
                              name="rate"
                              defaultValue={2}
                            />
                            <label
                              htmlFor="star23"
                              title="text"
                              className="checked"
                            >
                              2 stars
                            </label>
                            <input
                              type="radio"
                              id="star13"
                              name="rate"
                              defaultValue={1}
                            />
                            <label
                              htmlFor="star13"
                              title="text"
                              className="checked"
                            >
                              1 star
                            </label>
                          </div>
                        </div>
                        <div className="card-profile text-center">
                          <strong>Justin Bieber</strong>
                          <span>Visual Designer</span>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide className="swiper-slide">
                    <div
                      className="card-grid-3 hover-up"
                      // style={{ width: "420px", height: "393px" }}
                    >
                      <div className="text-center card-grid-3-image card-grid-3-image-circle">
                        <div>
                          <figure>
                            <img
                              style={{ margin: "0 auto" }}
                              alt="logomaker"
                              src="/assets/imgs/page/about/profile.png"
                            />
                          </figure>
                        </div>
                      </div>
                      <div className="card-block-info mt-10">
                        <p className="text-lg text-center">
                          We are on the hunt for a designer who is exceptional
                          in both making incredible product interfaces as well
                          as
                        </p>
                        <div className="text-center mt-20 mb-25">
                          <div className="rate">
                            <input
                              type="radio"
                              id="star5"
                              name="rate"
                              defaultValue={5}
                            />
                            <label
                              htmlFor="star5"
                              title="text"
                              className="checked"
                            >
                              5 stars
                            </label>
                            <input
                              type="radio"
                              id="star4"
                              name="rate"
                              defaultValue={4}
                            />
                            <label
                              htmlFor="star4"
                              title="text"
                              className="checked"
                            >
                              4 stars
                            </label>
                            <input
                              type="radio"
                              id="star3"
                              name="rate"
                              defaultValue={3}
                            />
                            <label
                              htmlFor="star3"
                              title="text"
                              className="checked"
                            >
                              3 stars
                            </label>
                            <input
                              type="radio"
                              id="star2"
                              name="rate"
                              defaultValue={2}
                            />
                            <label
                              htmlFor="star2"
                              title="text"
                              className="checked"
                            >
                              2 stars
                            </label>
                            <input
                              type="radio"
                              id="star1"
                              name="rate"
                              defaultValue={1}
                            />
                            <label
                              htmlFor="star1"
                              title="text"
                              className="checked"
                            >
                              1 star
                            </label>
                          </div>
                        </div>
                        <div className="card-profile text-center">
                          <strong>Katy Perry</strong>
                          <span>Visual Designer</span>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide className="swiper-slide">
                    <div
                      className="card-grid-3 hover-up"
                      // style={{ width: "420px", height: "393px" }}
                    >
                      <div className="text-center card-grid-3-image card-grid-3-image-circle">
                        <div>
                          <figure>
                            <img
                              style={{ margin: "0 auto" }}
                              alt="logomaker"
                              src="/assets/imgs/page/about/profile2.png"
                            />
                          </figure>
                        </div>
                      </div>
                      <div className="card-block-info mt-10">
                        <p className="text-lg text-center">
                          We are on the hunt for a designer who is exceptional
                          in both making incredible product interfaces as well
                          as
                        </p>
                        <div className="text-center mt-20 mb-25">
                          <div className="rate">
                            <input
                              type="radio"
                              id="star52"
                              name="rate"
                              defaultValue={5}
                            />
                            <label htmlFor="star52" title="text">
                              5 stars
                            </label>
                            <input
                              type="radio"
                              id="star42"
                              name="rate"
                              defaultValue={4}
                            />
                            <label
                              htmlFor="star42"
                              title="text"
                              className="checked"
                            >
                              4 stars
                            </label>
                            <input
                              type="radio"
                              id="star32"
                              name="rate"
                              defaultValue={3}
                            />
                            <label
                              htmlFor="star32"
                              title="text"
                              className="checked"
                            >
                              3 stars
                            </label>
                            <input
                              type="radio"
                              id="star22"
                              name="rate"
                              defaultValue={2}
                            />
                            <label
                              htmlFor="star22"
                              title="text"
                              className="checked"
                            >
                              2 stars
                            </label>
                            <input
                              type="radio"
                              id="star12"
                              name="rate"
                              defaultValue={1}
                            />
                            <label
                              htmlFor="star12"
                              title="text"
                              className="checked"
                            >
                              1 star
                            </label>
                          </div>
                        </div>
                        <div className="card-profile text-center">
                          <strong>Chris Brown</strong>
                          <span>Visual Designer</span>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide className="swiper-slide">
                    <div
                      // style={{ width: "420px", height: "393px" }}
                      className="card-grid-3 hover-up"
                    >
                      <div className="text-center card-grid-3-image card-grid-3-image-circle">
                        <div>
                          <figure>
                            <img
                              style={{ margin: "0 auto" }}
                              alt="logomaker"
                              src="/assets/imgs/page/about/profile3.png"
                            />
                          </figure>
                        </div>
                      </div>
                      <div className="card-block-info mt-10">
                        <p className="text-lg text-center">
                          We are on the hunt for a designer who is exceptional
                          in both making incredible product interfaces as well
                          as
                        </p>
                        <div className="text-center mt-20 mb-25">
                          <div className="rate">
                            <input
                              type="radio"
                              id="star53"
                              name="rate"
                              defaultValue={5}
                            />
                            <label
                              htmlFor="star53"
                              title="text"
                              className="checked"
                            >
                              5 stars
                            </label>
                            <input
                              type="radio"
                              id="star43"
                              name="rate"
                              defaultValue={4}
                            />
                            <label
                              htmlFor="star43"
                              title="text"
                              className="checked"
                            >
                              4 stars
                            </label>
                            <input
                              type="radio"
                              id="star33"
                              name="rate"
                              defaultValue={3}
                            />
                            <label
                              htmlFor="star33"
                              title="text"
                              className="checked"
                            >
                              3 stars
                            </label>
                            <input
                              type="radio"
                              id="star23"
                              name="rate"
                              defaultValue={2}
                            />
                            <label
                              htmlFor="star23"
                              title="text"
                              className="checked"
                            >
                              2 stars
                            </label>
                            <input
                              type="radio"
                              id="star13"
                              name="rate"
                              defaultValue={1}
                            />
                            <label
                              htmlFor="star13"
                              title="text"
                              className="checked"
                            >
                              1 star
                            </label>
                          </div>
                        </div>
                        <div className="card-profile text-center">
                          <strong>Justin Bieber</strong>
                          <span>Visual Designer</span>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                </Swiper>
                <div className="swiper-pagination swiper-pagination3" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section-box mt-90 mb-50">
        <div className="container">
          <div className="mw-450 text-center">
            <h3 className="mb-30 wow animate__animated animate__fadeInUp">
              Choose the offer
            </h3>
          </div>
          <div className="mw-650 text-center wow animate__animated animate__fadeInUp">
            <p className="mb-35 text-md-lh24 color-black-5">
              Choose the plan that fits your goals—affordable, flexible and full
              of features
            </p>
          </div>
          {/* <div className="text-center mt-20">
            <span className="text-lg text-billed">Billed Yearly</span>
            <label className="switch ml-20 mr-20">
              <input
                type="checkbox"
                id="cb_billed_type"
                name="billed_type"
                onchange="checkBilled()"
              />
              <span className="slider round" />
            </label>
            <span className="text-lg text-billed">Billed Monthly</span>
          </div> */}
          <div className="block-pricing mt-125 mt-md-50" id="packages">
            <div className="row">
              {[...packages]?.reverse()?.map((pack, index) => (
                <div
                  className="col-lg-3 col-md-6 wow animate__animated animate__fadeInUp"
                  data-wow-delay=".1s"
                >
                  <div
                    className={`box-pricing-item ${
                      index === 2 ? "most-popular" : "normal"
                    }`}
                  >
                    <div className="box-info-price">
                      <span className="text-price for-month display-month">
                        {console.log(pack.amount)}${pack.amount}
                      </span>
                      <span className="text-month">/month</span>
                    </div>
                    <div>
                      <h4 className="mb-15">{pack.name}</h4>
                    </div>
                    <ul className="list-package-feature">
                      <li>
                        {pack.logolimit === 0 ? "Unlimited" : pack.logolimit}{" "}
                        Logos
                      </li>
                      <li>
                        {pack.qrlimit === 0 ? "Unlimited" : pack.qrlimit} QR
                        Codes
                      </li>
                      <li>
                        {pack.scanlimit === 0 ? "Unlimited" : pack.scanlimit} QR
                        Code Scans
                      </li>
                      <li>Own analytics platform</li>
                      <li>Chat support</li>
                    </ul>
                    <div>
                      {subscription?.package?.id === pack.id ? (
                        <button className="btn btn-default">Subscribed</button>
                      ) : (
                        <button
                          className="btn btn-border"
                          onClick={() => {
                            if (pack.amount > 0) {
                              dispatch(
                                subscribePackage({
                                  user_id: data?.id,
                                  amount: pack?.amount * 100,
                                  name: `${pack?.name} Package`,
                                  package: pack?.id,
                                })
                              );
                            } else {
                              dispatch(
                                subscribeFreePackage({
                                  user_id: data?.id,
                                  amount: pack?.amount * 100,
                                  name: `${pack?.name} Package`,
                                  package: pack?.id,
                                })
                              );
                            }
                          }}
                        >
                          Choose plan
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <Text textAlign="center" mb="20px" fontSize="lg" fontWeight={500}>
                Contact Us for unlimited package
              </Text>
              {/* <div
                className="col-lg-3 col-md-6 wow animate__animated animate__fadeInUp"
                data-wow-delay=".1s"
              >
                <div className="box-pricing-item">
                  <div className="box-info-price">
                    <span className="text-price for-month display-month">
                      $20
                    </span>
                    <span className="text-price for-year">$240</span>
                    <span className="text-month">/month</span>
                  </div>
                  <div>
                    <h4 className="mb-15">Intro</h4>
                    <p className="text-desc-package mb-30">
                      For most businesses that want to otpimize web queries
                    </p>
                  </div>
                  <ul className="list-package-feature">
                    <li>All limited links</li>
                    <li>Own analytics platform</li>
                    <li>Chat support</li>
                    <li>Optimize hashtags</li>
                    <li>Unlimited users</li>
                  </ul>
                  <div>
                    <a href="#" className="btn btn-border">
                      Choose plan
                    </a>
                  </div>
                </div>
              </div>
              <div
                className="col-lg-3 col-md-6 wow animate__animated animate__fadeInUp"
                data-wow-delay=".2s"
              >
                <div className="box-pricing-item">
                  <div className="box-info-price">
                    <span className="text-price for-month display-month">
                      $50
                    </span>
                    <span className="text-price for-year">$600</span>
                    <span className="text-month">/month</span>
                  </div>
                  <div>
                    <h4 className="mb-15">Base</h4>
                    <p className="text-desc-package mb-30">
                      For most businesses that want to otpimize web queries
                    </p>
                  </div>
                  <ul className="list-package-feature">
                    <li>All limited links</li>
                    <li>Own analytics platform</li>
                    <li>Chat support</li>
                    <li>Optimize hashtags</li>
                    <li>Unlimited users</li>
                  </ul>
                  <div>
                    <a href="#" className="btn btn-border">
                      Choose plan
                    </a>
                  </div>
                </div>
              </div>
              <div
                className="col-lg-3 col-md-6 wow animate__animated animate__fadeInUp"
                data-wow-delay=".3s"
              >
                <div className="box-pricing-item most-popular">
                  <div className="text-end mb-10">
                    <a href="#" className="btn btn-white-sm">
                      Most popular
                    </a>
                  </div>
                  <div className="box-info-price">
                    <span className="text-price for-month display-month">
                      $100
                    </span>
                    <span className="text-price for-year">$1200</span>
                    <span className="text-month">/month</span>
                  </div>
                  <div>
                    <h4 className="mb-15">Pro</h4>
                    <p className="text-desc-package mb-30">
                      For most businesses that want to otpimize web queries
                    </p>
                  </div>
                  <ul className="list-package-feature">
                    <li>All limited links</li>
                    <li>Own analytics platform</li>
                    <li>Chat support</li>
                    <li>Optimize hashtags</li>
                    <li>Unlimited users</li>
                  </ul>
                  <div>
                    <a href="#" className="btn btn-border">
                      Choose plan
                    </a>
                  </div>
                </div>
              </div>
              <div
                className="col-lg-3 col-md-6 wow animate__animated animate__fadeInUp"
                data-wow-delay=".4s"
              >
                <div className="box-pricing-item">
                  <div className="box-info-price">
                    <span className="text-price for-month display-month">
                      $200
                    </span>
                    <span className="text-price for-year">$2400</span>
                    <span className="text-month">/month</span>
                  </div>
                  <div>
                    <h4 className="mb-15">Enterprise</h4>
                    <p className="text-desc-package mb-30">
                      For most businesses that want to otpimize web queries
                    </p>
                  </div>
                  <ul className="list-package-feature">
                    <li>All limited links</li>
                    <li>Own analytics platform</li>
                    <li>Chat support</li>
                    <li>Optimize hashtags</li>
                    <li>Unlimited users</li>
                  </ul>
                  <div>
                    <a href="#" className="btn btn-border">
                      Choose plan
                    </a>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </section>
      <section className="section-box mt-50 mb-60">
        <div className="container">
          <div className="box-newsletter">
            <h5 className="text-md-newsletter">Subscribe to get</h5>
            <h6 className="text-lg-newsletter">the latest Design's Update</h6>
            <div className="box-form-newsletter mt-30">
              <form
                className="form-newsletter"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (
                    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                      email
                    )
                  ) {
                    dispatch(subscribe({ email }));
                    setEmail("");
                  } else {
                    dispatch(
                      showToast({
                        type: "error",
                        message: "Invalid Email",
                      })
                    );
                  }
                }}
              >
                <input
                  type="text"
                  value={email}
                  className="input-newsletter"
                  placeholder="contact.logomaker@gmail.com"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button className="btn btn-default font-heading icon-send-letter">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
          <div className="box-newsletter-bottom">
            <div className="newsletter-bottom" />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
