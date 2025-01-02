import { Box, Container, SimpleGrid } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleGeneratePostModal } from "../../store/reducers/modals.reducer";
import { getGraphicsByCategoryById } from "../../store/actions/categories.action";
import { useParams } from "react-router-dom";

const Filter = () => {
  const dispatch = useDispatch();

  const { categories, graphics } = useSelector((x) => x.CategoriesReducer);

  const params = useParams();

  useEffect(() => {
    if (categories) {
      dispatch(
        getGraphicsByCategoryById({
          id: categories?.find(
            (x) => x.name?.toLowerCase() === params?.category?.toLowerCase()
          )?.id,
        })
      );
    }
  }, [dispatch, categories, params]);

  return (
    <Container flex={1} maxWidth="1216px" my="20px">
      <SimpleGrid columns={{ base: 4, md: 4, lg: 5, xl: 6 }} spacing={5}>
        {graphics?.map((graphic) => (
          <Box
            onClick={() => {
              dispatch(
                toggleGeneratePostModal({
                  open: true,
                  data: { logo: graphic.graphic },
                })
              );
            }}
            key={graphic.id}
            dangerouslySetInnerHTML={{ __html: graphic.graphic }}
          />
        ))}
      </SimpleGrid>
    </Container>
  );
};

export default Filter;
