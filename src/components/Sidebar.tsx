import {
  Chip,
  Chips,
  Code,
  createStyles,
  Group,
  Navbar,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { PADDING_OPTIONS } from "../lib/config";

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
    sectionTitle: {
      color: theme.white,
      fontWeight: 600,
      fontSize: theme.fontSizes.xs,
      textTransform: "uppercase",
    },
  };
});

interface SidebarProps {
  padding: string;
  setPadding: React.Dispatch<React.SetStateAction<string>>;
}
export const Sidebar: React.FC<SidebarProps> = ({ padding, setPadding }) => {
  const { classes } = useStyles();
  return (
    <Navbar width={{ base: 300 }} p="md" className={classes.navbar}>
      <Navbar.Section>
        <Stack spacing="lg">
          <Group position="apart">
            <Title order={2} className={classes.title}>
              SnipSnap
            </Title>
            <Code className={classes.version}>0.0.1</Code>
          </Group>

          <Stack spacing="xs">
            <Text className={classes.sectionTitle}>Padding</Text>
            <Chips
              size="xs"
              color="pink"
              variant="outline"
              value={padding}
              onChange={value => setPadding(value as string)}
            >
              {PADDING_OPTIONS.map(value => (
                <Chip key={value} value={value}>
                  {value}
                </Chip>
              ))}
            </Chips>
          </Stack>
        </Stack>
      </Navbar.Section>
    </Navbar>
  );
};
