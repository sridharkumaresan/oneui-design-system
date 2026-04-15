import * as React from "react";

import { Avatar, Badge, Button, Text } from "@fluentui/react-components";
import { OneUIImage } from "@functions-oneui/atoms";
import { createDescriptionPreview } from "@functions-oneui/utils";

import { formatRelativeDate } from "../../../common/utils/dateTime";
import type { NormalizedSearchResult } from "../../../domain/search/contracts/SearchResult";
import styles from "./ResultCards.module.scss";

type ResultCardFactoryProps = {
  items: NormalizedSearchResult[];
};

const getSummaryPreview = (item: NormalizedSearchResult): string | undefined => {
  const preview = createDescriptionPreview(item.summary, {
    maxChars: item.type === "person" ? 90 : 180,
    richContentMode: "strip-and-trim"
  });

  return preview.previewText || undefined;
};

const renderDocumentCard = (item: NormalizedSearchResult): React.ReactElement => {
  const summaryPreview = getSummaryPreview(item);

  return (
    <article className={styles.documentCard} key={item.id}>
      <div className={styles.documentMeta}>
        <Text className={styles.documentSource}>{item.metadata.sourceLabel ?? item.sourceKey}</Text>
        <Text className={styles.documentDate}>{formatRelativeDate(item.modifiedTime)}</Text>
      </div>
      <a className={styles.documentTitle} href={item.url}>
        {item.title}
      </a>
      {summaryPreview ? <Text className={styles.documentSummary}>{summaryPreview}</Text> : null}
      <div className={styles.documentTags}>
        {Object.keys(item.metadata)
          .slice(0, 3)
          .map((key) => (
            <Badge appearance="outline" color="subtle" key={`${item.id}-${key}`}>
              {String(item.metadata[key] ?? "")}
            </Badge>
          ))}
      </div>
    </article>
  );
};

const renderEventCard = (item: NormalizedSearchResult): React.ReactElement => {
  const summaryPreview = getSummaryPreview(item);

  return (
    <article className={styles.eventCard} key={item.id}>
      {item.thumbnailUrl ? (
        <div className={styles.eventImageWrap}>
          <OneUIImage
            alt=""
            aspectRatio="16 / 10"
            className={styles.eventImage}
            src={item.thumbnailUrl}
          />
        </div>
      ) : null}
      <div className={styles.eventContent}>
        <a className={styles.documentTitle} href={item.url}>
          {item.title}
        </a>
        <Text className={styles.eventPath}>{String(item.metadata.path ?? "")}</Text>
        <Text className={styles.documentSummary}>
          <strong>When:</strong> {String(item.metadata.date ?? "TBC")} <strong>Where:</strong>{" "}
          {String(item.metadata.location ?? "TBC")}
        </Text>
        {summaryPreview ? <Text className={styles.documentSummary}>{summaryPreview}</Text> : null}
      </div>
    </article>
  );
};

const renderNewsCard = (item: NormalizedSearchResult): React.ReactElement => {
  const summaryPreview = getSummaryPreview(item);

  return (
    <article className={styles.newsCard} key={item.id}>
      <div className={styles.newsContent}>
        <Text className={styles.eventPath}>{String(item.metadata.path ?? "")}</Text>
        <a className={styles.documentTitle} href={item.url}>
          {item.title}
        </a>
        <Text className={styles.documentDate}>{String(item.metadata.date ?? formatRelativeDate(item.modifiedTime))}</Text>
        {summaryPreview ? <Text className={styles.documentSummary}>{summaryPreview}</Text> : null}
        <Badge appearance="filled" color="brand">
          News
        </Badge>
      </div>
      {item.thumbnailUrl ? (
        <OneUIImage
          alt=""
          aspectRatio="11 / 7"
          className={styles.newsImage}
          src={item.thumbnailUrl}
        />
      ) : null}
    </article>
  );
};

const renderPeopleCard = (item: NormalizedSearchResult): React.ReactElement => {
  const summaryPreview = getSummaryPreview(item);

  return (
    <article className={styles.personCard} key={item.id}>
      <Avatar image={{ src: item.thumbnailUrl }} name={item.title} size={40} />
      <div className={styles.personContent}>
        <a className={styles.personName} href={item.url}>
          {item.title}
        </a>
        {summaryPreview ? <Text className={styles.personRole}>{summaryPreview}</Text> : null}
        <Text className={styles.personMeta}>{String(item.metadata.location ?? "")}</Text>
      </div>
    </article>
  );
};

const renderResourceCard = (item: NormalizedSearchResult): React.ReactElement => {
  const summaryPreview = getSummaryPreview(item);

  return (
    <article className={styles.resourceCard} key={item.id}>
      <div className={styles.resourceIcon}>{String(item.metadata.tileLabel ?? "R").slice(0, 1)}</div>
      <Text className={styles.resourceTitle}>{item.title}</Text>
      {summaryPreview ? <Text className={styles.resourceSummary}>{summaryPreview}</Text> : null}
    </article>
  );
};

const renderFileCard = (item: NormalizedSearchResult): React.ReactElement => {
  const summaryPreview = getSummaryPreview(item);

  return (
    <article className={styles.fileCard} key={item.id}>
      <div className={styles.fileIcon}>{String(item.metadata.extension ?? "file").toUpperCase()}</div>
      <div className={styles.fileContent}>
        <a className={styles.personName} href={item.url}>
          {item.title}
        </a>
        <Text className={styles.personMeta}>{formatRelativeDate(item.modifiedTime)}</Text>
        {summaryPreview ? <Text className={styles.documentSummary}>{summaryPreview}</Text> : null}
      </div>
      <Button appearance="subtle" size="small">
        Open
      </Button>
    </article>
  );
};

export const ResultCardFactory = ({ items }: ResultCardFactoryProps): React.ReactElement => {
  const firstType = items[0]?.type;
  const groupedRendererMap: Partial<Record<NormalizedSearchResult["type"], (items: NormalizedSearchResult[]) => React.ReactElement>> = {
    file: (records) => <div className={styles.fileList}>{records.map(renderFileCard)}</div>,
    person: (records) => <div className={styles.personList}>{records.map(renderPeopleCard)}</div>,
    resource: (records) => <div className={styles.resourceGrid}>{records.map(renderResourceCard)}</div>
  };

  const groupedRenderer = firstType ? groupedRendererMap[firstType] : undefined;

  if (groupedRenderer) {
    return groupedRenderer(items);
  }

  return (
    <div className={styles.resultStack}>
      {items.map((item) => {
        switch (item.type) {
          case "event":
            return renderEventCard(item);
          case "news":
            return renderNewsCard(item);
          default:
            return renderDocumentCard(item);
        }
      })}
    </div>
  );
};
