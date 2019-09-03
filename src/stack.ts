import * as apiGateway from "@aws-cdk/aws-apigateway"
import * as lambda from "@aws-cdk/aws-lambda"
import * as cdk from "@aws-cdk/core"
import { compile } from "./compiler"

export const STACK_NAME = "fly-my-pretties"

export class Function extends lambda.Function {
  constructor(scope: cdk.Construct, id: string, props: { code: string }) {
    super(scope, id, {
      handler: "index.handler",
      runtime: lambda.Runtime.NODEJS_8_10,
      code: lambda.Code.fromInline(props.code),
    })
  }
}

export type StackProps = cdk.StackProps & {
  code: { Mizaru: string; Kikazaru: string; Iwazaru: string }
}

export class Stack extends cdk.Stack {
  constructor(app: cdk.App, id: string, { code, ...props }: StackProps) {
    super(app, id, props)
    new apiGateway.LambdaRestApi(this, "MizaruEndpoint", {
      handler: new Function(this, "MizaruFunction", { code: code.Mizaru }),
    })
    new apiGateway.LambdaRestApi(this, "KikazaruEndpoint", {
      handler: new Function(this, "KikazaruFunction", { code: code.Kikazaru }),
    })
    new apiGateway.LambdaRestApi(this, "IwazaruEndpoint", {
      handler: new Function(this, "IwazaruFunction", { code: code.Iwazaru }),
    })
  }
}

const personalAccount: cdk.Environment = {
  account: "203242799745",
  region: "ap-southeast-2",
}

export const createApp = async (env = personalAccount) => {
  const [Mizaru, Kikazaru, Iwazaru] = await Promise.all([
    compile("./functions/mizaru.ts"),
    compile("./functions/kikazaru.ts"),
    compile("./functions/iwazaru.ts"),
  ])
  const app = new cdk.App()
  new Stack(app, STACK_NAME, { env, code: { Mizaru, Kikazaru, Iwazaru } })
  return app
}
