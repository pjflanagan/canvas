import { makeCluster, type Comparator } from './cluster';

import test0 from './testData/test0.json';
import test1 from './testData/test1.json';

type TestData = string[];
type Test = {
  data: TestData[];
  description: string;
  expected: TestData[][];
};

function isOverlapping(a: TestData, b: TestData): boolean {
  return a.map(aValue => b.some(bValue => aValue === bValue)).some(hasEquality => hasEquality);
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function makeOverlappingFunctionTracker(): [(a: TestData, b: TestData) => Promise<boolean>, () => number] {
  let calls = 0;

  const isOverlappingTracked = async (a: TestData, b: TestData): Promise<boolean> => {
    ++calls;
    await sleep(10);
    return isOverlapping(a, b);
  }

  return [isOverlappingTracked, () => calls];
}

// O(n^2) version
function makeClusterDoubleForLoop(data: TestData[], compare: Comparator<TestData>) {
  const clusters = [];
  data.forEach(() => {
    data.forEach(() => {
      // 
    });
  });
}

// A second O(n(n-1)/2) version
function makeClusterClusterStore(data: TestData[], compare: Comparator<TestData>) {
  const clusters: TestData[][] = [];
  data.forEach(() => {
    clusters.forEach(() => {
      // if overlap with multiple existing cluster groups,
        // merge those groups
      // if overlap with one group
        // add to that group
      // if no overlap with an existing cluster
        // then create a new cluster
    });
  });
}

describe('makeCluster', () => {
  const tests: Test[] = [
    test0 as unknown as Test,
    test1 as unknown as Test,
  ];

  tests.forEach(({ data, description, expected }) => {
    it(`should create ${description}`, () => {
      const result = makeCluster(data, isOverlapping);
      expect(result).toEqual(expected);
    });
  });

  tests.forEach(({ data, description, expected }) => {
    it(`should run faster than other functions: ${description}`, () => {
      const [isOverlappingTrackedRecursive, getCallsRecursive] = makeOverlappingFunctionTracker();
      const [isOverlappingTrackedDoubleForLoop, getCallsDoubleForLoop] = makeOverlappingFunctionTracker();
      const [isOverlappingTrackedClusterStore, getCallsClusterStore] = makeOverlappingFunctionTracker();
    
      const time0 = new Date().getTime();
      const resultRecursive = makeCluster(data, isOverlappingTrackedRecursive);
      const time1 = new Date().getTime();
      const resultDoubleForLoop = makeClusterDoubleForLoop(data, isOverlappingTrackedDoubleForLoop);
      const time2 = new Date().getTime();
      const resultClusterStore = makeClusterClusterStore(data, isOverlappingTrackedClusterStore);
      const time3 = new Date().getTime();

      expect(resultRecursive).toEqual(expected);
      expect(resultDoubleForLoop).toEqual(expected);
      expect(resultClusterStore).toEqual(expected);

      const timeRecursive = time1 - time0;
      const timeDoubleForLoop = time2 - time1;
      expect(getCallsRecursive() < getCallsDoubleForLoop()).toBeTruthy();
      expect(timeRecursive < timeDoubleForLoop).toBeTruthy();

      const timeClusterStore = time3 - time2;
      expect(getCallsRecursive() < getCallsClusterStore()).toBeTruthy();
      expect(timeRecursive < timeClusterStore).toBeTruthy();
    });
  });
});