import { AppShell } from "@mantine/core";
import { Sidebar } from "./components/Sidebar";

function Demo() {
  return (
    <AppShell padding="md" navbar={<Sidebar />}>
      {/* Your application here */}
      Hello World
    </AppShell>
  );
}

export default Demo;
