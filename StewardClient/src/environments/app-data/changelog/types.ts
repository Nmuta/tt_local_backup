import { GameTitle } from '@models/enums';
import { isString } from 'lodash';
import { NavbarTool } from '../tool-list';

export interface ChangelogArea {
  tool: NavbarTool | NavbarTool[];
  title: GameTitle | GameTitle[] | 'all';
}

export enum ChangelogTag {
  All = 'all',
  General = 'general',
  Internal = 'internal',
}

/** Returns true if the given value looks like a {@link ChangelogArea} */
export function isChangelogArea(source: unknown): source is ChangelogArea {
  const maybeChangelogArea = source as ChangelogArea;
  if (!isString(maybeChangelogArea.tool)) {
    return false;
  }

  if (!isString(maybeChangelogArea.title)) {
    return false;
  }

  return true;
}

/** Represents a change to the code. */
export interface ChangelogEntry {
  /** The tag for the change. */
  tag: ChangelogArea | ChangelogTag;
  /** ID used for determining latest seen update. */
  uuid: string;
  /** Short text explaining the change. */
  shortText: string;
  /** Paragraphs explaining the change. */
  longText?: string[];
}

/** A group of changelogs. */
export interface ChangelogGroup {
  /** The title to display. */
  title: string;
  /** ID used for determining latest seen update. */
  id: string;
  /** The entries to display. */
  entries: ChangelogEntry[];
}

/** Stores UI-known changelogs. */
export interface Changelog {
  /** Changelogs considered "active". These are checked against on each log in. */
  active: ChangelogGroup[];
  /** Changelogs considered "inactive". They can be viewed (and forced to show in the UI), but will not be checked against. */
  inactive: ChangelogGroup[];
}
