import { Text } from "@mantine/core";
import { Dropzone as MantineDropzone, MIME_TYPES } from "@mantine/dropzone";

/**
 * onReject is currently broken on React 18, please
 * update this component once it is fixed to handle
 * rejection beautifully.
 */

interface DropzoneProps {
  setImage: React.Dispatch<React.SetStateAction<string | null>>;
}
export const Dropzone: React.FC<DropzoneProps> = ({ setImage }) => {
  return (
    <MantineDropzone
      accept={[MIME_TYPES.jpeg, MIME_TYPES.png, MIME_TYPES.webp]}
      onDrop={files => {
        const [file] = files;
        const obj = URL.createObjectURL(file);

        setImage(obj);
      }}
    >
      {status => <Text>Images go here</Text>}
    </MantineDropzone>
  );
};
