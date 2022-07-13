import { FC } from 'react';
import { createStyles } from '@mantine/core';
import rittaSvg from '../assets/Ritta.svg';

interface LogoProps {
  color?: string;
  SVG?: any;
  isLink?: boolean;
}

const useStyles = createStyles((theme) => ({
  logo: {
    alignItems: 'center',
    display: 'flex',
    height: '60px',
    width: '100%',
    [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
      marginLeft: '32px'
    },
  },

  svg: {
    height: '40%',
  },
}));

// #1abc9c is ritta primary color (green)
const Logo: FC<LogoProps> = ({
  color = '#1abc9c',
  SVG = rittaSvg,
  isLink,
}) => {
  const { classes } = useStyles();

  return isLink ? (
    <a className={classes.logo}>
      <SVG fill={color} className={classes.svg} />
    </a>
  ) : (
    <div className={classes.logo}>
      <SVG fill={color} className={classes.svg} />
    </div>
  );
};

export default Logo;
