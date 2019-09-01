import MemoryFS = require("memory-fs")
import { resolve } from "path"
import * as webpack from "webpack"

const MAX_LAMBDA_BYTES = 4096
const OUTFILE = "index.js"

const babelLoader: webpack.RuleSetLoader = {
  loader: "babel-loader",
  options: { presets: ["@babel/preset-typescript"] },
}

export const config: webpack.Configuration = {
  context: resolve(__dirname),
  mode: "production",
  target: "node",
  resolve: {
    modules: ["node_modules"],
    extensions: [".ts", ".js", ".json"],
  },
  module: {
    rules: [{ test: /\.ts$/, use: [babelLoader] }],
  },
  output: {
    filename: OUTFILE,
    path: "/",
  },
  performance: {
    maxEntrypointSize: MAX_LAMBDA_BYTES,
  },
}

export function compile(entry: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const compiler = webpack({ ...config, entry })
    compiler.outputFileSystem = new MemoryFS()
    compiler.run((err, stats) => {
      if (err || stats.hasErrors()) {
        reject(stats.toString())
      }
      resolve(stats.compilation.assets[OUTFILE].source())
    })
  })
}
