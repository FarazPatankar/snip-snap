import { useRef, useState } from "react";
import domtoimage from "dom-to-image";
import {
  AppShell,
  Center,
  Container,
  createStyles,
  Group,
  Image,
  Kbd,
  MantineNumberSize,
  MANTINE_SIZES,
  Stack,
} from "@mantine/core";
import { writeBinaryFile } from "@tauri-apps/api/fs";
import { save } from "@tauri-apps/api/dialog";

import { Dropzone } from "./components/Dropzone";
import { Sidebar } from "./components/Sidebar";
import {
  DefaultImageStyles,
  DEFAULT_IMAGE_STYLES,
  GRADIENT_OPTIONS,
  KEYBINDINGS,
  PADDING_OPTIONS,
  RADIUS_OPTIONS,
  SHADOW_OPTIONS,
} from "./lib/constants";
import { useHotkeys } from "@mantine/hooks";
import { desktopDir } from "@tauri-apps/api/path";

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

  const onSave = async () => {
    if (wrapper.current == null) {
      return;
    }

    const element = wrapper.current;
    const scale = window.devicePixelRatio;
    const height = element.offsetHeight * scale;
    const width = element.offsetWidth * scale;

    try {
      const desktopPath = await desktopDir();
      const selectedPath = await save({
        defaultPath: desktopPath,
        filters: [{ name: "Image", extensions: ["png"] }],
      });

      const blob = await domtoimage.toBlob(wrapper.current, {
        height,
        width,
        style: {
          transform: "scale(" + scale + ")",
          transformOrigin: "top left",
          width: width + "px",
          height: height + "px",
        },
      });

      const buffer = await blob.arrayBuffer();
      await writeBinaryFile({
        contents: new Uint8Array(buffer),
        path: selectedPath,
      });
    } catch (error) {
      console.log(error);
    }
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
    [
      KEYBINDINGS.toggleShadow,
      () =>
        toggleProperty({
          collection: SHADOW_OPTIONS,
          key: "shadow",
          value: imageStyles.shadow,
        }),
    ],
    [KEYBINDINGS.saveImage, onSave],
    [KEYBINDINGS.reset, () => setInitialImage(null)],
  ]);

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
                sx={{
                  background: imageStyles.gradient,
                }}
              >
                <Image
                  src={initialImage}
                  radius={imageStyles.radius}
                  styles={theme => ({
                    root: {
                      borderRadius: theme.radius[imageStyles.radius],
                    },
                    image: {
                      boxShadow: theme.shadows[imageStyles.shadow],
                    },
                  })}
                />
              </Container>
            </Center>
            <Group position="apart">
              <Group>
                <Kbd>Copy: Cmd + C</Kbd>
                <Kbd>Save: Cmd + S</Kbd>
              </Group>
              <Kbd>Reset: Cmd + R</Kbd>
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
