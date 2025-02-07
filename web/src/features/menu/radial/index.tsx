import { Box, createStyles } from '@mantine/core';
import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useNuiEvent } from '../../../hooks/useNuiEvent';
import { fetchNui } from '../../../utils/fetchNui';
import { isIconUrl } from '../../../utils/isIconUrl';
import ScaleFade from '../../../transitions/ScaleFade';
import type { RadialMenuItem } from '../../../typings';
import { useLocales } from '../../../providers/LocaleProvider';
import LibIcon from '../../../components/LibIcon';

const BASE_DIMENSION = 350;
const INNER_RADIUS = 100;
const ICON_RADIUS = (BASE_DIMENSION/4 + INNER_RADIUS/2);
const HOVER_DISTANCE = 20;
const PAGE_ITEMS = 6;

const degToRad = (deg: number) => deg * (Math.PI / 180);

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  sector: {
    fill: "rgba(22, 22, 32, 0.5)",
    color: theme.colors.dark[0],
    filter: 'url(#dropShadow)',
    transition: 'all 0.2s ease-out', // Reduced transition time
    transformOrigin: 'center center',
    transformBox: 'fill-box',

    '&:hover': {
      fill: 'rgba(112, 162, 204, 0.5)',
      cursor: 'pointer',
      filter: 'url(#dropShadowHover)',
      '& path': {
        transform: 'var(--hover-transform)',
      },
      '& g': {
        transform: 'var(--hover-transform)',
      },
      '& text, & svg path': {
        opacity: 1,
        fill: 'white',
        color: 'white',
        strokeWidth: 2,
      },
    },
  },
  sectorPath: {
    transition: 'all 0.2s ease-out', // Reduced transition time
  },
  sectorContent: {
    transition: 'all 0.2s ease-out', // Reduced transition time
  },
  centerCircle: {
    fill: 'rgba(22, 22, 32)',
    color: '#fff',
    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
    '&:hover': {
      cursor: 'pointer',
      fill: 'rgba(112, 162, 204, 0.5)',
      filter: 'url(#dropShadow)',
      transform: 'scale(1.1)',
    },
    opacity: 0,
    '&.visible': {
      opacity: 1,
    },
  },
  centerIconContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
    opacity: 0,
    transition: 'opacity 0.3s ease',
    '&.visible': {
      opacity: 1,
    },
  },
  centerIcon: {
    color: '#fff',
    transition: 'color 0.3s ease',
  },
  activeLabel: {
    position: 'absolute',
    left: '50%',
    transform: 'translate(-50%, 0)',
    color: '#fff',
    fontSize: '16px',
    fontFamily: 'sans-serif',
    fontWeight: 550,
    textAlign: 'center',
    pointerEvents: 'none',
    opacity: 0,
    transition: 'opacity 0.3s ease',
    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
    '&.visible': {
      opacity: 1,
    },
    '&.withButton': {
      top: '50%',
      transform: 'translate(-50%, 50px)',
    },
    '&.withoutButton': {
      top: '50%',
      transform: 'translate(-50%, -50%)',
    },
  },
}));

