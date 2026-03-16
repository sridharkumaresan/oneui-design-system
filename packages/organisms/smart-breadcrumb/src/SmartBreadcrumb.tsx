import React from "react";
import {
  Breadcrumb,
  BreadcrumbButton,
  BreadcrumbDivider,
  BreadcrumbItem,
  Menu,
  MenuButton,
  MenuItem,
  MenuItemLink,
  MenuList,
  MenuPopover,
  partitionBreadcrumbItems
} from "@fluentui/react-components";

import { useSmartBreadcrumbClassNames } from "./SmartBreadcrumb.styles.js";
import type { SmartBreadcrumbItem, SmartBreadcrumbProps } from "./SmartBreadcrumb.types.js";

const renderInteractiveItem = (
  item: SmartBreadcrumbItem,
  isCurrent: boolean,
  currentClassName?: string
): React.JSX.Element => {
  return (
    <BreadcrumbItem key={item.id}>
      <BreadcrumbButton
        aria-label={item.ariaLabel}
        className={isCurrent ? currentClassName : undefined}
        current={isCurrent}
        href={item.href}
        onClick={item.onClick}
      >
        {item.label}
      </BreadcrumbButton>
    </BreadcrumbItem>
  );
};

const renderItemSequence = (
  items: readonly SmartBreadcrumbItem[],
  currentId: string | undefined,
  currentClassName: string,
  includeLeadingDivider: boolean
): React.JSX.Element[] => {
  const renderedItems: React.JSX.Element[] = [];

  items.forEach((item, index) => {
    if (includeLeadingDivider || index > 0) {
      renderedItems.push(<BreadcrumbDivider key={`${item.id}-divider`} />);
    }

    renderedItems.push(renderInteractiveItem(item, item.id === currentId, currentClassName));
  });

  return renderedItems;
};

export const SmartBreadcrumb = (props: SmartBreadcrumbProps): React.JSX.Element | null => {
  const { className, items, maxVisibleItems = 4, overflowLabel = "More locations", ...restProps } = props;
  const classNames = useSmartBreadcrumbClassNames(className);

  if (items.length === 0) {
    return null;
  }

  const { endDisplayedItems, overflowItems, startDisplayedItems } = partitionBreadcrumbItems({
    items,
    maxDisplayedItems: maxVisibleItems
  });
  const currentId = items.at(-1)?.id;
  const hasOverflow = Boolean(overflowItems?.length);
  const hasEndItems = Boolean(endDisplayedItems?.length);

  return (
    <Breadcrumb {...restProps} className={classNames.root} data-oneui-smart-breadcrumb="" focusMode="tab">
      {renderItemSequence(startDisplayedItems, currentId, classNames.currentItem, false)}
      {hasOverflow ? (
        <React.Fragment>
          {startDisplayedItems.length ? <BreadcrumbDivider /> : null}
          <BreadcrumbItem>
            <Menu>
              <MenuButton appearance="subtle" className={classNames.overflowButton} size="small">
                {overflowLabel}
              </MenuButton>
              <MenuPopover>
                <MenuList>
                  {overflowItems?.map((item) => {
                    if (item.href) {
                      return (
                        <MenuItemLink href={item.href} key={item.id} onClick={item.onClick}>
                          {item.label}
                        </MenuItemLink>
                      );
                    }

                    return (
                      <MenuItem key={item.id} onClick={item.onClick}>
                        {item.label}
                      </MenuItem>
                    );
                  })}
                </MenuList>
              </MenuPopover>
            </Menu>
          </BreadcrumbItem>
        </React.Fragment>
      ) : null}
      {hasEndItems
        ? renderItemSequence(
            endDisplayedItems ?? [],
            currentId,
            classNames.currentItem,
            startDisplayedItems.length > 0 || hasOverflow
          )
        : null}
    </Breadcrumb>
  );
};
