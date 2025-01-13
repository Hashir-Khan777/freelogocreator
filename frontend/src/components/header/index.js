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
    <Box>
      <Container maxWidth="1216px" py="20px">
        <Flex gap={10}>
          <InputGroup>
            <InputLeftAddon
              cursor="pointer"
              backgroundColor="white"
              padding={0}
            >
              <Menu onClose={onToggle} isOpen={isOpen}>
                <MenuButton as={Button} onClick={onToggle}>
                  All Categories
                </MenuButton>
                <MenuList zIndex={999}>
                  {categories?.map((category, index) => (
                    <MenuItem
                      to={`/filter/${category?.name}`}
                      as={Link}
                      key={index}
                    >
                      {category.name}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </InputLeftAddon>
            <Input
              borderRadius={0}
              placeholder="I am looking for..."
              type="text"
              autoComplete="false"
              name="search"
              id="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <InputRightAddon cursor="pointer" p={0}>
              <Button
                colorScheme="blue"
                variant="solid"
                color="white"
                borderRadius={0}
                onClick={() => {
                  dispatch(searchGraphics({ query: search }));
                }}
              >
                Search
              </Button>
            </InputRightAddon>
          </InputGroup>
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
            <Button
              colorScheme="blue"
              variant="solid"
              color="white"
              borderRadius={0}
            >
              Upload SVG logo
            </Button>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default Header;
