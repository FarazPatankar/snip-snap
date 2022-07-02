import { Code, createStyles, Group, Navbar, Title } from "@mantine/core";

const useStyles = createStyles(theme => {
  return {
    navbar: {
      backgroundColor: theme.colors.pink[6],
    },
    title: {
      color: theme.white,
    },
    version: {
      backgroundColor: theme.colors.pink[7],
      color: theme.white,
      fontWeight: 600,
    },
  };
});

export const Sidebar = () => {
  const { classes } = useStyles();
  return (
    <Navbar width={{ base: 300 }} p="md" className={classes.navbar}>
      <Navbar.Section>
        <Group position="apart">
          <Title order={2} className={classes.title}>
            SnipSnap
          </Title>
          <Code className={classes.version}>0.0.1</Code>
        </Group>
      </Navbar.Section>
    </Navbar>
  );
};
