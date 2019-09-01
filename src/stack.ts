import * as apiGateway from "@aws-cdk/aws-apigateway"
import * as lambda from "@aws-cdk/aws-lambda"
import * as cdk from "@aws-cdk/core"

export const STACK_NAME = "fly-my-pretties"

const logEventFunction = `
exports.handler = function(event, context, callback) {
  console.log('Event: ', event)
  callback(null, event)
}
`

type FunctionProps = { code: string }

export class Function extends lambda.Function {
  constructor(scope: cdk.Construct, id: string, { code }: FunctionProps) {
    super(scope, id, {
      handler: "index.handler",
      runtime: lambda.Runtime.NODEJS_8_10,
      code: lambda.Code.fromInline(code),
    })
  }
}

export class Stack extends cdk.Stack {
  constructor(app: cdk.App, id: string, props: cdk.StackProps) {
    super(app, id, props)

    new apiGateway.LambdaRestApi(this, "Endpoint", {
      handler: new Function(this, "LogEvent", {
        code: logEventFunction,
      }),
    })
  }
}

const personalAccount: cdk.Environment = {
  account: "203242799745",
  region: "ap-southeast-2",
}

export function synth(env = personalAccount) {
  const app = new cdk.App()
  new Stack(app, STACK_NAME, { env })
  app.synth()
}