const RadialMenu: React.FC = () => {
  const { classes } = useStyles();
  const { locale } = useLocales();
  const newDimension = BASE_DIMENSION * 1.1025;
  const [visible, setVisible] = useState(false);
  const [menuItems, setMenuItems] = useState<RadialMenuItem[]>([]);
  const [activeLabel, setActiveLabel] = useState("");
  const [menu, setMenu] = useState<{ items: RadialMenuItem[]; sub?: boolean; page: number }>({
    items: [],
    sub: false,
    page: 1,
  });

  // Ref to track hover state and prevent rapid flickering
  const hoverStateRef = useRef<{ [key: number]: boolean }>({});

  const showCenterButton = menu.page > 1 || menu.sub;

  const getHoverTransform = useCallback((angle: number) => {
    const rad = degToRad(angle);
    const x = Math.cos(rad) * HOVER_DISTANCE;
    const y = Math.sin(rad) * HOVER_DISTANCE;
    return `translate(${x}px, ${y}px) scale(1.05)`;
  }, []);

  const changePage = useCallback(async (increment?: boolean) => {
    setVisible(false);
    const didTransition: boolean = await fetchNui('radialTransition');
    if (!didTransition) return;
    setVisible(true);
    setMenu(prev => ({ ...prev, page: increment ? prev.page + 1 : prev.page - 1 }));
  }, []);

  useEffect(() => {
    if (menu.items.length <= PAGE_ITEMS) {
      setMenuItems(menu.items);
      return;
    }

    const startIndex = PAGE_ITEMS * (menu.page - 1) - (menu.page - 1);
    const endIndex = PAGE_ITEMS * menu.page - menu.page + 1;
    const items = menu.items.slice(startIndex, endIndex);

    if (PAGE_ITEMS * menu.page - menu.page + 1 < menu.items.length) {
      items[items.length - 1] = { icon: 'ellipsis-h', label: locale.ui.more, isMore: true };
    }

    setMenuItems(items);
  }, [menu.items, menu.page, locale.ui.more]);

  useNuiEvent('openRadialMenu', async (data: { items: RadialMenuItem[]; sub?: boolean; option?: string } | false) => {
    if (!data) {
      setVisible(false);
      return;
    }

    let initialPage = 1;
    if (data.option) {
      data.items.findIndex(
        (item, index) => item.menu == data.option && (initialPage = Math.floor(index / PAGE_ITEMS) + 1)
      );
    }

    setMenu({ ...data, page: initialPage });
    setVisible(true);
  });

  useNuiEvent('refreshItems', (data: RadialMenuItem[]) => {
    setMenu(prev => ({ ...prev, items: data }));
  });

  const handleContextMenu = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    if (menu.page > 1) await changePage();
    else if (menu.sub) fetchNui('radialBack');
  }, [menu.page, menu.sub, changePage]);

  const handleCenterClick = useCallback(async () => {
    if (menu.page > 1) await changePage();
    else {
      if (menu.sub) fetchNui('radialBack');
      else {
        setVisible(false);
        fetchNui('radialClose');
      }
    }
  }, [menu.page, menu.sub, changePage]);

  const handleSectorClick = useCallback(async (index: number, isMore?: boolean) => {
    const clickIndex = menu.page === 1 ? index : PAGE_ITEMS * (menu.page - 1) - (menu.page - 1) + index;
    if (!isMore) fetchNui('radialClick', clickIndex);
    else await changePage(true);
  }, [menu.page, changePage]);

  const handleMouseEnter = useCallback((index: number, label: string) => {
    // Debounce hover state to prevent rapid flickering
    if (!hoverStateRef.current[index]) {
      hoverStateRef.current[index] = true;
      setActiveLabel(label);
    }
  }, []);

  const handleMouseLeave = useCallback((index: number) => {
    // Reset hover state
    hoverStateRef.current[index] = false;
    setActiveLabel("");
  }, []);

  const renderSectors = useMemo(() => {
    return menuItems.map((item, index) => {
      const pieAngle = 360 / (menuItems.length < 3 ? 3 : menuItems.length);
      const angle = 270 + (index * pieAngle);
      const iconAngle = angle + pieAngle / 2;
      const iconX = BASE_DIMENSION/2 + Math.cos(degToRad(iconAngle)) * ICON_RADIUS;
      const iconY = BASE_DIMENSION/2 + Math.sin(degToRad(iconAngle)) * ICON_RADIUS;
      const iconWidth = Math.min(Math.max(item.iconWidth || 40, 0), 40);
      const iconHeight = Math.min(Math.max(item.iconHeight || 40, 0), 40);

      const startAngle = degToRad(angle);
      const endAngle = degToRad(angle + pieAngle);
      const centerX = BASE_DIMENSION/2;
      const centerY = BASE_DIMENSION/2;
      const outerRadius = BASE_DIMENSION/2;

      const x1 = centerX + INNER_RADIUS * Math.cos(startAngle);
      const y1 = centerY + INNER_RADIUS * Math.sin(startAngle);
      const x2 = centerX + outerRadius * Math.cos(startAngle);
      const y2 = centerY + outerRadius * Math.sin(startAngle);
      const x3 = centerX + outerRadius * Math.cos(endAngle);
      const y3 = centerY + outerRadius * Math.sin(endAngle);
      const x4 = centerX + INNER_RADIUS * Math.cos(endAngle);
      const y4 = centerY + INNER_RADIUS * Math.sin(endAngle);

      const largeArcFlag = pieAngle > 180 ? 1 : 0;

      return (
        <g
          key={index}
          className={classes.sector}
          onClick={() => {
            const clickIndex = menu.page === 1 ? index : PAGE_ITEMS * (menu.page - 1) - (menu.page - 1) + index;
            if (!item.isMore) fetchNui('radialClick', clickIndex);
            else changePage(true);
          }}
          onMouseEnter={() => handleMouseEnter(index, item.label)}
          onMouseLeave={() => handleMouseLeave(index)}
          style={{
            '--hover-transform': getHoverTransform(iconAngle),
          } as React.CSSProperties}
        >
          <path
            className={classes.sectorPath}
            d={`
              M ${x1} ${y1}
              L ${x2} ${y2}
              A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x3} ${y3}
              L ${x4} ${y4}
              A ${INNER_RADIUS} ${INNER_RADIUS} 0 ${largeArcFlag} 0 ${x1} ${y1}
              Z
            `}
          />
          <g className={classes.sectorContent}>
            {typeof item.icon === 'string' && isIconUrl(item.icon) ? (
              <image
                href={item.icon}
                width={iconWidth}
                height={iconHeight}
                x={iconX - iconWidth/2}
                y={iconY - iconHeight/2}
              />
            ) : (
              <LibIcon
                x={iconX - 15}
                y={iconY - 15}
                icon={item.icon as IconProp}
                width={30}
                height={30}
                fixedWidth
              />
            )}
          </g>
        </g>
      );
    });
  }, [
    menuItems, 
    classes, 
    menu.page, 
    getHoverTransform, 
    changePage, 
    handleMouseEnter, 
    handleMouseLeave
  ]);
  return (
    <>
      <Box
        className={classes.wrapper}
        onContextMenu={handleContextMenu}
      >
        <ScaleFade visible={visible}>
          <svg
            style={{ overflow: 'visible' }}
            width={`${newDimension}px`}
            height={`${newDimension}px`}
            viewBox={`0 0 ${BASE_DIMENSION} ${BASE_DIMENSION}`}
          >
            <defs>
              <filter id="dropShadow" x="-20%" y="-20%" width="120%" height="140%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                <feOffset dx="2" dy="2" result="offsetblur" />
                <feComponentTransfer>
                  <feFuncA type="linear" slope="0.4" />
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              
              <filter id="dropShadowHover" x="-20%" y="-20%" width="120%" height="140%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
                <feOffset dx="2" dy="4" result="offsetblur" />
                <feComponentTransfer>
                  <feFuncA type="linear" slope="0.5" />
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {renderSectors}

            <g
              transform={`translate(${BASE_DIMENSION/2}, ${BASE_DIMENSION/2})`}
              onClick={handleCenterClick}
            >
              <circle 
                r={28} 
                className={`${classes.centerCircle} ${showCenterButton ? 'visible' : ''}`} 
              />
            </g>
          </svg>
          
          <div className={`${classes.centerIconContainer} ${showCenterButton ? 'visible' : ''}`}>
            <LibIcon
              icon={!menu.sub && menu.page < 2 ? 'xmark' : 'arrow-rotate-left'}
              fixedWidth
              className={classes.centerIcon}
              color="#fff"
              size="lg"
            />
          </div>
          
          <div 
            className={`
              ${classes.activeLabel} 
              ${activeLabel ? 'visible' : ''} 
              ${showCenterButton ? 'withButton' : 'withoutButton'}
            `}
          >
            {activeLabel}
          </div>
        </ScaleFade>
      </Box>
    </>
  );
};

export default RadialMenu;