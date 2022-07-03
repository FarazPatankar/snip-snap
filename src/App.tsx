import { useRef, useState } from "react";
import domtoimage from "dom-to-image";
import {
  AppShell,
  Button,
  Center,
  Container,
  createStyles,
  Group,
  Image,
  Stack,
} from "@mantine/core";
import { writeBinaryFile, BaseDirectory } from "@tauri-apps/api/fs";

import { Dropzone } from "./components/Dropzone";
import { Sidebar } from "./components/Sidebar";
import {
  DefaultImageStyles,
  DEFAULT_GRADIENT,
  DEFAULT_IMAGE_STYLES,
  DEFAULT_PADDING,
} from "./lib/config";

const useStyles = createStyles(theme => {
  return {
    container: {
      height: "100%",
    },
    imageContainer: {
      flex: 1,
    },
  };
});

const App = () => {
  const { classes } = useStyles();
  const wrapper = useRef<HTMLDivElement | null>(null);
  const [initialImage, setInitialImage] = useState<null | string>(null);

  const [imageStyles, setImageStyles] =
    useState<DefaultImageStyles>(DEFAULT_IMAGE_STYLES);

  const onSave = async () => {
    if (wrapper.current == null) {
      return;
    }

    try {
      const blob = await domtoimage.toBlob(wrapper.current);
      const buffer = await blob.arrayBuffer();
      await writeBinaryFile("tauri-image.png", new Uint8Array(buffer), {
        dir: BaseDirectory.Desktop,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AppShell
      padding="md"
      navbar={
        <Sidebar imageStyles={imageStyles} setImageStyles={setImageStyles} />
      }
    >
      <Stack className={classes.container}>
        {initialImage ? (
          <>
            <Center className={classes.imageContainer}>
              <Container
                ref={wrapper}
                p={imageStyles.padding}
                style={{
                  background: imageStyles.gradient,
                }}
              >
                <Image radius={imageStyles.radius} src={initialImage} />
              </Container>
            </Center>
            <Group>
              <Button onClick={() => setInitialImage(null)}>Reset</Button>
              <Button onClick={onSave}>Save</Button>
            </Group>
          </>
        ) : (
          <Center className={classes.container}>
            <Dropzone setImage={setInitialImage} />
          </Center>
        )}
      </Stack>
    </AppShell>
  );
};

export default App;
