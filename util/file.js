const fs = require("fs");
const path = require("path");

/**
 * 清空文件夹
 * @param {*} outPath
 */
function emptyDir(outPath) {
    if (!fs.existsSync(outPath)) throw new Error("此文件夹不存在");
    const files = fs.readdirSync(outPath);
    files.map((file) => {
        if (fs.statSync(path.join(outPath, file)).isDirectory()) {
            emptyDir(path.join(outPath, file));
        } else {
            fs.unlinkSync(path.join(outPath, file));
        }
    })
}
/**
 * 遍历清空所有文件夹
 * @param {*} dir
 * @returns
 */
function traveDir(dir) {
    if (!fs.existsSync(dir)) throw new Error("此文件夹不存在");
    const outAllfile = [];
    let inputStackFiles = [dir];

    while (inputStackFiles.length) {
        const currentDir = inputStackFiles.shift();
        outAllfile.push(currentDir);
        const files = fs.readdirSync(currentDir);
        if (files.length > 0) {
            files.map((file) => {
                inputStackFiles.push(path.join(currentDir, file));
            })
        }

    }
    while (outAllfile.length) {
        const file = outAllfile.pop();
        fs.rmdirSync(file);
    }
    return;
}

/**
 * 复制所有文件
 * 
*/
function cpAllfiles(inputDir, outDir) {
    const filesDir = fs.readdirSync(inputDir);
    filesDir.map((file) => {
        fs.stat(path.join(inputDir, file), (err, stat) => {
            if (err) throw err;
            if (stat.isDirectory()) {
                fs.mkdirSync(path.join(outDir, file));
                cpAllfiles(path.join(inputDir, file), path.join(outDir, file));
            } else {
                fs.readFile(path.join(inputDir, file), (err, fd) => {
                    fs.writeFile(path.join(outDir, file), fd, { flag: "w+" }, (err, fd) => {
                        if (err) throw err;
                    })
                })
            }
        })
    })
}


module.exports = {
    emptyDir,
    traveDir,
    cpAllfiles
}