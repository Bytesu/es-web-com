

MongoDB
=====

1. mongodb 多字段判断排序(结合TypeOrm 使用)
<pre>
this.repo.aggregate([
        {
          $match: query, //query info
        },
        {
          $addFields: {
            order_price: {
              $cond: [ //字段比对，条件判断
                { $gte: [`$interpolated_price.${date}.discounted_price`, 0] },
                `$interpolated_price.${date}.discounted_price`,
                `$interpolated_price.${date}.original_price`,
              ],
            },
          },
        },
        { // 新字段排序
          $sort: {
            order_price: productFields.sortOrder.toUpperCase() === 'DESC' ? -1 : 1,
          },
        },
        { $skip: pagination.skip }, // 分页
        { $limit: pagination.take },
      ])
</pre>
