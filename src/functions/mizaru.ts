import {
  APIGatewayProxyEvent as Event,
  APIGatewayProxyResult as Result,
} from "aws-lambda"
import { mizaru } from "../lib/common"

export const handler = async (event: Event): Promise<Result> => ({
  statusCode: 200,
  body: mizaru,
})
