import * as path from "path";
import * as fs from "fs";
import { getPkgVersions, buildNewLibModule } from "@xv-town/sys-lib-creator";
import { isFile } from "../utils";
import * as codeMsg from "./code_msg";

const router = require("koa-router")();

const { CODE_OK } = codeMsg;

const pkgFile = path.join(__dirname, "../../pkg-resource.json");

const defaultPkgFileContent = {
  createdPkgList: [],
};

// MARK: settings

router.get("/all", async (ctx: any) => {
  if (!isFile(pkgFile)) {
    fs.writeFileSync(pkgFile, JSON.stringify(defaultPkgFileContent, null, 2));
  }
  const pkgConfig = JSON.parse(fs.readFileSync(pkgFile, { encoding: "utf8" }));

  ctx.body = {
    ...CODE_OK,
    data: {
      pkgList: pkgConfig.createdPkgList,
    },
  };
});

router.post("/versions", async (ctx: any) => {
  const versions = await getPkgVersions(ctx.request.body.pkgName);
  ctx.body = {
    ...CODE_OK,
    data: {
      versions,
    },
  };
});

router.post("/build", async (ctx: any) => {
  const { name, version, tarball } = ctx.request.body;
  await buildNewLibModule({ name, version, tarball });
  ctx.body = {
    ...CODE_OK,
    data: {},
  };
});

export default router;
