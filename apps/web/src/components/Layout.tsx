import {
  AppShell,
  Burger,
  Header,
  MediaQuery,
  Navbar,
  Popover,
  useMantineTheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import Link from 'next/link';
import { ReactNode, useState } from 'react';
import { Calendar, File, GitMerge, Home } from 'react-feather';
import { Messages } from 'tabler-icons-react';
import useBuildId from '../hooks/useBuildId';
import { HeaderUser } from './HeaderUser';
import LayoutLink from './LayoutLink';
import Logo from './Logo';

// Links
const links = [
  { icon: <Home size={16} />, color: 'teal', label: 'Koti', to: '/home' },
  {
    icon: <Messages size={16} />,
    color: 'orange',
    label: 'Viestit',
    to: '/messages',
  },
  {
    icon: <Calendar size={16} />,
    color: 'red',
    label: 'Työjärjestys',
    to: '/schedule',
  },
  { icon: <File size={16} />, color: 'grape', label: 'Kokeet', to: '/tests' },
];

export default function Layout({ children }: { children: ReactNode }) {
  const [opened, setOpened] = useState(false);
  const theme = useMantineTheme();
  const buildId = useBuildId();
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <AppShell
      // navbarOffsetBreakpoint controls when navbar should no longer be offset with padding-left
      navbarOffsetBreakpoint="sm"
      // fixed prop on AppShell will be automatically added to Header and Navbar
      fixed
      navbar={
        <Navbar
          p="md"
          // Breakpoint at which navbar will be hidden if hidden prop is true
          hiddenBreakpoint="sm"
          // Hides navbar when viewport size is less than value specified in hiddenBreakpoint
          hidden={!opened}
          // when viewport size is less than theme.breakpoints.sm navbar width is 100%
          // viewport size > theme.breakpoints.sm – width is 300px
          // viewport size > theme.breakpoints.lg – width is 400px
          width={{ sm: 300 }}
        >
          {/* First section with normal height (depends on section content) */}
          {/* <Navbar.Section>First section</Navbar.Section> */}
          { !isMobile ? ( <Navbar.Section>
            <Link href="/" passHref>
              <Logo isLink />
            </Link>
          </Navbar.Section> ) : <></> }
          <Navbar.Section grow>
            {links.map((ele) => (
              <LayoutLink key={ele.label} {...ele} />
            ))}
          </Navbar.Section>
          <Navbar.Section>
            <span
              style={{ display: "inline-flex", alignItems: "center" }}
              className="legend-label"
              >
              <GitMerge style={{ marginRight: '5px' }} /> {buildId}
            </span>
            <HeaderUser />
            <Popover position="bottom" placement="end" gutter={10} />
          </Navbar.Section>
        </Navbar>
      }
      header={
        <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
          <Header height={isMobile ? 70 : 0}>
            {/* Handle other responsive styles with MediaQuery component or createStyles function */}
            <div
              style={{ display: 'flex', alignItems: 'center', height: '100%' }}
            >
                <Burger
                  opened={opened}
                  onClick={() => setOpened((o) => !o)}
                  size="sm"
                  color={theme.colors.gray[6]}
                  sx={{ marginLeft: '16px'}}
                  mr="xl"
                />
                { isMobile ? ( <Navbar.Section>
                  <Link href="/" passHref>
                    <Logo isLink />
                  </Link>
                </Navbar.Section> ) : <></> }
            </div>
          </Header>
        </MediaQuery>
      }
      sx={{
        paddingLeft: '20px'
      }}
    >
      {children}
    </AppShell>
  );
}
