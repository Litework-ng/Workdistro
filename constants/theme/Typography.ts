import { COLOR_VARIABLES } from "./ColorVariables";
export const FONT_FAMILY = {
  header: "ManropeBold",
  subHeader:"ManropeMedium",
  body: "ManropeRegular",
  title:"ManropeSemiBold",
  button: "ManropeBold",

};

export const FONT_SIZE = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
  al: 37,
  xxl: 48,
  xxxl: 56,
};

export const FONT_WEIGHT = {
  regular: "400",
  medium: "500",
  bold: "700",
};

// Predefined text styles
export const TEXT_STYLES = {
  h1: {
    fontSize: FONT_SIZE.xl,
    fontFamily: FONT_FAMILY.header,
    color: COLOR_VARIABLES.textSurfaceGen,
  },
  h2: {
    fontSize: FONT_SIZE.al,
  
    color: COLOR_VARIABLES.textSurfacePrimary,

  },
  h3: {
    fontSize: FONT_SIZE.lg,
    color: COLOR_VARIABLES.textSurfacePrimary,
    fontFamily: FONT_FAMILY.body,
  },

  header:{
    fontSize: FONT_SIZE.lg,
    color: COLOR_VARIABLES.textSurfacePrimary,
    fontFamily: FONT_FAMILY.button,

  },

  subHeader: {
    fontSize: FONT_SIZE.xl,
    fontFamily:FONT_FAMILY.subHeader,
    color: COLOR_VARIABLES.textSurfacePrimary,
  },
  body: {
    fontSize: FONT_SIZE.md,
    color: COLOR_VARIABLES.textSurfacePrimary,
    fontFamily: FONT_FAMILY.body,
  },
  title:{
    fontSize: FONT_SIZE.md,
    color: COLOR_VARIABLES.textSurfaceGen,
    fontFamily: FONT_FAMILY.title,
    
  },
  description:{
    fontSize: FONT_SIZE.sm,
    color: COLOR_VARIABLES.textShade,
    fontFamily: FONT_FAMILY.body,
    
  },
  label:{
    fontSize: FONT_SIZE.sm,
    color: COLOR_VARIABLES.textSurfaceGen,
    fontFamily: FONT_FAMILY.body,
    
  },
  buttonText: {
    fontSize: FONT_SIZE.md,
    color: COLOR_VARIABLES.textSurfacePrimary,
    fontFamily: FONT_FAMILY.button,
  },
  secondaryButtonText: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONT_FAMILY.title,
    color: COLOR_VARIABLES.textSurfacePrimary,
  },
  caption:{
    fontSize: FONT_SIZE.xs,
    fontFamily: FONT_FAMILY.body,
    color: COLOR_VARIABLES.textSurfaceGen,

  },
};
