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
import { DEFAULT_GRADIENT, DEFAULT_PADDING } from "./lib/config";

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

  const [padding, setPadding] = useState(DEFAULT_PADDING as string);
  const [gradient, setGradient] = useState(DEFAULT_GRADIENT);

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
        <Sidebar
          padding={padding}
          setPadding={setPadding}
          gradient={gradient}
          setGradient={setGradient}
        />
      }
    >
      <Stack className={classes.container}>
        {initialImage ? (
          <>
            <Center className={classes.imageContainer}>
              <Container
                ref={wrapper}
                p={padding}
                style={{
                  background: gradient,
                }}
              >
                <Image src={initialImage} />
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
