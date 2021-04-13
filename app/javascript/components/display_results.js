import React, { useEffect, useState, useContext } from "react";
import { ResultsContext } from "../data_context/results_context";
import { Chart } from "react-google-charts";
// import { transform as chart_transform } from "../data_transform/chart";
import { transform_into_chart } from "general_export";
import {
  query,
  interval,
  before,
  after,
} from "../default_data/search_params.json";
import axios from "axios";

export function DisplayResult() {
  const { results, setResults } = useContext(ResultsContext);
  useEffect(async () => {
    try {
      const resp = await axios.get("/results", {
        params: {
          query,
          interval,
          before,
          after,
        },
      });
      // const transformed_results = chart_transform(resp.data);
      const transformed_results = transform_into_chart(resp.data);
      setResults(transformed_results);
    } catch (err) {
      console.log(err);
    }
  }, []);
  return results.length === 0 ? (
    <div>Loading...</div>
  ) : (
    <Chart
      width={"750px"}
      height={"540px"}
      chartType="ColumnChart"
      loader={<div>Loading Chart</div>}
      data={results}
      options={{
        chartArea: { width: "50%" },
        title: "Example",
        isStacked: true,
        hAxis: {
          title: "timestamp per day",
        },
        vAxis: {
          title: "Count of records",
        },
      }}
      // For tests
      rootProps={{ "data-testid": "3" }}
    />
  );
}
