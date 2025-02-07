import { Button, createStyles } from '@mantine/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import LibIcon from '../../../../components/LibIcon';

interface Props {
  icon: IconProp;
  canClose?: boolean;
  iconSize: number;
  handleClick: () => void;
}

const useStyles = createStyles((theme, params: { canClose?: boolean }) => ({
  button: {
    flex: '1 15%',
    alignSelf: 'stretch',
    height: 'auto',
    textAlign: 'center',
    justifyContent: 'center',
    backgroundColor: "rgba(112, 162, 204, 0.5)",
    border: '1px solid rgba(30, 136, 229, 0.3)',
    borderRadius: 8,
    padding: 2,
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: "rgba(112, 162, 225, 0.5)",
    border: '1px solid rgba(30, 136, 229, 0.8)',
    transform: 'translateY(-2px) scale(1.05)',
    boxShadow: '0 0 10px rgba(30, 136, 229, 0.6)',
    },
  },
  root: {
    border: 'none',
  },
  label: {
    color: params.canClose === false ? theme.colors.dark[2] : theme.colors.dark[0],
    transition: 'color 0.2s ease, transform 0.2s ease',
    '&:hover': {
      color: theme.colors.red[6],
      transform: 'translateY(-2px) scale(1.05)',
    },
  }
}));

const HeaderButton: React.FC<Props> = ({ icon, canClose, iconSize, handleClick }) => {
  const { classes } = useStyles({ canClose });

  return (
    <Button
      variant="default"
      className={classes.button}
      classNames={{ label: classes.label, root: classes.root }}
      disabled={canClose === false}
      onClick={handleClick}
    >
      <LibIcon icon={icon} fontSize={iconSize} fixedWidth />
    </Button>
  );
};

export default HeaderButton;