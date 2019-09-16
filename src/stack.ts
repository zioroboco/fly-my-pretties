import * as apiGateway from "@aws-cdk/aws-apigateway"
import * as lambda from "@aws-cdk/aws-lambda"
import * as cdk from "@aws-cdk/core"
import { compile } from "./compiler"

export const STACK_NAME = "fly-my-pretties"

export class InlineFunction extends lambda.Function {
  constructor(scope: cdk.Construct, id: string, props: { code: string }) {
    super(scope, id, {
      handler: "index.handler",
      runtime: lambda.Runtime.NODEJS_8_10,
      code: lambda.Code.fromInline(props.code),
    })
  }
}

export type Functions = { id: string; code: string }[]
export type StackProps = cdk.StackProps & { functions: Functions }

export class Stack extends cdk.Stack {
  constructor(app: cdk.App, id: string, { functions, ...props }: StackProps) {
    super(app, id, props)
    functions.forEach(
      ({ id, code }) =>
        new apiGateway.LambdaRestApi(this, `${id}Endpoint`, {
          handler: new InlineFunction(this, `${id}Function`, { code }),
        })
    )
  }
}

const personalAccount: cdk.Environment = {
  account: "203242799745",
  region: "ap-southeast-2",
}

export const createApp = async (env = personalAccount) => {
  const functions: Functions = [
    { id: "Mizaru", code: await compile("./functions/mizaru.ts") },
    { id: "Kikazaru", code: await compile("./functions/kikazaru.ts") },
    { id: "Iwazaru", code: await compile("./functions/iwazaru.ts") },
  ]
  const app = new cdk.App()
  new Stack(app, STACK_NAME, { env, functions })
  return app
}
