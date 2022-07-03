import { useRef, useState } from "react";
import domtoimage from "dom-to-image";
import { AppShell, Button, Center, Container, Image } from "@mantine/core";
import { writeBinaryFile, BaseDirectory } from "@tauri-apps/api/fs";

import { Dropzone } from "./components/Dropzone";
import { Sidebar } from "./components/Sidebar";

const App = () => {
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
      <Center inline={false} style={{ height: "100%", width: "100%" }}>
        {initialImage ? (
          <>
            <Container
              ref={wrapper}
              p={padding}
              style={{
                backgroundColor: "red",
              }}
            >
              <Image src={initialImage} />
            </Container>
            <Button onClick={onSave}>Save</Button>
          </>
        ) : (
          <Dropzone setImage={setInitialImage} />
        )}
      </Center>
    </AppShell>
  );
};

export default App;
