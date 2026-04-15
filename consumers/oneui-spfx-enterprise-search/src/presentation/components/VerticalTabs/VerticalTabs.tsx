import * as React from "react";

import {
  Button,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Overflow,
  OverflowItem,
  Tab,
  TabList,
  useIsOverflowItemVisible,
  useOverflowMenu
} from "@fluentui/react-components";

import type { VerticalConfig } from "../../../domain/search/contracts/VerticalConfig";
import type { VerticalKey } from "../../../domain/search/models/verticalKey";
import styles from "./VerticalTabs.module.scss";

const overflowPopoverStyle: React.CSSProperties = {
  backdropFilter: "none",
  background: "#ffffff",
  border: "1px solid rgba(15, 23, 42, 0.08)",
  boxShadow: "0 12px 32px rgba(15, 23, 42, 0.18)",
  zIndex: 20
};

type VerticalTabsProps = {
  onSelect: (verticalKey: VerticalKey) => Promise<void>;
  selectedVerticalKey: VerticalKey;
  verticals: VerticalConfig[];
};

type VerticalTabsOverflowMenuProps = {
  onSelect: (verticalKey: VerticalKey) => Promise<void>;
  verticals: VerticalConfig[];
};

type OverflowMenuItemProps = {
  children: React.ReactNode;
  onSelect: (verticalKey: VerticalKey) => Promise<void>;
  verticalKey: VerticalKey;
};

function OverflowMenuItem({
  children,
  onSelect,
  verticalKey
}: OverflowMenuItemProps): React.ReactElement {
  const isVisible = useIsOverflowItemVisible(verticalKey);

  if (isVisible) {
    return <></>;
  }

  return (
    <MenuItem
      onClick={() => {
        onSelect(verticalKey).then(
          () => undefined,
          () => undefined
        );
      }}
    >
      {children}
    </MenuItem>
  );
}

function VerticalTabsOverflowMenu({
  onSelect,
  verticals
}: VerticalTabsOverflowMenuProps): React.ReactElement {
  const { ref, isOverflowing } = useOverflowMenu<HTMLButtonElement>();

  if (!isOverflowing) {
    return <></>;
  }

  return (
    <Menu positioning="below-end">
      <MenuTrigger disableButtonEnhancement>
        <Button appearance="subtle" ref={ref} shape="rounded">
          …
        </Button>
      </MenuTrigger>

      <MenuPopover style={overflowPopoverStyle}>
        <MenuList>
          {verticals.map((vertical) => (
            <OverflowMenuItem
              key={vertical.key}
              onSelect={onSelect}
              verticalKey={vertical.key}
            >
              {vertical.title}
            </OverflowMenuItem>
          ))}
        </MenuList>
      </MenuPopover>
    </Menu>
  );
}

export const VerticalTabs = (props: VerticalTabsProps): React.ReactElement => {
  const { onSelect, selectedVerticalKey, verticals } = props;

  return (
    <Overflow minimumVisible={1} overflowAxis="horizontal" overflowDirection="end" padding={24}>
      <div className={styles.root}>
        <TabList
          className={styles.tabList}
          onTabSelect={(_, data) => onSelect(data.value as VerticalKey).then(() => undefined)}
          selectedValue={selectedVerticalKey}
          size="medium"
        >
          {verticals.map((vertical, index) => {
            const isSelected = vertical.key === selectedVerticalKey;
            const overflowProps = isSelected
              ? { pinned: true as const }
              : { priority: verticals.length - index };

            return (
              <OverflowItem
                key={vertical.key}
                id={vertical.key}
                {...overflowProps}
              >
                <Tab value={vertical.key}>{vertical.title}</Tab>
              </OverflowItem>
            );
          })}
        </TabList>

        <VerticalTabsOverflowMenu onSelect={onSelect} verticals={verticals} />
      </div>
    </Overflow>
  );
};
