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
  MantineNumberSize,
  MANTINE_SIZES,
  Stack,
} from "@mantine/core";
import { writeBinaryFile, BaseDirectory } from "@tauri-apps/api/fs";

import { Dropzone } from "./components/Dropzone";
import { Sidebar } from "./components/Sidebar";
import {
  DefaultImageStyles,
  DEFAULT_IMAGE_STYLES,
  GRADIENT_OPTIONS,
  KEYBINDINGS,
  PADDING_OPTIONS,
  RADIUS_OPTIONS,
} from "./lib/constants";
import { useHotkeys } from "@mantine/hooks";

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

  const toggleProperty = ({
    collection,
    key,
    value,
  }: {
    collection: string[] | typeof MANTINE_SIZES;
    key: string;
    value: string | MantineNumberSize;
  }) => {
    const currentIndex = collection.indexOf(value as any);
    const nextIndex =
      currentIndex + 1 === collection.length ? 0 : currentIndex + 1;

    setImageStyles({
      ...imageStyles,
      [key]: collection[nextIndex] as MantineNumberSize,
    });
  };

  useHotkeys([
    [
      KEYBINDINGS.togglePadding,
      () =>
        toggleProperty({
          collection: PADDING_OPTIONS,
          key: "padding",
          value: imageStyles.padding,
        }),
    ],
    [
      KEYBINDINGS.toggleRadius,
      () =>
        toggleProperty({
          collection: RADIUS_OPTIONS,
          key: "radius",
          value: imageStyles.radius,
        }),
    ],
    [
      KEYBINDINGS.toggleBackground,
      () =>
        toggleProperty({
          collection: GRADIENT_OPTIONS,
          key: "gradient",
          value: imageStyles.gradient,
        }),
    ],
  ]);

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
            <Group position="apart">
              <Button onClick={() => setInitialImage(null)}>Reset</Button>
              <Group>
                <Button onClick={onSave}>Save</Button>
              </Group>
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
