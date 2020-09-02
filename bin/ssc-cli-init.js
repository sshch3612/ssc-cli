#!/usr/bin/env node

const program = require("commander");
const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const { emptyDir,
    traveDir, cpAllfiles } = require("../util/file");



console.log("开始");
process.on("exit", () => {
    console.log("进程结束");
})

/**
 * Help
*/
program.on("--help", () => {
    console.log('Examples:');
    console.log("ssc-cli init  my-project");
})


function help() {
    program.parse();
    if (program.args.length < 1) return program.help();
}
help();



//判断是否创建目录
inquirer.prompt([{
    type: "confirm",
    name: "ok",
    message: "您想要在当前目录创建项目嘛？",
    default: true,
}]).then((answers) => {
    if (answers.ok) {
        run();
    }
}).catch((err) => {
    console.log(err);
})


/*
* 创建
*/



async function run() {
    //选择项目
    const selectVal = await inquirer.prompt([{
        type: "list",
        name: "select",
        message: "请选择创建的模板类型：",
        choices: [
            "Vue2",
            "React"
        ]
    }])

    const inputDir = path.join(__dirname, `../template/${String(selectVal.select).toLowerCase()}`);
    if (!fs.existsSync(inputDir)) process.exit();
    console.log("开始创建");
    //是否在该目录下创建项目
    //选择创建的项目类型
    const templateDir = path.join(path.resolve(), program.args[0]);

    if (fs.existsSync(templateDir)) {
        emptyDir(templateDir);
        traveDir(templateDir);
    }

    fs.mkdirSync(templateDir);
    cpAllfiles(inputDir, templateDir);
    console.log("创建完成");
}


