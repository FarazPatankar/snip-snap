import { createStyles, Stack, Text, Title } from "@mantine/core";
import { Dropzone as MantineDropzone, MIME_TYPES } from "@mantine/dropzone";
import { message } from "@tauri-apps/api/dialog";
import { listen } from "@tauri-apps/api/event";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { useEffect } from "react";

import { ImageIcon } from "./Icons";

const SUPPORTED_FILE_TYPES = [MIME_TYPES.jpeg, MIME_TYPES.png, MIME_TYPES.webp];

const useStyles = createStyles(theme => {
  return {
    container: {
      color: theme.colors.pink[6],
    },
    title: {
      color: theme.colors.pink[6],
    },
    text: {
      color: theme.colors.gray[5],
    },
  };
});

const isValidFileExtenstion = (name: string) => {
  const extension = name.split(".").pop();
  if (extension == null) {
    return false;
  }

  const validExtensions = SUPPORTED_FILE_TYPES.map(ext =>
    ext.split("/").pop(),
  ) as string[];

  return validExtensions.includes(extension);
};

interface DropzoneProps {
  setImage: React.Dispatch<React.SetStateAction<string | null>>;
}
export const Dropzone: React.FC<DropzoneProps> = ({ setImage }) => {
  const { classes } = useStyles();

  useEffect(() => {
    const unlisten = listen("tauri://file-drop", async event => {
      const payload = event.payload as string[];

      if (payload.length !== 1) {
        await message("Please drop only one file", {
          title: "Error",
          type: "error",
        });
        return;
      }

      const [file] = payload;
      const isValid = isValidFileExtenstion(file);
      if (!isValid) {
        await message(
          `The supported formats are: ${SUPPORTED_FILE_TYPES.join(", ")}`,
          {
            title: "Invalid file format",
            type: "error",
          },
        );
        return;
      }

      const data = convertFileSrc(file);
      setImage(data);
    });

    return () => {
      unlisten.then(f => f());
    };
  }, []);

  return (
    <MantineDropzone
      accept={SUPPORTED_FILE_TYPES}
      onDrop={files => {
        const [file] = files;
        const obj = URL.createObjectURL(file);

        setImage(obj);
      }}
      onReject={async rejectedFiles => {
        const [rejectedFile] = rejectedFiles;
        await message(rejectedFile.errors[0].message, {
          title: rejectedFile.errors[0].code,
          type: "error",
        });
      }}
      multiple={false}
    >
      <MantineDropzone.Idle>
        <Stack align="center" spacing="xs" className={classes.container}>
          <ImageIcon />
          <Title order={3} align="center" className={classes.title}>
            Drag and drop or click here to select files
          </Title>
          <Text className={classes.text}>Images go here</Text>
        </Stack>
      </MantineDropzone.Idle>
    </MantineDropzone>
  );
};
