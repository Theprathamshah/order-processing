export async function handler(event) {
    return {
        statusCode: 200,
        body: JSON.stringify(
            {
                message: 'Get Orders api called',
            },
            null,
            2
        ),
    };
}