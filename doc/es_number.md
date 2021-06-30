

number
====
1. `thousands separator`
<pre>
export const formatNumber = (number: number, separator: string) =>
  number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
</pre>
