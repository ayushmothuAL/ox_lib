import React, { useState, useEffect } from 'react';
import { Box, Text, createStyles, keyframes } from '@mantine/core';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';

const popOut = keyframes({
  '0%': { transform: 'scale(1)' },
  '50%': { transform: 'scale(1.08)' },
  '100%': { transform: 'scale(0)' },
});

const useStyles = createStyles((theme) => ({
  progressContainer: {
    display: 'none',
    zIndex: 5,
    color: '#fff',
    width: '19%',
    position: 'fixed',
    bottom: '9%',
    left: 0,
    right: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
    fontSize: '2.7vh',
    fontFamily: '"Pathway Gothic One", sans-serif',
    fontStyle: 'normal',
  },
  progressLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontFamily: 'sans-serif',
    fontWeight: 550,
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: '18px',
    lineHeight: '4vh',
    position: 'relative',
    color: '#ffffff',
    zIndex: 10,
    fontWeight: 'bold',
    textShadow: '0 0 10px rgba(255, 255, 255, 0.7)',
    display: 'flex',
    alignItems: 'center',
  },
  loadingDots: {
    width: '20px',
    display: 'inline-block',
    textAlign: 'left',
    marginLeft: '5px',
  },
  progressPercentage: {
    fontSize: '1.7vh',
    lineHeight: '4vh',
    position: 'relative',
    color: '#fff',
    zIndex: 10,
    fontWeight: 'bold',
    textShadow: '0 0 10px rgba(30, 136, 229, 0.7)',
  },
  progressBarContainer: {
    background: `repeating-linear-gradient(
      135deg,
      #828686,
      #828686 1.4px,
      transparent 3px,
      transparent 4px
    )`,
    height: '0.9vh',
    position: 'relative',
    display: 'block',
    borderRadius: '4px',
    overflow: 'hidden',
    outline: '2px solid rgba(255, 255, 255, 0.3)',
  },
  progressBar: {
    backgroundColor: '#1E88E5',
    width: '0%',
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.3s',
    transitionTimingFunction: 'ease-out',
    boxShadow: '0 0 30px #c2ff49cb, 0 0 15px #1E88E5',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  popOut: {
    // animation: `${popOut} 0.5s ease-out forwards`,
  },
}));

const LoadingDots: React.FC = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '') return '.';
        if (prev === '.') return '..';
        if (prev === '..') return '...';
        return '';
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return <span>{dots}</span>;
};

const Progressbar: React.FC = () => {
  const { classes, cx } = useStyles();
  const [visible, setVisible] = useState(false);
  const [label, setLabel] = useState('');
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useNuiEvent('progressCancel', () => {
    setVisible(false);
    setLabel('CANCELLED');
    setProgress(100);
    setTimeout(() => {
      setVisible(false);
      setProgress(0);
      setIsComplete(false);
    }, 1000);
  });

  useNuiEvent('progress', (data: { label: string; duration: number }) => {
    setVisible(true);
    setLabel(data.label);
    setDuration(data.duration);
    setProgress(0);
    setIsComplete(false);
  });

  useEffect(() => {
    if (visible && duration > 0) {
      const startTime = Date.now();
      const animateProgress = () => {
        const timeElapsed = Date.now() - startTime;
        const newProgress = Math.min((timeElapsed / duration) * 100, 100);
        setProgress(newProgress);

        if (newProgress < 100) {
          requestAnimationFrame(animateProgress);
        } else {
          setIsComplete(true);
          setTimeout(() => {
            setVisible(false);
            fetchNui('progressComplete');
          }, 500);
        }
      };

      requestAnimationFrame(animateProgress);
    }
  }, [visible, duration]);

  if (!visible) return null;

  return (
    <Box className={cx(classes.progressContainer, { [classes.popOut]: isComplete })} style={{ display: 'block' }}>
      <Box className={classes.progressLabels}>
        <Text className={classes.progressLabel}>
          {label}
          <span className={classes.loadingDots}>
            <LoadingDots />
          </span>
        </Text>
        <Text className={classes.progressPercentage}>{`${Math.round(progress)}%`}</Text>
      </Box>
      <Box className={classes.progressBarContainer}>
        <Box 
          className={classes.progressBar} 
          style={{ 
            width: `${progress}%`,
            transition: 'none',
            display: 'block',
          }} 
        />
      </Box>
    </Box>
  );
};

export default Progressbar;