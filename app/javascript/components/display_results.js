import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { transform as chart_transform } from "../data_transform/chart";
import axios from "axios";
export function DisplayResult() {
  const [data, setData] = useState([[]]);
  useEffect(async () => {
    const resp = await axios.get("/results");
    const results = chart_transform(resp.data);
    setData(results);
  }, []);
  return (
    <Chart
      chartType="ColumnChart"
      loader={<div>Loading Chart</div>}
      data={data}
      options={{
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
