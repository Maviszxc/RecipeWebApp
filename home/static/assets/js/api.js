window.ACCESS_POINT = "https://api.edamam.com/api/recipes/v2";

const APP_ID = "ffb5d721";
const API_KEY = "0602670cd11dc1799fbc658e6415e807";
const TYPE = "public";

/**
 * @param {Array} queries Query array
 * @param {Function} successCallback Success callback function
 * */ 

export const fetchData = async function (queries, successCallback) {
  const query = queries
    ?.join("&")
    .replace(/,/g, "=")
    .replace(/ /g, "%20")
    .replace(/\+/g, "%2B");

  const url = `${ACCESS_POINT}?app_id=${APP_ID}&app_key=${API_KEY}&type=${TYPE}${
    query ? `&${query}` : ""
  }`;

  const response = await fetch(url);

  if (response.ok) {
    const data = await response.json();
    successCallback(data);
  }
}
