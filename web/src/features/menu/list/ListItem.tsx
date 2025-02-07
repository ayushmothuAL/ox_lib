import { Box, createStyles, Group, Progress, Stack, Text } from '@mantine/core';
import React, { forwardRef, useState } from 'react';
import CustomCheckbox from './CustomCheckbox';
import type { MenuItem } from '../../../typings';
import { isIconUrl } from '../../../utils/isIconUrl';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import LibIcon from '../../../components/LibIcon';

interface Props {
  item: MenuItem;
  index: number;
  scrollIndex: number;
  checked: boolean;
}

const useStyles = createStyles((theme, params: { iconColor?: string; isFocused: boolean }) => ({
  buttonContainer: {
    backgroundColor: params.isFocused ? 'rgba(112, 162, 204, 0.9)' : 'rgba(22, 22, 32, 0.8)',
    padding: 2,
    height: 60,
    scrollMargin: 0,
    borderRadius: 10,
    border: params.isFocused ? '2px solid rgba(30, 136, 229, 0.3)' : undefined,
    outline: 'none',
    transform: params.isFocused ? 'translateY(-2px) scale(1.05)' : undefined,
    transition: params.isFocused ? 'all 0.3s ease' : undefined,
  },
  iconImage: {
    maxWidth: 32,
  },
  buttonWrapper: {
    paddingLeft: 5,
    paddingRight: 12,
    height: '100%',
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    width: 32,
    height: 32,
  },
  icon: {
    fontSize: 24,
    color: params.isFocused ? 'white' : '#1E88E5',
    transition: 'color 0.2s ease',
  },
  label: {
    color: 'white',
    textTransform: 'uppercase',
    fontSize: 12,
    verticalAlign: 'middle',
    transition: 'color 0.2s ease',
  },
  chevronIcon: {
    fontSize: 14,
    color: 'white',
  },
  scrollIndexValue: {
    color: 'white',
    textTransform: 'uppercase',
    fontSize: 14,
  },
  progressStack: {
    width: '100%',
    marginRight: 5,
  },
  progressLabel: {
    verticalAlign: 'middle',
    marginBottom: 3,
  },
}));

const ListItem = forwardRef<Array<HTMLDivElement | null>, Props>(({ item, index, scrollIndex, checked }, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const { classes } = useStyles({ iconColor: item.iconColor, isFocused });

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  // Helper function to determine if a value is an object with a 'label' property
  const isLabelObject = (value: unknown): value is { label: string; description: string } => {
    return typeof value === 'object' && value !== null && 'label' in value;
  };

  // Helper function to safely get the label
  const getLabel = (value: string | { label: string; description: string }): string => {
    if (isLabelObject(value)) {
      return value.label;
    }
    return value;
  };

  return (
    <Box
      tabIndex={0}
      className={classes.buttonContainer}
      key={`item-${index}`}
      onFocus={handleFocus}
      onBlur={handleBlur}
      ref={(element: HTMLDivElement) => {
        if (ref)
          // @ts-ignore i cba
          return (ref.current = [...ref.current, element]);
      }}
    >
      <Group spacing={15} noWrap className={classes.buttonWrapper}>
        {item.icon && (
          <Box className={classes.iconContainer}>
            {typeof item.icon === 'string' && isIconUrl(item.icon) ? (
              <img src={item.icon} alt="Missing image" className={classes.iconImage} />
            ) : (
              <LibIcon
                icon={item.icon as IconProp}
                className={classes.icon}
                fixedWidth
                animation={item.iconAnimation}
              />
            )}
          </Box>
        )}
        {Array.isArray(item.values) ? (
          <Group position="apart" w="100%">
            <Stack spacing={0} justify="space-between">
              <Text className={classes.label}>{item.label}</Text>
              <Text className={classes.label}>
                {getLabel(item.values[scrollIndex])}
              </Text>
            </Stack>
            <Group spacing={1} position="center">
              <LibIcon icon="chevron-left" className={classes.chevronIcon} />
              <Text className={classes.scrollIndexValue}>
                {scrollIndex + 1}/{item.values.length}
              </Text>
              <LibIcon icon="chevron-right" className={classes.chevronIcon} />
            </Group>
          </Group>
        ) : item.checked !== undefined ? (
          <Group position="apart" w="100%">
            <Text className={classes.label}>{item.label}</Text>
            <CustomCheckbox checked={checked}></CustomCheckbox>
          </Group>
        ) : item.progress !== undefined ? (
          <Stack className={classes.progressStack} spacing={0}>
            <Text className={classes.label}>{item.label}</Text>
            <Progress
              value={item.progress}
              color={item.colorScheme || 'dark.0'}
              styles={(theme) => ({ root: { backgroundColor: theme.colors.dark[3] } })}
            />
          </Stack>
        ) : (
          <Text className={classes.label}>{item.label}</Text>
        )}
      </Group>
    </Box>
  );
});

export default React.memo(ListItem);