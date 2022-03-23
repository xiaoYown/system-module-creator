import fetch from "../utils/fetch";

export interface VersionModel {
  name: string;
  version: string;
  tarball: string;
}

interface DataModel {
  code: number;
  msg: string;
}

export function reqGetPkgAll(): Promise<any> {
  return fetch.get("/pkg/all");
}

export function reqGetPkgVersions(
  pkgName: string
): Promise<DataModel & { data: { versions: VersionModel[] } }> {
  return fetch.post(`/pkg/versions`, { pkgName });
}

export function reqBuildPkg(
  name: string,
  version: string,
  tarball: string
): Promise<any> {
  return fetch.post(`/pkg/build`, { name, version, tarball });
}
