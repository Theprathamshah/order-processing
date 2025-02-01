export const handler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'health check api',
        input: event,
      },
      null,
      2
    ),
  };
};
