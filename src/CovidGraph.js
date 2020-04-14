import React, { useEffect } from "react";
import { connect } from "react-redux";

import { loadData } from "./actions";

const CovidGraph = ({
  loadData,
  dailyDeaths,
  error,
  isLoading,
  lastUpdate
}) => {
  //const [dailyDeaths] = useState([]);
  const GRAPH_HEIGHT = 150;
  const maxDailyDeaths = dailyDeaths.reduce((acc, curr) => {
    return curr.dailyDeaths > acc ? curr.dailyDeaths : acc;
  }, 0);

  const dt = new Date(lastUpdate);
  const lastUpdateText = `${dt.getFullYear()}-${dt.getMonth() +
    1}-${dt.getDate()}`;

  useEffect(() => {
    if (loadData) {
      loadData();
    }
  }, [loadData]);

  return (
    <div id="covidGraph">
      <button onClick={() => loadData()}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 18 18"
        >
          <path d="M9 13.5c-2.49 0-4.5-2.01-4.5-4.5S6.51 4.5 9 4.5c1.24 0 2.36.52 3.17 1.33L10 8h5V3l-1.76 1.76C12.15 3.68 10.66 3 9 3 5.69 3 3.01 5.69 3.01 9S5.69 15 9 15c2.97 0 5.43-2.16 5.9-5h-1.52c-.46 2-2.24 3.5-4.38 3.5z" />
        </svg>
      </button>
      {error && (
        <div style={{ color: "red" }}>error receiving data: {error}</div>
      )}
      <svg id="covidGraphSvg" width="600" height={GRAPH_HEIGHT}>
        {dailyDeaths.map((dd, i) => {
          const width = 3;
          const height = (GRAPH_HEIGHT * dd.dailyDeaths) / maxDailyDeaths;
          return (
            <rect
              key={dd.date}
              x={(width + 1) * i}
              y={GRAPH_HEIGHT - height}
              width={width}
              height={height}
            />
          );
        })}
      </svg>
      {isLoading ? (
        <div>data is loading...</div>
      ) : (
        <table>
          <caption>
            <h2>covid deaths per day - united-states</h2>
            <h4>last updated: {lastUpdateText}</h4>
          </caption>
          <thead>
            <tr>
              <th>date</th>
              <th>total deaths</th>
              <th>daily deaths</th>
              <th>percent change</th>
            </tr>
          </thead>
          <tbody>
            {dailyDeaths.length === 0 ? (
              <tr>
                <td>no data</td>
              </tr>
            ) : (
              dailyDeaths
                .slice()
                .reverse()
                .map(d => {
                  return (
                    <tr key={`table-row-${d.date}`}>
                      <td>{d.date}</td>
                      <td>{d.totalDeaths}</td>
                      <td>{d.dailyDeaths}</td>
                      <td>{d.percentChange}</td>
                    </tr>
                  );
                })
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    dailyDeaths: state.dailyDeaths,
    isLoading: state.isLoading,
    error: state.error,
    lastUpdate: state.lastUpdate
  };
};

export default connect(
  mapStateToProps,
  { loadData }
)(CovidGraph);
