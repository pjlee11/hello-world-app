import 'isomorphic-fetch';
import Logger from '@bbc/spartacus/logger';

const logger = Logger(__filename);

const upstreamStatusCodesToPropagate = [200, 404];

const getInitialData = async ({ match }) => {
  // These are matched params as compared to the regex defined in src/app/routes/index.js
  const { id, service, amp } = match.params;

  // This is the URL for your data path using the matched params from react router
  const url = `${process.env.SPARTACUS_BASE_URL}/${service}/${id}.json`;

  let data;
  let status;

  try {
    const response = await fetch(url);

    status = response.status; // eslint-disable-line prefer-destructuring

    if (status === 200) {
      data = await response.json();
    } else if (!upstreamStatusCodesToPropagate.includes(status)) {
      // eslint-disable-next-line no-console
      logger.warn(
        `Unexpected upstream response (HTTP status code ${status}) when requesting ${url}`,
      );
      status = 502;
    }
  } catch (error) {
    logger.error(error);
    status = 502;
  }

  return {
    data,
    service,
    status,
  };
};

export default getInitialData;
