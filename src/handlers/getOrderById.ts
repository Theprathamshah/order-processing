export const handler = async (event) => {
    console.log('Event: ', event);

    return {
        statusCode: 200,
        body: JSON.stringify(
            {
                message: 'get order by id api called'
            },
            null,
            2
        ),
    };
};
