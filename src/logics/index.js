import VaultClientDemoClass, { Utils } from '../../isunpayweb/app/logics/VaultClientDemo';
import RippleClientClass from '../../isunpayweb/app/logics/RippleClient';
import Config from './config';

const VaultClientDemo = new VaultClientDemoClass(Config.isunpayrpcURL);
const RippleClient = new RippleClientClass(Config.isunpayrpcURL);

export default {
  VaultClientDemo,
  RippleClient,
  Config,
  Utils,
};

export {
  VaultClientDemo,
  RippleClient,
  Config,
  Utils,
};
