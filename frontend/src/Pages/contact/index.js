import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { sendQuery } from "../../store/actions/query.action";
import { subscribe } from "../../store/actions/newsletter.action";
import { showToast } from "../../store/reducers/toast.reducer";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    number: "",
    message: "",
  });
  const [email, setEmail] = useState("");

  const dispatch = useDispatch();

  const changeValue = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <main className="main">
      {/* <div className="container wide mb-50">
        <div className="border-radius-15 overflow-hidden">
          <div id="map-basic" className="leaflet-map">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d220447.21941396626!2d-97.9956118486981!3d30.31188194716275!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x865b39cddf100005%3A0xf13ec5349ee39a53!2s2802%20Flintrock%20Trace%20%23378%2C%20Austin%2C%20TX%2078738%2C%20USA!5e0!3m2!1sen!2s!4v1740146325659!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div> */}
      <div className="container mt-90 mt-md-30">
        <div className="row">
          <div className="col-xl-10 col-lg-12 m-auto">
            <section className="mb-50">
              {/* <h5
                className="text-blue text-center wow animate__animated animate__fadeInUp"
                data-wow-delay=".1s"
              >
                Get in Touch
              </h5>
              <h3
                className="section-title w-75 w-md-100 mb-50 mt-15 text-center mx-auto wow animate__animated animate__fadeInUp"
                data-wow-delay=".1s"
              >
                You are always welcome to visit our little studio
              </h3>
              <div className="row mb-60">
                <div
                  className="col-md-4 mb-4 mb-md-0 wow animate__animated animate__fadeInUp"
                  data-wow-delay=".1s"
                >
                  <h5 className="mb-15">Office</h5>
                  205 North Michigan Avenue, Suite 810
                  <br />
                  Chicago, 60601, USA
                  <br />
                  <abbr title="Phone">Phone:</abbr> (123) 456-7890
                  <br />
                  <abbr title="Email">Email: </abbr>contact@jubhub.com
                  <br />
                  <a className="btn btn-default btn-small font-weight-bold text-white mt-20 border-radius-5 btn-shadow-brand hover-up">
                    <i className="fi-rs-marker mr-5" />
                    View map
                  </a>
                </div>
                <div
                  className="col-md-4 mb-4 mb-md-0 mt-sm-30 wow animate__animated animate__fadeInUp"
                  data-wow-delay=".3s"
                >
                  <h5 className="mb-15">Studio</h5>
                  205 North Michigan Avenue, Suite 810
                  <br />
                  Chicago, 60601, USA
                  <br />
                  <abbr title="Phone">Phone:</abbr> (123) 456-7890
                  <br />
                  <abbr title="Email">Email: </abbr>contact@jubhub.com
                  <br />
                  <a className="btn btn-default btn-small font-weight-bold text-white mt-20 border-radius-5 btn-shadow-brand hover-up">
                    <i className="fi-rs-marker mr-5" />
                    View map
                  </a>
                </div>
                <div
                  className="col-md-4 mt-sm-30 wow animate__animated animate__fadeInUp"
                  data-wow-delay=".5s"
                >
                  <h5 className="mb-15">Shop</h5>
                  205 North Michigan Avenue, Suite 810
                  <br />
                  Chicago, 60601, USA
                  <br />
                  <abbr title="Phone">Phone:</abbr> (123) 456-7890
                  <br />
                  <abbr title="Email">Email: </abbr>contact@jubhub.com
                  <br />
                  <a className="btn btn-default btn-small font-weight-bold text-white mt-20 border-radius-5 btn-shadow-brand hover-up">
                    <i className="fi-rs-marker mr-5" />
                    View map
                  </a>
                </div>
              </div> */}
              <div className="row">
                <div className="col-xl-9 col-md-12 mx-auto">
                  <div className="contact-from-area padding-20-row-col">
                    <h5
                      className="text-blue text-center wow animate__animated animate__fadeInUp"
                      data-wow-delay=".1s"
                    >
                      Send Message
                    </h5>
                    <h2
                      className="section-title mt-15 mb-10 text-center wow animate__animated animate__fadeInUp"
                      data-wow-delay=".1s"
                    >
                      Drop Us a Line
                    </h2>
                    {/* <div className="row mt-50">
                      <div
                        className="col-md-4 text-center wow animate__animated animate__fadeInUp"
                        data-wow-delay=".1s"
                      >
                        <img
                          src="assets/imgs/theme/icons/headset-color.svg"
                          alt=""
                        />
                        <p className="text-muted font-xs mb-10">Phone</p>
                        <p className="mb-0 font-lg">
                          + 48 654-430-309 <br />+ 1 6532-430-309
                        </p>
                      </div>
                      <div
                        className="col-md-4 mt-sm-30 text-center wow animate__animated animate__fadeInUp"
                        data-wow-delay=".3s"
                      >
                        <img
                          src="assets/imgs/theme/icons/marker-color.svg"
                          alt=""
                        />
                        <p className="text-muted font-xs mb-10">Email</p>
                        <p className="mb-0 font-lg">
                          contact@logomaker.com <br />
                          sales@logomaker.com
                        </p>
                      </div>
                      <div
                        className="col-md-4 mt-sm-30 text-center wow animate__animated animate__fadeInUp"
                        data-wow-delay=".5s"
                      >
                        <img
                          src="assets/imgs/theme/icons/plane-color.svg"
                          alt=""
                        />
                        <p className="text-muted font-xs mb-10">Address</p>
                        <p className="mb-0 font-lg">
                          11567 E Broadview Dr <br />
                          Colorado(CO), 80117
                        </p>
                      </div>
                    </div> */}
                    <div className="contact-form-style mt-80" id="contact-form">
                      <div
                        className="row wow animate__animated animate__fadeInUp"
                        data-wow-delay=".1s"
                      >
                        <div className="col-lg-6 col-md-6">
                          <div className="input-style mb-20">
                            <input
                              name="name"
                              placeholder="Name"
                              type="text"
                              value={form.name}
                              onChange={changeValue}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="input-style mb-20">
                            <input
                              name="email"
                              placeholder="Your Email"
                              type="email"
                              value={form.email}
                              onChange={changeValue}
                            />
                          </div>
                        </div>
                        <div className="col-lg-12 col-md-12">
                          <div className="input-style mb-20">
                            <input
                              name="number"
                              placeholder="Your Phone"
                              type="number"
                              value={form.number}
                              onChange={changeValue}
                            />
                          </div>
                        </div>
                        <div className="col-lg-12 col-md-12 text-center">
                          <div className="textarea-style mb-30">
                            <textarea
                              name="message"
                              placeholder="Message"
                              value={form.message}
                              onChange={changeValue}
                            />
                          </div>
                          <button
                            className="submit submit-auto-width"
                            type="submit"
                            onClick={() => {
                              if (
                                form.name &&
                                form.email &&
                                form.number &&
                                form.message
                              ) {
                                if (
                                  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                                    form.email
                                  )
                                ) {
                                  dispatch(sendQuery(form));
                                  setForm({
                                    name: "",
                                    email: "",
                                    number: "",
                                    message: "",
                                  });
                                } else {
                                  dispatch(
                                    showToast({
                                      type: "error",
                                      message: "Invalid Email",
                                    })
                                  );
                                }
                              } else {
                                dispatch(
                                  showToast({
                                    type: "error",
                                    message: "All fields are required",
                                  })
                                );
                              }
                            }}
                          >
                            Send message
                          </button>
                        </div>
                      </div>
                    </div>
                    <p className="form-messege" />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
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

export default Contact;
