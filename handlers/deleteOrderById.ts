export const handler = async (event) => {
    console.log('Event: ', event);

    return {
        statusCode: 200,
        body: JSON.stringify(
            {
                message: 'delete order api called'
            },
            null,
            2
        ),
    };
};
