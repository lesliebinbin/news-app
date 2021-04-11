import React, { useRef, useContext } from "react";
import { TextField, InputLabel, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  query,
  interval,
  before,
  after,
} from "../default_data/search_params.json";
import { ResultsContext } from "../data_context/results_context";
import axios from "axios";
import { transform as chart_transform } from "../data_transform/chart";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: 200,
    },
  },
}));

export function SearchForm() {
  const classes = useStyles();
  const queryRef = useRef();
  const intervalRef = useRef();
  const beforeRef = useRef();
  const afterRef = useRef();
  const { setResults } = useContext(ResultsContext);
  return (
    <>
      <form className={classes.root} noValidate autoComplete="off">
        <InputLabel htmlFor="query">Query Words</InputLabel>
        <TextField inputRef={queryRef} id="query" defaultValue={query} />
        <InputLabel htmlFor="interval">Interval</InputLabel>
        <TextField
          inputRef={intervalRef}
          id="interval"
          defaultValue={interval}
        />
        <InputLabel htmlFor="before">Before Timestamp</InputLabel>
        <TextField inputRef={beforeRef} id="before" defaultValue={before} />
        <InputLabel htmlFor="after">After Timestamp</InputLabel>
        <TextField inputRef={afterRef} id="after" defaultValue={after} />
      </form>
      <Button
        variant="contained"
        color="primary"
        onClick={async () => {
          try {
            const resp = await axios.get("/results", {
              params: {
                query: queryRef.current.value,
                interval: intervalRef.current.value,
                before: beforeRef.current.value,
                after: afterRef.current.value,
              },
            });
            const transformed_results = chart_transform(resp.data);
            setResults(transformed_results);
          } catch (err) {
            console.log(err);
          }
        }}
      >
        Search
      </Button>
    </>
  );
}
