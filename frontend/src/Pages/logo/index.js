import React, { useEffect, useRef, useState } from "react";
import {
  getAllGraphics,
  searchGraphics,
} from "../../store/actions/graphics.action";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Flex,
  Input,
} from "@chakra-ui/react";
import { toJpeg, toPng } from "html-to-image";
import { showToast } from "../../store/reducers/toast.reducer";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { getAllCategories } from "../../store/actions/categories.action";
import { updateUser } from "../../store/actions/auth.action";

let page = 1;
const Logo = () => {
  const [inputValue, setInputValue] = useState("");
  const [category, setCategory] = useState("all");
  const [filteredGraphics, setFilteredGraphics] = useState([]);
  const [selectedTags, setSelectedtags] = useState([]);
  const [tags, setTags] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const imageRef = useRef(null);

  const { graphics } = useSelector((x) => x.GraphicsReducer);
  const { categories } = useSelector((x) => x.CategoriesReducer);
  const { subscription } = useSelector((x) => x.SubscriptionReducer);
  const { data } = useSelector((x) => x.AuthReducer);

  const savePngImage = () => {
    if (subscription?.package?.logolimit === 0) {
      if (user?.email) {
        if (imageRef.current) {
          toPng(imageRef.current, { quality: 1, pixelRatio: 6 })
            .then((dataUrl) => {
              dispatch(
                updateUser({
                  ...user,
                  downloadedlogos: user?.downloadedlogos + 1,
                })
              );
              const link = document.createElement("a");
              link.download = `logo.png`;
              link.href = dataUrl;
              link.click();
            })
            .catch((error) => {
              dispatch(
                showToast({
                  type: "error",
                  message: error,
                })
              );
            });
        }
      } else {
        navigate("/login");
      }
    } else {
      if (
        subscription?.package?.logolimit > 0 &&
        data?.downloadedlogos < subscription?.package?.logolimit
      ) {
        if (user?.email) {
          if (imageRef.current) {
            toPng(imageRef.current, { quality: 1, pixelRatio: 6 })
              .then((dataUrl) => {
                dispatch(
                  updateUser({
                    ...user,
                    downloadedlogos: user?.downloadedlogos + 1,
                  })
                );
                const link = document.createElement("a");
                link.download = `logo.png`;
                link.href = dataUrl;
                link.click();
              })
              .catch((error) => {
                dispatch(
                  showToast({
                    type: "error",
                    message: error,
                  })
                );
              });
          }
        } else {
          navigate("/login");
        }
      } else {
        navigate("/#packages");
      }
    }
  };

  const saveJpegImage = () => {
    if (subscription?.package?.logolimit === 0) {
      if (user?.email) {
        if (imageRef.current) {
          toJpeg(imageRef.current, { quality: 1, pixelRatio: 6 })
            .then((dataUrl) => {
              dispatch(
                updateUser({
                  ...user,
                  downloadedlogos: user?.downloadedlogos + 1,
                })
              );
              const link = document.createElement("a");
              link.download = `logo.jpeg`;
              link.href = dataUrl;
              link.click();
            })
            .catch((error) => {
              dispatch(
                showToast({
                  type: "error",
                  message: error,
                })
              );
            });
        }
      } else {
        navigate("/login");
      }
    } else {
      if (
        subscription?.package?.logolimit > 0 &&
        data?.downloadedlogos < subscription?.package?.logolimit
      ) {
        if (user?.email) {
          if (imageRef.current) {
            toJpeg(imageRef.current, { quality: 1, pixelRatio: 6 })
              .then((dataUrl) => {
                dispatch(
                  updateUser({
                    ...user,
                    downloadedlogos: user?.downloadedlogos + 1,
                  })
                );
                const link = document.createElement("a");
                link.download = `logo.jpeg`;
                link.href = dataUrl;
                link.click();
              })
              .catch((error) => {
                dispatch(
                  showToast({
                    type: "error",
                    message: error,
                  })
                );
              });
          }
        } else {
          navigate("/login");
        }
      } else {
        navigate("/#packages");
      }
    }
  };

  const savePdfImage = async () => {
    if (
      subscription?.package?.logolimit > 0 &&
      data?.downloadedlogos < subscription?.package?.logolimit
    ) {
      if (user?.email) {
        if (imageRef.current) {
          const element = imageRef.current;
          const canvas = await html2canvas(element);
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF("p", "mm", "a4");

          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

          pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
          pdf.save("logo.pdf");
          dispatch(
            updateUser({
              ...user,
              downloadedlogos: user?.downloadedlogos + 1,
            })
          );
        }
      } else {
        navigate("/login");
      }
    } else {
      navigate("/#packages");
    }
  };

  const uploadSvg = (e) => {
    const reader = new FileReader();

    reader.onload = function (f) {
      localStorage.setItem("svg", f.target.result);
      navigate("/edit");
    };

    reader.readAsText(e.target.files[0]);
  };

  const filter = () => {
    if (graphics?.length > 0) {
      const uniqueTags = [];
      graphics?.filter((x) =>
        x.tags?.split(", ")?.forEach((tag) => {
          if (tag && !uniqueTags.includes(tag) && uniqueTags.length < 10) {
            uniqueTags.push(tag);
          }
        })
      );
      setTags(uniqueTags);
      if (searchParams.get("cat")) {
        if (searchParams.get("cat") === "all") {
          setFilteredGraphics(graphics);
        } else {
          setFilteredGraphics(
            graphics?.filter(
              (x) => x.category_id == Number(searchParams.get("cat"))
            )
          );
        }
      } else {
        setFilteredGraphics(graphics);
      }
      if (selectedTags.length > 0) {
        navigate("/logo");
        const filtered = graphics?.filter((x) =>
          selectedTags
            ?.map((e) => x?.tags?.split(", ")?.includes(e))
            ?.includes(true)
        );
        setFilteredGraphics(filtered);
      }
    }
  };

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  useEffect(() => {
    if (searchParams.get("query")) {
      setInputValue(searchParams.get("query"));
      dispatch(searchGraphics({ query: searchParams.get("query") }));
    } else {
      dispatch(getAllGraphics({ page }));
    }
    return () => {
      setInputValue("");
    };
  }, [searchParams]);

  useEffect(() => {
    filter();
  }, [graphics]);

  return (
    <main className="main">
      <section className="section-box bg-banner-about banner-home-3 pt-100">
        <div className="banner-hero">
          <div className="banner-inner">
            <div className="row">
              <div className="col-lg-12">
                <div className="block-banner">
                  <h2 className="heading-banner text-center wow animate__animated animate__fadeInUp">
                    There Are +2000
                    <br />
                    Log's Here For you!
                  </h2>
                  <div className="form-find mw-720 mt-80">
                    <form className="wow animate__animated animate__fadeInUp">
                      <input
                        type="text"
                        value={inputValue}
                        className="form-input input-keysearch mr-10"
                        placeholder="Logo Maker's Site"
                        onChange={(e) => setInputValue(e.target.value)}
                      />
                      <Link to={`/logo?query=${inputValue}`}>
                        <button className="btn btn-default btn-find wow animate__animated animate__fadeInUp">
                          Find now
                        </button>
                      </Link>
                    </form>
                  </div>
                  <div className="list-tags-banner mt-60 text-center wow animate__animated animate__fadeInUp">
                    <strong>Popular Searches:</strong>
                    <a href="#">Designer</a>, <a href="#">Developer</a>,{" "}
                    <a href="#">Web</a>, <a href="#">Engineer</a>,{" "}
                    <a href="#">Senior</a>,
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section-box mt-80">
        <div className="container">
          <div className="row flex-row-reverse">
            <div className="col-lg-9 col-md-12 col-sm-12 col-12 float-right">
              <div className="content-page">
                <div className="box-filters-job mt-15 mb-10">
                  <div className="row">
                    <div className="col-lg-7">
                      <span className="text-small">
                        Showing <strong>41-60 </strong>of <strong>944 </strong>
                        jobs
                      </span>
                    </div>
                    <div className="col-lg-5 text-lg-end mt-sm-15">
                      <Box position="relative" cursor="pointer">
                        <Input
                          type="file"
                          position="absolute"
                          cursor="pointer"
                          top={0}
                          left={0}
                          opacity={0}
                          width="100%"
                          height="100%"
                          accept="image/svg+xml"
                          onChange={uploadSvg}
                          zIndex={999}
                        />
                        <button className="btn btn-primary">
                          Upload SVG logo
                        </button>
                      </Box>
                    </div>
                  </div>
                </div>
                <div className="row">
                  {filteredGraphics?.map((graphic) => (
                    <div className="col-lg-4 col-md-6" key={graphic.id}>
                      <div
                        className="card-grid-2 hover-up wow animate__animated animate__fadeIn"
                        data-wow-delay=".2s"
                      >
                        <div className="text-center card-grid-2-image">
                          <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            marginY="20px"
                          >
                            <Box
                              sx={{
                                "& > svg": {
                                  height: "100px",
                                },
                              }}
                              ref={imageRef}
                              dangerouslySetInnerHTML={{
                                __html: graphic.graphic,
                              }}
                            />
                          </Box>
                          <div className="row position-absolute top-50 translate-middle-y z-3 end-0">
                            <a className="p-0 pr-10 mb-2" href="#">
                              <span className="text-end">
                                <img
                                  alt="logomaker"
                                  src="assets/imgs/theme/icons/shield-check.svg"
                                />
                              </span>
                            </a>
                            <a className="p-0 pr-10" href="#">
                              <span className="text-end">
                                <img
                                  alt="logomaker"
                                  src="assets/imgs/theme/icons/bookmark.svg"
                                />
                              </span>
                            </a>
                          </div>
                        </div>
                        <div className="card-block-info">
                          <div className="row">
                            <Menu>
                              <MenuButton
                                className="col-lg-6 col-6 text-start"
                                as="button"
                              >
                                <span className="btn btn-primary">Save</span>
                              </MenuButton>
                              <MenuList>
                                <MenuItem onClick={savePngImage}>
                                  Save As Png
                                </MenuItem>
                                <MenuItem onClick={saveJpegImage}>
                                  Save As Jpeg
                                </MenuItem>
                                <MenuItem onClick={savePdfImage}>
                                  Save As PDF
                                </MenuItem>
                              </MenuList>
                            </Menu>
                            <div className="col-lg-6 col-6 text-end">
                              <Box
                                as={Link}
                                to="/edit"
                                onClick={() => {
                                  localStorage.setItem("svg", graphic.graphic);
                                  localStorage.setItem(
                                    "backsvg",
                                    graphic?.backGraphic
                                  );
                                }}
                              >
                                <span className="btn btn-grey-small disc-btn">
                                  Customize
                                </span>
                              </Box>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Flex justifyContent="center">
                  <Box
                    className="text-start"
                    as="button"
                    onClick={() => {
                      page += 1;
                      dispatch(getAllGraphics({ page }));
                    }}
                  >
                    <span className="btn btn-primary">Load More</span>
                  </Box>
                </Flex>
              </div>
            </div>
            <div className="col-lg-3 col-md-12 col-sm-12 col-12">
              <div className="sidebar-with-bg">
                <h5 className="font-semibold mb-10">GStayet Updated</h5>
                <p className="text-body-999">
                  Enter you email address and get notification.
                </p>
                <div className="box-email-reminder">
                  <form>
                    <div className="form-group mt-15">
                      <input
                        type="text"
                        className="form-control input-bg-white form-icons"
                        placeholder="Enter email address"
                      />
                      <i className="fi-rr-envelope" />
                    </div>
                    <div className="form-group mt-25 mb-5">
                      <button className="btn btn-default btn-md">Submit</button>
                    </div>
                  </form>
                </div>
              </div>
              <div className="sidebar-shadow none-shadow mb-30">
                <div className="sidebar-filters">
                  <div className="filter-block mb-30">
                    <h5 className="medium-heading mb-15">Categoy</h5>
                    <div className="form-group select-style select-style-icon">
                      <select
                        className="form-control form-icons select-active"
                        value={searchParams.get("cat")}
                        onChange={(e) => {
                          navigate("/logo");
                          setSelectedtags([]);
                          setSearchParams({ cat: e.target.value });
                        }}
                      >
                        <option value="all">All</option>
                        {categories?.map((cat) => (
                          <option value={cat.id}>{cat?.name}</option>
                        ))}
                      </select>
                      <i className="fi-rr-briefcase" />
                    </div>
                  </div>
                  <div className="filter-block mb-30">
                    <h5 className="medium-heading mb-15">Filter by Tags</h5>
                    <div className="form-group">
                      <ul className="list-checkbox">
                        {tags.map((tag) => (
                          <li>
                            <label className="cb-container">
                              <input
                                type="checkbox"
                                checked={selectedTags.includes(tag)}
                                onClick={() => {
                                  if (selectedTags.includes(tag)) {
                                    setSelectedtags(
                                      selectedTags.filter((t) => t !== tag)
                                    );
                                  } else {
                                    setSelectedtags([...selectedTags, tag]);
                                  }
                                }}
                              />{" "}
                              <span className="text-small">{tag}</span>
                              <span className="checkmark" />
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="buttons-filter">
                    <button className="btn btn-default" onClick={filter}>
                      Apply filter
                    </button>
                    <button
                      className="btn"
                      onClick={() => {
                        setSearchParams({});
                        setSelectedtags([]);
                        setFilteredGraphics(graphics);
                        // window.location.reload();
                      }}
                    >
                      Reset filter
                    </button>
                  </div>
                </div>
              </div>
              <div className="sidebar-with-bg background-primary bg-sidebar pb-80">
                <h5 className="medium-heading text-white mb-20 mt-20">
                  Recruiting?
                </h5>
                <p className="text-body-999 text-white mb-30">
                  Advertisement Area for google ads only.
                </p>
                <a
                  href="#"
                  className="btn btn-border icon-chevron-right btn-white-sm"
                >
                  Get in Touch
                </a>
              </div>
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
                    src="assets/imgs/jobs/logos/samsung.svg"
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
                    src="assets/imgs/jobs/logos/google.svg"
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
                    src="assets/imgs/jobs/logos/facebook.svg"
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
                    src="assets/imgs/jobs/logos/pinterest.svg"
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
                  <img alt="logomaker" src="assets/imgs/jobs/logos/avaya.svg" />
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
                    src="assets/imgs/jobs/logos/forbes.svg"
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
                  <img alt="logomaker" src="assets/imgs/jobs/logos/avis.svg" />
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
                    src="assets/imgs/jobs/logos/nielsen.svg"
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
                    src="assets/imgs/jobs/logos/doordash.svg"
                  />
                </figure>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <section className="section-box mt-50 mb-60">
        <div className="container">
          <div className="box-newsletter">
            <h5 className="text-md-newsletter">Subscribe to get</h5>
            <h6 className="text-lg-newsletter">the latest Logo's Updates</h6>
            <div className="box-form-newsletter mt-30">
              <form className="form-newsletter">
                <input
                  type="text"
                  className="input-newsletter"
                  defaultValue=""
                  placeholder="contact.info@gmail.com"
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

export default Logo;
