import type { Component } from 'solid-js';
import PluginRenderer from './components/plugin-renderer';

import styles from './App.module.css';
import PkgSelector from './components/pkg-selector';

const App: Component = () => {
  return (
    <div class={styles.App}>
      <PkgSelector />
      <PluginRenderer />
    </div>
  );
};

export default App;
