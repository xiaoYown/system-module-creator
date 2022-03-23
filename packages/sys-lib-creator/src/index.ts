#!/usr/bin/env node

import * as fs from "fs";
import * as path from "path";
import axios from "axios";

const child_process = require("child_process");
const tar = require("tar");
const download = require("download");
const shell = require("shelljs");
const build = require("@xv-town/sys-lib-builder");

interface VersionModel {
  name: string;
  version: string;
  description: string;
  dist: {
    shasum: string;
    tarball: string;
  };
}

interface VersionsModel {
  [key: string]: VersionModel;
}

// TODO: 从 os.homedir()/.npmr 中获取
const host = "https://registry.npmjs.org";

async function getPkgInfo(pkgName: string): Promise<any> {
  return axios.get(`${host}/${pkgName}`);
}

function exec(sh: string): Promise<any> {
  return new Promise((resolve) => {
    child_process.exec(sh, {}, () => {
      resolve(null);
    });
  });
}

function install(folder: string): Promise<any> {
  return new Promise((resolve, _reject) => {
    shell.exec(`cd ${folder} && npm install -P`, { async: true }, () => {
      resolve(null);
    });
  });
}

function untar(file: string, folder: string): Promise<any> {
  return new Promise((resolve, reject) => {
    fs.createReadStream(file)
      .pipe(
        tar.x({
          strip: 1,
          C: folder,
        })
      )
      .on("finish", () => {
        resolve(null);
      })
      .on("error", (error: Error) => {
        reject(error);
      });
  });
}

export async function getPkgVersions(pkgName: string) {
  const pkgInfo = await getPkgInfo(pkgName);
  const versions: any[] = [];

  for (let key in pkgInfo.data.versions) {
    const { name, version, dist } = pkgInfo.data.versions[key];
    versions.push({
      name,
      version,
      tarball: dist.tarball,
    });
  }

  return versions;
}

export async function buildNewLibModule({
  name,
  version,
  tarball,
}: {
  name: string;
  version: string;
  tarball: string;
}) {
  const pkgName = name;
  const pkgVersion = version;

  const taskFolderName = `task-${pkgName.replace(/\//g, "-")}-${pkgVersion}`;
  const taskFolder = path.join(__dirname, `../${taskFolderName}`);

  // step 1 创建任务目录
  fs.mkdirSync(taskFolder);
  // step 2 下载依赖压缩包
  await download(tarball, taskFolder);

  const tgzFile = (tarball.match(/\/([^/]+)$/) as [string, string])[1];
  const pkgFolder = `${taskFolder}/source`;
  // step 3 创建解压目录
  fs.mkdirSync(pkgFolder);
  // step 4 解压
  const error = await untar(path.join(taskFolder, tgzFile), pkgFolder);

  if (error) return;

  // const installSh = `cd ${pkgFolder} && npm install -P -0`;

  // await exec(installSh);
  await install(pkgFolder);

  const pkgInfo = JSON.parse(
    fs.readFileSync(path.join(pkgFolder, "package.json"), {
      encoding: "utf8",
    })
  );

  const entryFile = path.join(pkgFolder, pkgInfo.module || pkgInfo.main);
  const outputFile = path.join(taskFolder, `./bundle`);

  // step 5 构建
  await build({
    entry: {
      main: entryFile,
    },
    output: {
      path: outputFile,
      filename: "main.js",
    },
  });
}
