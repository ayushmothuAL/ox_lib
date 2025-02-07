import { Box, createStyles, Text } from '@mantine/core';
import React from 'react';

const useStyles = createStyles((theme) => ({
  container: {
    textAlign: 'center',
    color: 'white',
    backgroundColor: 'rgba(112, 162, 204, 0.4)',
    borderTop: 'solid 2px rgba(30, 136, 229, 0.53)',
    borderLeft: 'solid 2px rgba(30, 136, 229, 0.53)',
    borderRight: 'solid 2px rgba(30, 136, 229, 0.53)',
    borderBottom: 'none',
    height: 60,
    width: 384,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    textTransform: 'uppercase',
    fontWeight: 500,
  },
}));

const Header: React.FC<{ title: string }> = ({ title }) => {
  const { classes } = useStyles();

  return (
    <Box className={classes.container}>
      <Text className={classes.heading}>{title}</Text>
    </Box>
  );
};

export default React.memo(Header);