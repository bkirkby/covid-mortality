import sha1 from "sha1";
import { LOADING_DATA, DATA_SUCCESS } from "../actions";

const initialState = {
  dailyDeaths: [],
  error: "",
  isLoading: false,
  lastUpdate: 0
};

const getInitialState = location => {
  const storedDailyDeaths = window.localStorage.getItem(
    `covid-deaths-${location}`
  );
  const storedDDMeta = window.localStorage.getItem(
    `covid-deaths-${location}-last-update`
  );
  if (storedDailyDeaths) {
    return {
      ...initialState,
      dailyDeaths: JSON.parse(storedDailyDeaths),
      lastUpdate: storedDDMeta.time
    };
  }
  return initialState;
};

const isDataNew = (location, dailyDeaths, metaData) => {
  if (location && dailyDeaths) {
    const hashOfDailyDeaths = sha1(JSON.stringify(dailyDeaths));
    if (!metaData || metaData.hash !== hashOfDailyDeaths) {
      return true;
    }
  }
  return false;
};

// returns metadata: {time: '', hash: ''}
const saveState = (location, dailyDeaths) => {
  // metadata: {time: '', hash: ''}
  const currentMetaData = JSON.parse(
    window.localStorage.getItem(`covid-deaths-${location}-last-update`)
  );
  if (location && dailyDeaths) {
    if (isDataNew(location, dailyDeaths, currentMetaData)) {
      const hashOfDailyDeaths = sha1(JSON.stringify(dailyDeaths));
      const newMetaData = { time: Date.now(), hash: hashOfDailyDeaths };

      window.localStorage.setItem(
        `covid-deaths-${location}`,
        JSON.stringify(dailyDeaths)
      );
      window.localStorage.setItem(
        `covid-deaths-${location}-last-update`,
        JSON.stringify(newMetaData)
      );
      return newMetaData;
    }
  }
  return currentMetaData;
};

export const reducer = (state = getInitialState("united-states"), action) => {
  let retState = state;
  switch (action.type) {
    case LOADING_DATA:
      retState = { ...state, isLoading: true };
      break;
    case DATA_SUCCESS:
      const metaData = saveState("united-states", retState.dailyDeaths);
      retState = {
        ...state,
        error: "",
        isLoading: false,
        dailyDeaths: action.payload,
        lastUpdate: metaData.time
      };
      break;
    default:
      retState = state;
  }
  return retState;
};
