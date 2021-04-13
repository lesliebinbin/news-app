(ns general-export)

(defn timestamp-to-local-date-string [timestamp]
  (.. (new js/Date timestamp)
      (toLocaleDateString "fr-CA"
                          (clj->js
                           {:year "numeric",
                            :month "2-digit",
                            :day "2-digit"}))))

(defn ^:export transform-into-chart [data]
  (let [buckets-with-timestamps
        (-> data
            (js->clj :keywordize-keys true)
            (get-in [:aggregations :first_agg :buckets]))
        timestamp-data-pair-seq
        (map (fn [{:keys [key] {:keys [buckets]} :second_agg}]
               (->> buckets
                    (map (fn [{:keys [doc_count key]}] [key doc_count]))
                    (into {})
                    (conj [key])))
             buckets-with-timestamps)
        medium-types (->> timestamp-data-pair-seq
                          (map second)
                          (map keys)
                          flatten
                          set)
        first-rows (concat ["timestamp"] medium-types)
        rest-rows (->> timestamp-data-pair-seq
                       (map (fn [[timestamp, bucket]]
                              (concat
                               [(timestamp-to-local-date-string timestamp)]
                               (map bucket medium-types)
                               ))))]

    (-> first-rows
        (cons rest-rows)
        clj->js)))
