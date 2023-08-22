/**
 * Contains standard tags for labeling tests.
 */
export enum Tag {
  /** Default tag when no other tags are specified. Avoid use. */
  Missing = '@missing',

  /**
   * Indicates that this test was built in a unit-test style and should be refactored
   * to reload the page less often and make more assertions in a single visit.
   */
  UnitTestStyle = '@unit-style',

  /** Indicates that this test should not be run regularly due to cleanup issues. */
  Restricted = '@restricted',

  /** Indicates that this test is currently broken and should be skipped in typical test runs. */
  Broken = '@broken',

  /**
   * Indicates that this test is currently flakey and should be skipped in typical test runs.
   * Please leave a comment on the test as to why it seems to be flakey.
   *
   * Common reasons include
   * - missing spinners
   * - indeterminate loading times
   * - animation not detected
   */
  Flakey = '@flakey',

  /** Indicates that this test is currently a work-in-progress and should be skipped in typical test runs. */
  WIP = '@wip',

  /** Indicates that this test should be run regularly to verify builds. */
  Verify = '@verify',

  /**
   * Indicates this test runs much slower than other tests.
   *
   * "Much slower" here is >20s
   * Typical test time is <10s
   */
  Slow = '@slow',
}

/**
 * Tags a given test with the provided tags.
 * Defaults to { tags: [untagged] }
 * @example
 * // For context
 * context("Some Context", withTags(Tag.Slow), () => { })
 * // For individual tests
 * it("Should do something", withTags(Tag.Slow), () => { })
 */
export function withTags(...tags: Tag[]) {
  return {
    tags: makeTagsArray(...tags),
  };
}

/**
 * Produces a tag array for the given tags.
 * Defaults to [untagged]
 *
 * Avoid direct use. Instead prefer {@link withTags}.
 */
export function makeTagsArray(...tags: Tag[]): string[] {
  if (!tags || tags.length == 0) {
    tags = [Tag.Missing];
  }

  return tags.map(t => t.toString());
}
