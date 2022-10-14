import { partition } from 'lodash';

// makes groups out of a linked overlap
export function makeGroups<T>(items: T[], compare: (a: T, b: T) => boolean): T[][] {
  // base case
  if (items.length === 0) {
    return [];
  }
  // get the first item
  const item = items.pop()!;
  // get the group it belongs to and the remaining items
  const [group, remainingItems] = getGroupForItem(item, items, compare);
  // return this new item in its group, and the groups created from the remaining items
  return [
    [item, ...group],
    ...makeGroups(remainingItems, compare)
  ];
}

function getGroupForItem<T>(item: T, ungroupedItems: T[], compare: (a: T, b: T) => boolean): [T[], T[]] {
  // base case
  if (ungroupedItems.length === 0) {
    return [[item], []]
  }
  // get all the items the maker overlaps with and all the remaining items
  let [group, remainingItems] = partition(ungroupedItems, m => compare(item, m));
  // for each overlapped item, get any group it forms with the remaining items
  for (let i = 0; i < group.length; ++i) {
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
