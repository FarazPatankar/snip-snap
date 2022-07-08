import { useEffect, useRef, useState } from "react";
import { toBlob } from "html-to-image";
import {
  AppShell,
  Box,
  Center,
  createStyles,
  Group,
  Image,
  Kbd,
  MantineNumberSize,
  MANTINE_SIZES,
  Stack,
} from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import { removeFile, writeBinaryFile } from "@tauri-apps/api/fs";
import { save } from "@tauri-apps/api/dialog";
import { cacheDir, desktopDir } from "@tauri-apps/api/path";
import { invoke } from "@tauri-apps/api/tauri";
import { type } from "@tauri-apps/api/os";
import { appWindow } from "@tauri-apps/api/window";

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

const useStyles = createStyles(theme => {
  return {
    container: {
      height: "100%",
      width: "100%",
    },
    imageContainer: {
      flex: 1,
    },
  };
});

const App = () => {
  const { classes } = useStyles();
  const [modKey, setModKey] = useState("⌘");

  const wrapper = useRef<HTMLDivElement | null>(null);
  const [initialImage, setInitialImage] = useState<null | string>(null);
  const [imageDimensions, setImageDimensions] = useState<null | {
    height: number;
    width: number;
  }>(null);

  const [imageStyles, setImageStyles] =
    useState<DefaultImageStyles>(DEFAULT_IMAGE_STYLES);
  const [finalImage, setFinalImage] = useState<null | {
    blob: Blob;
    src: string;
  }>(null);

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

  const getImageBuffer = async () => {
    if (finalImage == null) {
      throw new Error("Unable to generate image, please start over");
    }

    const buffer = await finalImage.blob.arrayBuffer();
    return new Uint8Array(buffer);
  };

  const onSave = async () => {
    try {
      const contents = await getImageBuffer();

      const desktopPath = await desktopDir();
      const path = await save({
        defaultPath: desktopPath,
        filters: [{ name: "Image", extensions: ["png"] }],
      });

      await writeBinaryFile({
        contents,
        path,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const onCopy = async () => {
    try {
      const contents = await getImageBuffer();

      const cacheDirPath = await cacheDir();
      const path = (await invoke("get_image_path", { cacheDirPath })) as string;

      await writeBinaryFile({
        contents,
        path,
      });

      await invoke("copy_image_to_clipboard", {
        imagePath: path,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const removeImage = async () => {
    try {
      const cacheDirPath = await cacheDir();
      const path = (await invoke("get_image_path", { cacheDirPath })) as string;

      await removeFile(path);
    } catch (error) {
      console.error(error);
    }
  };

  const onReset = async () => {
    setInitialImage(null);
    setFinalImage(null);
    await removeImage();
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
    [KEYBINDINGS.copyImage, onCopy],
    [KEYBINDINGS.reset, onReset],
  ]);

  useEffect(() => {
    const setModKeyForOs = async () => {
      const os = await type();

      setModKey(os === "Darwin" ? "⌘" : "Ctrl");
    };

    setModKeyForOs();
  }, []);

  useEffect(() => {
    const generateImage = async () => {
      if (wrapper.current == null) {
        return;
      }

      const blob = await toBlob(wrapper.current);
      if (blob == null) {
        return;
      }

      const image = URL.createObjectURL(blob);
      setFinalImage({ blob, src: image });
    };

    if (
      (initialImage == null || wrapper.current == null) &&
      finalImage == null
    ) {
      return;
    }

    setFinalImage(null);

    generateImage();
  }, [initialImage, wrapper.current, imageStyles]);

  useEffect(() => {
    const unlisten = appWindow.listen("tauri://close-requested", async () => {
      await removeImage();

      await appWindow.close();
    });

    return () => {
      unlisten.then(f => f());
    };
  }, []);

  return (
    <AppShell
      padding="md"
      navbar={
        <Sidebar imageStyles={imageStyles} setImageStyles={setImageStyles} />
      }
    >
      <Stack className={classes.container}>
        {initialImage == null && finalImage == null ? (
          <Center className={classes.container}>
            <Dropzone setImage={setInitialImage} />
          </Center>
        ) : (
          <>
            <Center className={classes.imageContainer}>
              {finalImage != null ? (
                <Box
                  sx={{
                    width: imageDimensions
                      ? imageDimensions.width / window.devicePixelRatio
                      : "auto",
                  }}
                >
                  <Image src={finalImage.src} />
                </Box>
              ) : (
                initialImage != null && (
                  <Box
                    ref={wrapper}
                    sx={{
                      background: imageStyles.gradient,
                      maxWidth: "100%",
                      width: imageDimensions
                        ? imageDimensions.width / window.devicePixelRatio
                        : "auto",
                    }}
                  >
                    <Image
                      src={initialImage}
                      onLoad={event => {
                        const image = event.target as HTMLImageElement;
                        setImageDimensions({
                          height: image.naturalHeight,
                          width: image.naturalWidth,
                        });
                      }}
                      radius={imageStyles.radius}
                      p={imageStyles.padding}
                      styles={theme => ({
                        root: {
                          borderRadius: theme.radius[imageStyles.radius],
                        },
                        image: {
                          boxShadow: theme.shadows[imageStyles.shadow],
                        },
                      })}
                    />
                  </Box>
                )
              )}
            </Center>
            <Group position="apart">
              <Group>
                <Kbd>Copy: {modKey} + C</Kbd>
                <Kbd>Save: {modKey} + S</Kbd>
              </Group>
              <Kbd>Reset: {modKey} + R</Kbd>
            </Group>
          </>
        )}
      </Stack>
    </AppShell>
  );
};

export default App;
