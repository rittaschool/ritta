import React, { FC } from "react";
import { Center, createStyles } from "@mantine/core";
// @ts-ignore
import rittaSvg from "/static/logo.svg?component";

interface LogoProps {
  color?: string;
  SVG?: any;
  center?: boolean;
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
const Logo: FC<LogoProps> = ({
  color = "#1abc9c",
  SVG = rittaSvg,
  center = true,
}) => {
  const { classes } = useStyles();

  return center ? (
    <Center className={classes.logo}>
      <SVG fill={color} className={classes.svg} />
    </Center>
  ) : (
    <div className={classes.logo}>
      <SVG fill={color} className={classes.svg} />
    </div>
  );
};

export default Logo;
