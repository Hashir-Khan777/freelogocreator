import {
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

const Header = () => {
  const [search, setSearch] = useState("");

  const dispatch = useDispatch();
  const { isOpen, onToggle } = useDisclosure();
  const navigate = useNavigate();

  const { categories } = useSelector((state) => state.CategoriesReducer);

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
              <a href="index.html" className="d-flex">
                <img
                  alt="logomaker"
                  src="assets/imgs/theme/logo-maker-logo0-removebg.png"
                />
              </a>
            </div>
            <div className="header-nav">
              <nav className="nav-main-menu d-none d-xl-block">
                <ul className="main-menu">
                  <li>
                    <a className="active" href="index.html">
                      Home
                    </a>
                  </li>
                  <li className="has-children">
                    <a href="logo.html">Logo Maker</a>
                    <ul className="sub-menu">
                      <li className="hr">
                        <h5>Categories</h5>
                      </li>
                      <li>
                        <a href="#">Fashion</a>
                      </li>
                      <li>
                        <a href="#">Tech</a>
                      </li>
                      <li>
                        <a href="#">Construction</a>
                      </li>
                      <li className="hr">
                        <h5>Tags</h5>
                      </li>
                      <li>
                        <a href="#">Graphic designing</a>
                      </li>
                      <li>
                        <a href="#">Web</a>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <a href="website-builder.html">Website Builder</a>
                  </li>
                  <li>
                    <a href="about.html">About Us</a>
                  </li>
                  <li>
                    <a href="contact.html">Contact Us</a>
                  </li>
                </ul>
              </nav>
              <div className="burger-icon burger-icon-white">
                <span className="burger-icon-top" />
                <span className="burger-icon-mid" />
                <span className="burger-icon-bottom" />
              </div>
            </div>
          </div>
          <div className="header-right">
            <div className="block-signin">
              {/*<a href="#" class="text-link-bd-btom hover-up">Apply Now</a>*/}
              <a href="#" className="btn btn-default btn-shadow ml-40 hover-up">
                Sign in
              </a>
            </div>
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
