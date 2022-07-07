import {
  Center,
  Chip,
  Code,
  createStyles,
  Group,
  Kbd,
  MantineSize,
  Navbar,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  PADDING_OPTIONS,
  GRADIENT_OPTIONS,
  DefaultImageStyles,
  RADIUS_OPTIONS,
  KEYBINDINGS,
  SHADOW_OPTIONS,
} from "../lib/constants";
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
      border: `1px solid ${theme.colors.gray[4]}`,
      boxShadow: theme.shadows.md,
    },
    kbd: {
      height: 20,
      width: 20,
      paddingTop: 0,
    },
  };
});

interface SidebarItemProps {
  title: string;
  keybinding: string;
  value: string;
  options: MantineSize[];
  onChange: (value: MantineSize) => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  title,
  keybinding,
  value,
  options,
  onChange,
}) => {
  const { classes } = useStyles();

  return (
    <Stack spacing="xs">
      <Group spacing="xs">
        <Text className={classes.sectionTitle}>{title}</Text>
        <Kbd className={classes.kbd}>{keybinding}</Kbd>
      </Group>
      <Chip.Group
        value={value}
        onChange={value => onChange(value as MantineSize)}
      >
        {options.map(option => (
          <Chip
            key={option}
            value={option}
            size="xs"
            variant="outline"
            color="pink"
          >
            {option}
          </Chip>
        ))}
      </Chip.Group>
    </Stack>
  );
};

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
        <Stack spacing="xl">
          <Group position="apart">
            <Title order={2} className={classes.title}>
              SnipSnap
            </Title>
            <Code className={classes.version}>0.0.5</Code>
          </Group>

          <SidebarItem
            title="Padding"
            keybinding={KEYBINDINGS.togglePadding}
            value={imageStyles.padding.toString()}
            options={PADDING_OPTIONS}
            onChange={value =>
              setImageStyles({ ...imageStyles, padding: value })
            }
          />

          <SidebarItem
            title="Radius"
            keybinding={KEYBINDINGS.toggleRadius}
            value={imageStyles.radius.toString()}
            options={RADIUS_OPTIONS}
            onChange={value =>
              setImageStyles({ ...imageStyles, radius: value })
            }
          />

          <SidebarItem
            title="Shadow"
            keybinding={KEYBINDINGS.toggleShadow}
            value={imageStyles.shadow.toString()}
            options={SHADOW_OPTIONS}
            onChange={value =>
              setImageStyles({ ...imageStyles, shadow: value })
            }
          />

          <Stack spacing="xs">
            <Group spacing="xs">
              <Text className={classes.sectionTitle}>Background</Text>
              <Kbd className={classes.kbd}>{KEYBINDINGS.toggleBackground}</Kbd>
            </Group>
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
