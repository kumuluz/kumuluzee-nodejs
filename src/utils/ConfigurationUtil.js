// @flow
import FileConfigurationSource from 'sources/FileConfigurationSource';
import EnvironmentConfigurationSource from 'sources/EnvironmentConfigurationSource';
import ConsulConfigurationSource from 'sources/ConsulConfigurationSource';
import Etcd2ConfigurationSource from 'sources/Etcd2ConfigurationSource';

import ConfigurationDispatcher from 'utils/ConfigurationDispatcher';

type MainConfiguration = ?{
  prefixKey: ?string,
  watch: boolean,
  type: string,
  name: string,
  fields: {[key: string]: MainConfiguration},
};

class ConfigurationUtilSingleton {
  configurationDispatcher = null
  configurationSources = []
  configuration = null

  initDefaultConfigurationSources({ configPath }: { configPath: ?string}) {
    if (this.configurationSources.length === 0) {
      EnvironmentConfigurationSource.init();
      this.configurationSources.push(EnvironmentConfigurationSource);
      FileConfigurationSource.init({ configPath });
      this.configurationSources.push(FileConfigurationSource);

      this.configurationDispatcher = new ConfigurationDispatcher();
    }
  }

  async initialize({ extension, configPath }: { extension: ?string, configPath: ?string }, configuraion: MainConfiguration) {
    this.initDefaultConfigurationSources({ configPath });
    // Initialize extension configuration source
    if (extension === 'etcd') {
      await Etcd2ConfigurationSource.init(this.configurationDispatcher);
      this.configurationSources.push(Etcd2ConfigurationSource);
    } else if (extension === 'consul') {
      await ConsulConfigurationSource.init(this.configurationDispatcher);
      this.configurationSources.push(ConsulConfigurationSource);
    } else if (extension) {
      console.error('Invalid extension!');
    }

    this.configurationSources.sort((a, b) => a.ordinalNumber - b.ordinalNumber).reverse();

    this.configuration = configuraion;

    return this;
  }

  async get(key: string) {
    const configurationSourcesPromises = this.configurationSources.map(configurationSource => configurationSource.get(key));
    const res = await Promise.all(configurationSourcesPromises);
    for (let i = 0; i < res.length; i++) {
      if (res[i] !== null && res[i] !== undefined) return res[i];
    }

    return null;
  }

  async getListSize(key: string) {
    let listSize = -1;

    const configurationSourcesPromises = this.configurationSources.map(configurationSource => configurationSource.getListSize(key));
    const res = await Promise.all(configurationSourcesPromises);

    for (let i = 0; i < res.length; i++) {
      if (res[i] > listSize) listSize = res[i];
    }
    return listSize;
  }

  subscribe(key: string, listener: any) {
    if (this.configurationDispatcher) this.configurationDispatcher.subscribe(listener);

    this.configurationSources.forEach(configurationSource => configurationSource.watch(key));
  }
}

export const ConfigurationUtil = new ConfigurationUtilSingleton();
