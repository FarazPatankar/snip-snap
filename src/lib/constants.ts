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
  "linear-gradient(45deg, hsl(166deg 75% 66%) 0%, hsl(183deg 84% 64%) 10%, hsl(191deg 100% 72%) 20%, hsl(202deg 100% 81%) 30%, hsl(231deg 100% 90%) 40%, hsl(281deg 76% 89%) 50%, hsl(312deg 84% 82%) 60%, hsl(328deg 100% 76%) 70%, hsl(339deg 100% 68%) 80%, hsl(348deg 100% 59%) 90%, hsl(0deg 100% 50%) 100%)",
  "radial-gradient(circle farthest-corner at 12.3% 19.3%,  rgba(85,88,218,1) 0%, rgba(95,209,249,1) 100.2%)",
  "linear-gradient(to right, rgb(242, 112, 156), rgb(255, 148, 114))",
  "linear-gradient(to right, rgb(182, 244, 146), rgb(51, 139, 147))",
  "linear-gradient(109.6deg,  rgba(253,199,141,1) 11.3%, rgba(249,143,253,1) 100.2%)",
  "linear-gradient(109.6deg,  rgba(156,252,248,1) 11.2%, rgba(110,123,251,1) 91.1% )",
  "linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)",
  "radial-gradient(circle farthest-corner at 10% 20%,  rgba(222,168,248,1) 0%, rgba(168,222,248,1) 21.8%, rgba(189,250,205,1) 35.6%, rgba(243,250,189,1) 52.9%, rgba(250,227,189,1) 66.8%, rgba(248,172,172,1) 90%, rgba(254,211,252,1) 99.7%)",
  "radial-gradient(circle farthest-corner at 10% 20%, rgba(255,94,247,1) 17.8%, rgba(2,245,255,1) 100.2%)",
  "linear-gradient(122.3deg, rgba(111,71,133,1) 14.6%, rgba(232,129,166,1) 29.6%, rgba(237,237,183,1) 42.1%, rgba(244,166,215,1) 56.7%, rgba(154,219,232,1) 68.7%, rgba(238,226,159,1) 84.8%)",
  "linear-gradient(109.6deg, rgba(48,207,208,1) 11.2%, rgba(51,8,103,1) 92.5%)",
  "linear-gradient(to right, #ad5389, #3c1053)",
  "radial-gradient(circle farthest-corner at 10% 20%, rgba(14,174,87,1) 0%, rgba(12,116,117,1) 90%)",
  "linear-gradient(25deg,#d64c7f,#ee4758 50%)",
  "radial-gradient(circle farthest-corner at 10% 20%, rgba(255,200,124,1) 0%, rgba(252,251,121,1) 90%)",
  "linear-gradient(132deg, #F4D03F 0%, #16A085 100%)",
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
  saveImage: "mod+S",
  copyImage: "mod+C",
  pasteImage: "mod+V",
  reset: "mod+R",
};
