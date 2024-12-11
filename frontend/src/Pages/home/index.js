import { Box, SimpleGrid } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllGraphics } from "../../store/actions/graphics.action";
import { toggleGeneratePostModal } from "../../store/reducers/modals.reducer";

const Home = () => {
  const dispatch = useDispatch();

  const { graphics } = useSelector((x) => x.GraphicsReducer);

  useEffect(() => {
    dispatch(getAllGraphics());
  }, [dispatch]);

  return (
    <Box>
      <SimpleGrid columns={{ base: 2, md: 2, lg: 3, xl: 4 }} spacing={5}>
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
    </Box>
  );
};

export default Home;
