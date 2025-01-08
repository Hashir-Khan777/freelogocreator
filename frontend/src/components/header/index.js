import {
  Box,
  Button,
  Container,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Select,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCategories } from "../../store/actions/categories.action";
import { Link } from "react-router-dom";
import { searchGraphics } from "../../store/actions/graphics.action";

const Header = () => {
  const [search, setSearch] = useState("");

  const dispatch = useDispatch();
  const { isOpen, onToggle } = useDisclosure();

  const { categories, filteredGraphics } = useSelector(
    (state) => state.CategoriesReducer
  );

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  return (
    <Box>
      <Container maxWidth="1216px" py="20px">
        <InputGroup>
          <InputLeftAddon cursor="pointer" backgroundColor="white" padding={0}>
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
      </Container>
    </Box>
  );
};

export default Header;
