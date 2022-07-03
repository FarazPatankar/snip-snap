import { useRef, useState } from "react";
import domtoimage from "dom-to-image";
import {
  AppShell,
  Button,
  Center,
  Container,
  createStyles,
  Image,
  Stack,
} from "@mantine/core";
import { writeBinaryFile, BaseDirectory } from "@tauri-apps/api/fs";

import { Dropzone } from "./components/Dropzone";
import { Sidebar } from "./components/Sidebar";

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

  const [padding, setPadding] = useState("lg");

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
      navbar={<Sidebar padding={padding} setPadding={setPadding} />}
    >
      <Stack className={classes.container}>
        {initialImage ? (
          <>
            <Center className={classes.imageContainer}>
              <Container
                ref={wrapper}
                p={padding}
                style={{
                  backgroundColor: "red",
                  // flex: 1,
                }}
              >
                <Image src={initialImage} />
              </Container>
            </Center>
            <Button onClick={onSave}>Save</Button>
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
