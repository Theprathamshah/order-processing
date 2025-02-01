export const handler = async (event) => {
    console.log('Event: ', event);

    return {
        statusCode: 200,
        body: JSON.stringify(
            {
                message: 'update order api called'
            },
            null,
            2
        ),
    };
};
