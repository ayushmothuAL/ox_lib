import { Button, createStyles, Group, HoverCard, Image, Progress, Stack, Text } from '@mantine/core';
import ReactMarkdown from 'react-markdown';
import { ContextMenuProps, Option } from '../../../../typings';
import { fetchNui } from '../../../../utils/fetchNui';
import { isIconUrl } from '../../../../utils/isIconUrl';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import MarkdownComponents from '../../../../config/MarkdownComponents';
import LibIcon from '../../../../components/LibIcon';
import React from 'react';

const openMenu = (id: string | undefined) => {
  fetchNui<ContextMenuProps>('openContext', { id: id, back: false });
};

const clickContext = (id: string) => {
  fetchNui('clickContext', id);
};

const useStyles = createStyles((theme) => ({
  inner: {
    justifyContent: 'flex-start',
  },
  label: {
    width: '100%',
    color: theme.white,
    whiteSpace: 'pre-wrap',
    transition: 'color 0.2s ease',
  },
  button: {
    height: 'fit-content',
    width: '100%',
    backgroundColor: 'rgba(22, 22, 32, 0.5)',
    borderRadius: 10,
    padding: theme.spacing.md,
    fontWeight: 400,
    transition: 'all 0.3s ease',
    
    '&:hover': {
      backgroundColor: "rgba(112, 162, 204, 0.5)",
      border: '1px solid rgba(30, 136, 229, 0.3)',
      transform: 'translateY(-2px) scale(0.9)',
      fontWeight: 400,
    },
    '&:disabled': {
      backgroundColor: 'rgba(22, 22, 32, 0.9)',
      boxShadow: 
        'inset 0 20px 20px -20px rgba(0, 0, 0, 0.87), ' +
        'inset 0 -20px 20px -20px rgba(0, 0, 0, 0.87)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
  },
  iconImage: {
    width: '24px',
    height: '24px',
    maxWidth: '24px',
    maxHeight:'24px',
    borderRadius: theme.radius.sm,
  },
  description: {
    color: theme.colors.gray[5],
    fontSize: theme.fontSizes.xs,
  },
  dropdown: {
    padding: theme.spacing.md,
    backgroundColor: 'rgba(22, 22, 32, 0.5)',
    fontSize: theme.fontSizes.sm,
    maxWidth: 300,
    width: 'fit-content',
    border: '2px solid rgba(30, 136, 229, 0.53)',
    borderRadius: theme.radius.md,
  },
  buttonStack: {
    gap: theme.spacing.xs,
    flex: '1',
  },
  buttonGroup: {
    gap: theme.spacing.xs,
    flexWrap: 'nowrap',
  },
  buttonIconContainer: {
    color: theme.white,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'color 0.2s ease',
  },
  buttonTitleText: {
    overflowWrap: 'break-word',
    fontWeight: 500,
  },
  buttonArrowContainer: {
    color: theme.white,
    justifyContent: 'center',
    alignItems: 'center',
    width: 28,
    height: 28,
    transition: 'transform 0.2s ease',
  },
}));

const ContextButton: React.FC<{
  option: [string, Option];
}> = ({ option }) => {
  const button = option[1];
  const buttonKey = option[0];
  const { classes, theme } = useStyles();

  return (
    <HoverCard
      position="left-start"
      disabled={button.disabled || !(button.metadata || button.image)}
      openDelay={200}
    >
      <HoverCard.Target>
        <Button
          classNames={{ inner: classes.inner, label: classes.label, root: classes.button }}
          onClick={() =>
            !button.disabled && !button.readOnly
              ? button.menu
                ? openMenu(button.menu)
                : clickContext(buttonKey)
              : null
          }
          variant="default"
          disabled={button.disabled}
        >
          <Group position="apart" w="100%" noWrap>
            <Stack className={classes.buttonStack}>
              {(button.title || Number.isNaN(+buttonKey)) && (
                <Group className={classes.buttonGroup}>
                  {button?.icon && (
                    <Stack className={classes.buttonIconContainer}>
                      {typeof button.icon === 'string' && isIconUrl(button.icon) ? (
                        <img src={button.icon} className={classes.iconImage} alt="Icon" />
                      ) : (
                        <LibIcon
                          icon={button.icon as IconProp}
                          fixedWidth
                          size="lg"
                          style={{ color: button.iconColor || 'white' }}
                          animation={button.iconAnimation}
                        />
                      )}
                    </Stack>
                  )}
                  <Text className={classes.buttonTitleText}>
                    <ReactMarkdown components={MarkdownComponents}>{button.title || buttonKey}</ReactMarkdown>
                  </Text>
                </Group>
              )}
              {button.description && (
                <Text className={classes.description}>
                  <ReactMarkdown components={MarkdownComponents}>{button.description}</ReactMarkdown>
                </Text>
              )}
              {button.progress !== undefined && (
                <Progress value={button.progress} size="sm" color={button.colorScheme || theme.colors.blue[5]} />
              )}
            </Stack>
            {(button.menu || button.arrow) && button.arrow !== false && (
              <Stack className={classes.buttonArrowContainer}>
                <LibIcon icon="chevron-right" fixedWidth />
              </Stack>
            )}
          </Group>
        </Button>
      </HoverCard.Target>
      <HoverCard.Dropdown className={classes.dropdown}>
        {button.image && <Image src={button.image} radius="md" mb="sm" />}
        {Array.isArray(button.metadata) ? (
          button.metadata.map(
            (
              metadata: string | { label: string; value?: any; progress?: number; colorScheme?: string },
              index: number
            ) => (
              <Stack key={`context-metadata-${index}`} spacing="xs">
                <Text>
                  {typeof metadata === 'string' ? `${metadata}` : `${metadata.label}: ${metadata?.value ?? ''}`}
                </Text>
                {typeof metadata === 'object' && metadata.progress !== undefined && (
                  <Progress
                    value={metadata.progress}
                    size="sm"
                    color={metadata.colorScheme || button.colorScheme || theme.colors.blue[5]}
                  />
                )}
              </Stack>
            )
          )
        ) : (
          <>
            {typeof button.metadata === 'object' &&
              Object.entries(button.metadata).map((metadata: { [key: string]: any }, index) => (
                <Text key={`context-metadata-${index}`}>
                  {metadata[0]}: {metadata[1]}
                </Text>
              ))}
          </>
        )}
      </HoverCard.Dropdown>
    </HoverCard>
  );
};

export default ContextButton;