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
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCategories } from "../../store/actions/categories.action";
import { Link, useNavigate } from "react-router-dom";
import { searchGraphics } from "../../store/actions/graphics.action";
import { signOut } from "../../store/actions/auth.action";
import Cookies from "universal-cookie";

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
    dispatch(getAllCategories());
  }, [dispatch]);

  return (
    <header className="header sticky-bar">
      <div className="container">
        <div className="main-header">
          <div className="header-left">
            <div className="header-logo">
              <Link to="/" className="d-flex">
                <img
                  alt="logomaker"
                  src="../../assets/imgs/theme/logo-maker-logo0-removebg.png"
                />
              </Link>
            </div>
            <div className="header-nav">
              <nav className="nav-main-menu d-none d-xl-block">
                <ul className="main-menu">
                  <li>
                    <Link to="/logo">Logo Maker</Link>
                  </li>
                  <li>
                    <Link to="/qrcode">QR Code Maker</Link>
                  </li>
                  {/* <li>
                    <Link to="/website">Website Builder</Link>
                  </li> */}
                  <li>
                    <Link to="/about">About Us</Link>
                  </li>
                  <li>
                    <Link to="/contact">Contact Us</Link>
                  </li>
                </ul>
              </nav>
              {/* <div className="burger-icon burger-icon-white">
                <span className="burger-icon-top" />
                <span className="burger-icon-mid" />
                <span className="burger-icon-bottom" />
              </div> */}
            </div>
          </div>
          <div className="header-right">
            {data != null ? (
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
                      {/*<a href="#" class="text-link-bd-btom hover-up">Apply Now</a>*/}
                      <button className="btn btn-default btn-shadow ml-40 hover-up">
                        Sign Out
                      </button>
                    </div>
                  </MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <div className="block-signin">
                {/*<a href="#" class="text-link-bd-btom hover-up">Apply Now</a>*/}
                <Link
                  to="/login"
                  className="btn btn-default btn-shadow ml-40 hover-up"
                >
                  Sign in
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
    // <Box>
    //   <Container maxWidth="1216px" py="20px">
    //     <Flex gap={10}>
    //       <InputGroup>
    //         <InputLeftAddon
    //           cursor="pointer"
    //           backgroundColor="white"
    //           padding={0}
    //         >
    //           <Menu onClose={onToggle} isOpen={isOpen}>
    //             <MenuButton as={Button} onClick={onToggle}>
    //               All Categories
    //             </MenuButton>
    //             <MenuList zIndex={999}>
    //               {categories?.map((category, index) => (
    //                 <MenuItem
    //                   to={`/filter/${category?.name}`}
    //                   as={Link}
    //                   key={index}
    //                 >
    //                   {category.name}
    //                 </MenuItem>
    //               ))}
    //             </MenuList>
    //           </Menu>
    //         </InputLeftAddon>
    //         <Input
    //           borderRadius={0}
    //           placeholder="I am looking for..."
    //           type="text"
    //           autoComplete="false"
    //           name="search"
    //           id="search"
    //           value={search}
    //           onChange={(e) => setSearch(e.target.value)}
    //         />
    //         <InputRightAddon cursor="pointer" p={0}>
    //           <Button
    //             colorScheme="blue"
    //             variant="solid"
    //             color="white"
    //             borderRadius={0}
    //             onClick={() => {
    //               dispatch(searchGraphics({ query: search }));
    //             }}
    //           >
    //             Search
    //           </Button>
    //         </InputRightAddon>
    //       </InputGroup>
    //       <Box position="relative" cursor="pointer">
    //         <Input
    //           type="file"
    //           position="absolute"
    //           cursor="pointer"
    //           top={0}
    //           left={0}
    //           opacity={0}
    //           width="100%"
    //           height="100%"
    //           accept="image/svg+xml"
    //           onChange={uploadSvg}
    //           zIndex={999}
    //         />
    //         <Button
    //           colorScheme="blue"
    //           variant="solid"
    //           color="white"
    //           borderRadius={0}
    //         >
    //           Upload SVG logo
    //         </Button>
    //       </Box>
    //     </Flex>
    //   </Container>
    // </Box>
  );
};

export default Header;
