export const handler = async (event:any) => {
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