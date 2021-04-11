export function transform(input_data) {
  const buckets_with_timestamp = input_data.aggregations.first_agg.buckets.map(
    ({ key, second_agg: { buckets } }) => [
      key,
      buckets.reduce((acc, { key, doc_count }) => {
        acc[key] = doc_count;
        return acc;
      }, {}),
    ]
  );
  const medium_types = [
    ...new Set(
      buckets_with_timestamp.flatMap(([, bucket]) => Object.keys(bucket))
    ),
  ];
  const first_columns = ["timestamp", ...medium_types];
  const rest_columns = buckets_with_timestamp.map(([timestamp, bucket]) => [
    new Date(timestamp).toLocaleDateString("fr-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }),
    ...medium_types.map((medium) => bucket[medium]),
  ]);
  return [first_columns, ...rest_columns];
}
