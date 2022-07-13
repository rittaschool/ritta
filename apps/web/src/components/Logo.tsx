import { FC } from "react";
import { Center, createStyles } from "@mantine/core";
// @ts-ignore
import rittaSvg from "../../static/logo.svg?component";

interface LogoProps {
  color?: string;
  SVG?: any;
}

const useStyles = createStyles((theme) => ({
  logo: {
    height: "70px",
    width: "100%",
  },

  svg: {
    height: "50%",
  },
}));

// #1abc9c is ritta primary color (green)
const Logo: FC<LogoProps> = ({ color = "#1abc9c", SVG = rittaSvg }) => {
  const { classes } = useStyles();

  return (
    <Center className={classes.logo}>
      <SVG fill={color} className={classes.svg} />
    </Center>
  );
};

export default Logo;
