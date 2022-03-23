import { createSignal, For, Index, onMount, Show } from "solid-js";
import {
  reqBuildPkg,
  reqGetPkgAll,
  reqGetPkgVersions,
  VersionModel,
} from "../../apis/pkg";

interface PkgModel {
  name: string;
  versions: string[];
}

interface PropsModel {}

function PkgSelector(props: PropsModel) {
  const [getPkgList, setPkgList] = createSignal<PkgModel[]>([]);
  const [getVersionList, setVersionList] = createSignal<VersionModel[]>([]);
  const [getSelectorValue, setSelectorValue] = createSignal<number>(0);
  let pkgNameRef: HTMLInputElement;
  let pkgVersionRef: HTMLSelectElement;

  function handleSearchPkgVersions() {
    reqGetPkgVersions(pkgNameRef.value.trim())
      .then((res) => {
        const { code, data } = res;
        if (code === 0) {
          const { versions } = data;
          setVersionList(versions);
          setSelectorValue(versions.length - 1);
        }
      })
      .catch((error) => {
        // TODO:
      });
  }

  function handleBuildPkg() {
    const { name, version, tarball } =
      getVersionList()[pkgVersionRef.selectedIndex];
    
    reqBuildPkg(
      name,
      version,
      tarball
    );
  }

  onMount(() => {
    reqGetPkgAll()
      .then((res) => {
        setPkgList(res.data.pkgList);
      })
      .catch((error) => {
        // TODO:
      });
  });

  return (
    <div>
      <h4>新增 package</h4>
      <div>
        <div>
          <input
            ref={(ref) => (pkgNameRef = ref)}
            type="text"
            placeholder="package name"
            onkeydown={(e) => {
              e.code === "Enter" && handleSearchPkgVersions();
            }}
          />
          <button onClick={handleSearchPkgVersions}>搜索</button>
        </div>
        <div>
          <Show when={getVersionList().length}>
            <select name="create-version" ref={(ref) => (pkgVersionRef = ref)}>
              <Index each={getVersionList()}>
                {(item, index) => (
                  <option
                    value={getVersionList().map((item2) => item2.version)}
                    selected={getSelectorValue() === index}
                  >
                    {item().version}
                  </option>
                )}
              </Index>
            </select>
          </Show>
          <button onClick={handleBuildPkg}>生成新包</button>
        </div>
      </div>
      <h4>已安装 packages:</h4>
      <Show when={getPkgList().length === 0}>
        <div>empty</div>
      </Show>
      <ul>
        <For each={getPkgList()}>
          {(item) => {
            return (
              <li>
                <span>{item.name}</span>
                <select name="version">
                  <For each={item.versions}>
                    {(v) => {
                      return <option value={v}>v</option>;
                    }}
                  </For>
                </select>
              </li>
            );
          }}
        </For>
      </ul>
    </div>
  );
}

export default PkgSelector;
