import {
  Center,
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
import {
  PADDING_OPTIONS,
  GRADIENT_OPTIONS,
  DefaultImageStyles,
} from "../lib/config";
import { CheckIcon } from "./Icons";

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
    gradientContainer: {
      color: theme.white,
      height: 24,
      width: 24,
      borderRadius: 12,
      boxShadow:
        "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    },
  };
});

interface SidebarProps {
  imageStyles: DefaultImageStyles;
  setImageStyles: React.Dispatch<React.SetStateAction<DefaultImageStyles>>;
}
export const Sidebar: React.FC<SidebarProps> = ({
  imageStyles,
  setImageStyles,
}) => {
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
              value={imageStyles.padding}
              onChange={value =>
                setImageStyles({ ...imageStyles, padding: value as string })
              }
            >
              {PADDING_OPTIONS.map(value => (
                <Chip key={value} value={value}>
                  {value}
                </Chip>
              ))}
            </Chips>
          </Stack>

          <Stack spacing="xs">
            <Text className={classes.sectionTitle}>Background</Text>
            <Group>
              {GRADIENT_OPTIONS.map(value => (
                <Center
                  key={value}
                  className={classes.gradientContainer}
                  sx={{ background: value }}
                  onClick={() =>
                    setImageStyles({ ...imageStyles, gradient: value })
                  }
                >
                  {value === imageStyles.gradient && <CheckIcon />}
                </Center>
              ))}
            </Group>
          </Stack>
        </Stack>
      </Navbar.Section>
    </Navbar>
  );
};
