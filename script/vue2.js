const fs = require("fs");
const path = require("path");
const { emptyDir,
    traveDir,
    cpAllfiles } = require("../util/file");


//生成目录结构
//根据模板文件生成
const inputPath = path.join(path.resolve(), "template/vue2");
const outPath = path.join(path.resolve(), "vue2");
//创建顶级目录结构
if (fs.existsSync(outPath)) {
    emptyDir(outPath);
    traveDir(outPath);
}
//创建输出目录
fs.mkdirSync(outPath);
cpAllfiles(inputPath, outPath);
