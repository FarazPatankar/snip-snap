import { Center, createStyles, Stack, Text, Title } from "@mantine/core";
import { Dropzone as MantineDropzone, MIME_TYPES } from "@mantine/dropzone";
import { message } from "@tauri-apps/api/dialog";
import { ImageIcon } from "./Icons";

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

interface DropzoneProps {
  setImage: React.Dispatch<React.SetStateAction<string | null>>;
}
export const Dropzone: React.FC<DropzoneProps> = ({ setImage }) => {
  const { classes } = useStyles();

  return (
    <MantineDropzone
      accept={[MIME_TYPES.jpeg, MIME_TYPES.png, MIME_TYPES.webp]}
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
