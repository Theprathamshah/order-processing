import { EventBridgeEvent } from "aws-lambda";

interface HealthCheckDetail {
  service: string;
  status: string;
}

export const handler = async (
  event: EventBridgeEvent<"HealthCheckEvent", HealthCheckDetail>,
) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "health check api", input: event }),
  };
};
