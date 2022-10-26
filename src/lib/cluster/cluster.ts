import { partition } from 'lodash';

// I think this runs in O(n(n-1)/2) which is still really just O(n^2)
// But it could be cool to run a test against a double for loop that does the same thing

export type Comparator<T> = (a: T, b: T) => boolean | Promise<boolean>;

// makes groups out of a linked overlap
export function makeCluster<T>(items: T[], compare: Comparator<T>): T[][] {
  const workingItems = [...items];
  // base case
  if (workingItems.length === 0) {
    return [];
  } else if (workingItems.length === 1) {
    return [workingItems];
  }
  // get the first item
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const item = workingItems.pop()!;
  // get the group it belongs to and the remaining items
  const [group, remainingItems] = getGroupForItem(item, workingItems, compare);
  // return this new item in its group, and the groups created from the remaining items
  return [
    [item, ...group],
    ...makeCluster(remainingItems, compare)
  ];
}

export function getGroupForItem<T>(item: T, ungroupedItems: T[], compare: Comparator<T>): [T[], T[]] {
  // base case
  if (ungroupedItems.length === 0) {
    return [[item], []]
  }
  // separate items that overlap with this one from the ones that don't
  let [group, remainingItems] = partition(ungroupedItems, m => compare(item, m));
  // for each overlapped item, get any group it forms with the remaining items
  for (let i = 0; i < group.length && remainingItems.length > 0; ++i) {
    let newGroupMembers: T[];
    [newGroupMembers, remainingItems] = getGroupForItem(group[i], remainingItems, compare);
    group = [...group, ...newGroupMembers]
  }
  // return the group this item belongs to, and the remaining items
  return [
    group,
    remainingItems
  ];
}
