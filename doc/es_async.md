

es async await 
====
1. 异步遍历
<pre>
    export const asyncForEach  = async (arr, predicate) => {
      const results = await Promise.all(arr.map(predicate));
      return arr.forEach((_v, index) => results[index]);
    };
</pre>
2. 异步过滤

<pre>
   export async asyncFilter(arr, predicate) {
    const results = await Promise.all(arr.map(predicate));
    return arr.filter((_v, index) => results[index]);
  }
</pre>
