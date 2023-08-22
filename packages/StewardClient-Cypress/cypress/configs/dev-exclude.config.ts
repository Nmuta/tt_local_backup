import { default as basicConfig } from './dev.config';

basicConfig.env.grepTags = "--@broken --@flakey --@restricted --@wip";

export default basicConfig;
