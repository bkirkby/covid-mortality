import axios from "axios";

export const LOADING_DATA = "LOADING_DATA";
export const DATA_ERRORED = "DATA_ERRORED";
export const DATA_SUCCESS = "DATA_SUCCESS";

export const loadData = () => dispatch => {
  // transition to LOADING_DATA state
  dispatch({ type: LOADING_DATA });
  setTimeout(() => {
    axios
      .get(
        "https://api.covid19api.com/total/country/united-states/status/deaths"
      )
      .then(res => {
        console.log(res);
        let lastDailyTotal;
        let lastDailyDeaths;
        //const totalDeaths = res.data[res.data.length - 1].Cases;
        // transition to DATA_SUCCESS state
        const app_data = res.data
          .filter(daily => daily.Cases !== 0)
          .map(daily => {
            const dailyDeaths = daily.Cases - lastDailyTotal;
            const percentChange =
              (dailyDeaths - lastDailyDeaths) / lastDailyDeaths;
            lastDailyTotal = daily.Cases;
            lastDailyDeaths = dailyDeaths;
            return {
              date: daily.Date.replace(/T.*/, ""),
              totalDeaths: daily.Cases,
              dailyDeaths,
              percentChange: (percentChange * 100).toFixed(2)
            };
          });
        dispatch({ type: DATA_SUCCESS, payload: app_data });
      })
      .catch(err => {
        // transition to DATA_ERRORED state
        console.error(err);
      });
  }, 1500);
};
