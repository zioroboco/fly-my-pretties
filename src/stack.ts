import * as cdk from "@aws-cdk/core"

export const STACK_NAME = "fly-my-pretties"

export class Stack extends cdk.Stack {
  constructor(app: cdk.App, id: string, props: cdk.StackProps) {
    super(app, id, props)
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
