import { MantineSize, MANTINE_SIZES } from "@mantine/core";

/**
 * Remove "xs" size from the list of sizes.
 */
const CUSTOM_SIZES = MANTINE_SIZES.slice(1);

export const PADDING_OPTIONS = CUSTOM_SIZES;
export const DEFAULT_PADDING = PADDING_OPTIONS[2];

export const RADIUS_OPTIONS = CUSTOM_SIZES;
export const DEFAULT_RADIUS = PADDING_OPTIONS[2];

export const SHADOW_OPTIONS = CUSTOM_SIZES;
export const DEFAULT_SHADOW = SHADOW_OPTIONS[2];

export const GRADIENT_OPTIONS = [
  "linear-gradient(120deg, #fccb90 0%, #d57eeb 100%)",
  "linear-gradient(90deg, hsla(339, 100%, 55%, 1) 0%, hsla(197, 100%, 64%, 1) 100%)",
  "linear-gradient(to right, #b8cbb8 0%, #b8cbb8 0%, #b465da 0%, #cf6cc9 33%, #ee609c 66%, #ee609c 100%)",
  "linear-gradient(90deg, hsla(64, 41%, 92%, 1) 0%, hsla(196, 83%, 84%, 1) 50%, hsla(305, 75%, 83%, 1) 100%)",
  "linear-gradient(to right, #92fe9d 0%, #00c9ff 100%)",
];
export const DEFAULT_GRADIENT = GRADIENT_OPTIONS[0];

export interface DefaultImageStyles {
  padding: MantineSize;
  radius: MantineSize;
  shadow: MantineSize;
  gradient: string;
}

export const DEFAULT_IMAGE_STYLES: DefaultImageStyles = {
  padding: DEFAULT_PADDING,
  radius: DEFAULT_RADIUS,
  shadow: DEFAULT_SHADOW,
  gradient: DEFAULT_GRADIENT,
};

export const KEYBINDINGS = {
  togglePadding: "P",
  toggleRadius: "R",
  toggleShadow: "S",
  toggleBackground: "B",
};
