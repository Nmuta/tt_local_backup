import { default as basicConfig } from './prod-staging.config';

basicConfig.env.grepTags = '--@broken --@flakey --@restricted --@wip --@slow --@unit-style';

export default basicConfig;
