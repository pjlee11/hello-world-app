import 'isomorphic-fetch';

// This method is currently passed with the routes to `react-universal-app`
const getInitialData = async ({ match }) => {
  try {
    // These are matched params as compared to the regex defined in src/app/routes/index.js
    const { id, service, amp } = match.params;

    // This is the URL for your data path using the matched params from react router
    const url = `${
      process.env.SIMORGH_BASE_URL
    }/${service}/${id}.json`;

    const response = await fetch(url);

    const data = await response.json();
    const isAmp = !!amp;

    return {
      isAmp,
      data,
      service,
    };
  } catch (error) {
    console.log(error); // eslint-disable-line no-console
    return {};
  }
};

export default getInitialData;
