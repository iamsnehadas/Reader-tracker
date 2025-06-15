exports.handler = async function (event, context) {
  const url = event.queryStringParameters.url;
  if (!url) {
    return {
      statusCode: 400,
      body: 'Missing URL parameter',
    };
  }

  try {
    // Dynamic import for ESM modules in CommonJS
    const fetch = (await import('node-fetch')).default;

    const response = await fetch(url);
    const text = await response.text();
    return {
      statusCode: 200,
      body: text,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: `Error fetching page: ${error.message}`,
    };
  }
};
