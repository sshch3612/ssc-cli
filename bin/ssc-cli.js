#!/usr/bin/env node

const program = require("commander");

program
    .version(require("../package.json").version)
    .name("ssc-cli")
    .usage("<command> [options]")
    .command("init", "初始化项目模板")

program.parse(process.argv);