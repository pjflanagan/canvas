import { partition } from 'lodash';
import { makeCluster, type Comparator } from './cluster';

import test0 from './testData/test0.json';
import test1 from './testData/test1.json';

// Types

type TestData = string;
type Test = {
  data: TestData[];
  description: string;
  expected: TestData[][];
};

// Comparator

function isOverlapping(a: TestData, b: TestData): boolean {
  return a
    .split('')
    .map(
      aValue => b.split('').some(bValue => aValue === bValue)
    )
    .some(hasEquality => hasEquality);
}

function makeOverlappingFunctionTracker(): [(a: TestData, b: TestData) => Promise<boolean>, () => number] {
  let calls = 0;

  const isOverlappingTracked = async (a: TestData, b: TestData): Promise<boolean> => {
    ++calls;
    return isOverlapping(a, b);
  }

  return [isOverlappingTracked, () => calls];
}

// Test Algorithms

// O(n^2) version
// type ClusteredTestData = TestData & { clusterId?: number };
// function makeClusterDoubleForLoop(data: TestData[], compare: Comparator<TestData>): TestData[][] {
//   const clusterData: ClusteredTestData[] = [...data];
//   clusterData.forEach((item1, item1Id) => {
//     const overlappingItemIds: number[] = [];
//     clusterData.forEach((item2, item2Id) => {
//       if (item1Id !== item2Id && compare(item1, item2)) {
//         // TODO: if it overlaps, set something to something, idk
//         overlappingItemIds.push(item2Id);
//       }
//     });
//     // merge the overlaps, go through all the clusterData
//     clusterData.forEach((item) => {
//       // find where overlappingItemIds contains clusterId
//       if (item.clusterId && overlappingItemIds.includes(item.clusterId)) {
//         // and set it to be the same as item1Id
//         item.clusterId = item1Id;
//       }
//     })
//   });
//   // TODO: turn them into TestData[][]
// }

// A non-recursive O(n(n-1)/2) version
function makeClusterUsingStore(data: TestData[], compare: Comparator<TestData>): TestData[][] {
  let clusters: TestData[][] = [];
  data.forEach((item) => {
    // find all overlaps and non overlaps
    const [overlappedClusters, nonOverlappedClusters] = partition(
      clusters,
      (cluster) => cluster.some(clusteredItem => compare(item, clusteredItem))
    );
    // if overlap with multiple existing cluster groups
    if (overlappedClusters.length > 1) {
      // merge those groups
      clusters = [...nonOverlappedClusters, [item , ...overlappedClusters.flat()]];
    }
    // if overlap with one group
    else if (overlappedClusters.length === 1) {
      // add to that group
      overlappedClusters[0].push(item);
    }
    // if no overlap with an existing cluster
    else if (overlappedClusters.length === 0) {
      // then create a new cluster
      clusters.push([item]);
    }
  });
  return clusters;
}

// Equality Check

function sortForEqualityCheck(cluster: TestData[][]) {
  return cluster
    .map(cluster => cluster.sort())
    .sort();
}

function expectResultToEqualExpected(result: TestData[][], expected: TestData[][]) {
  expect(sortForEqualityCheck(result)).toEqual(sortForEqualityCheck(expected));
}

// Tests

const TESTS: Test[] = [
  test0 as unknown as Test,
  test1 as unknown as Test,
];

describe('makeClusterUsingStore (for test comparison)', () => {
  TESTS.forEach(({ data, description, expected }) => {
    const originalData = [...data];

    it(`should create ${description}`, () => {
      const result = makeClusterUsingStore(data, isOverlapping);
      expectResultToEqualExpected(result, expected);
    });

    it(`should not modify the original data`, () => {
      expect(data).toEqual(originalData);
    })
  });
});

// describe('makeClusterDoubleForLoop (for test comparison)', () => {
//   TESTS.forEach(({ data, description, expected }) => {
//     it(`should create ${description}`, () => {
//       const result = makeClusterDoubleForLoop(data, isOverlapping);
//       expectResultToEqualExpected(result, expected);
//     });
//   });
// });

describe('makeCluster', () => {
  TESTS.forEach(({ data, description, expected }) => {
    console.log('data', data);
    const originalData = [...data];
    const [isOverlappingTracked, getCalls] = makeOverlappingFunctionTracker();
    const result = makeCluster(data, isOverlappingTracked);

    it(`should create ${description}`, () => {
      console.log('result', result);
      console.log('expected', expected);
      expectResultToEqualExpected(result, expected);
    });

    it(`should not modify the original data`, () => {
      expect(data).toEqual(originalData);
    })

    it(`should run faster than or equal to O(n(n-1)/2)`, () => {
      const n = originalData.length;
      const benchmark = (n * (n - 1)) / 2;
      expect(getCalls()).toBeLessThanOrEqual(benchmark);
    })
  });
});


describe('comparison', () => {
  TESTS.forEach(({ data, description }) => {
    const [isOverlappingTrackedRecursive, getCallsRecursive] = makeOverlappingFunctionTracker();
    // const [isOverlappingTrackedDoubleForLoop, getCallsDoubleForLoop] = makeOverlappingFunctionTracker(timeout);
    const [isOverlappingTrackedClusterStore, getCallsClusterStore] = makeOverlappingFunctionTracker();
  
    // const time0 = new Date().getTime();
    makeCluster(data, isOverlappingTrackedRecursive);
    // const time1 = new Date().getTime();
    // const resultDoubleForLoop = makeClusterDoubleForLoop(data, isOverlappingTrackedDoubleForLoop);
    // const time2 = new Date().getTime();
    makeClusterUsingStore(data, isOverlappingTrackedClusterStore);
    // const time3 = new Date().getTime();

    // const timeRecursive = time1 - time0;
    // const timeDoubleForLoop = time2 - time1;
    // const timeClusterStore = time3 - time2;

    // it(`should run faster than double for: ${description}`, () => {
    //   expect(getCallsRecursive() < getCallsDoubleForLoop()).toBeTruthy();
    //   expect(timeRecursive < timeDoubleForLoop).toBeTruthy();
    // });
  
    it(`should run in the same or fewer calls than store: ${description}`, () => {
      expect(getCallsRecursive()).toBeLessThanOrEqual(getCallsClusterStore());
    });

    // it(`should run faster than store: ${description}`, () => {
    //   expect(timeRecursive).toBeLessThan(timeClusterStore);
    // });
  });
});