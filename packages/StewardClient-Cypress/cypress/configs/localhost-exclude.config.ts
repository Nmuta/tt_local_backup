import { default as basicConfig } from './localhost.config';

basicConfig.env.grepTags = '--@broken --@flakey --@restricted --@wip --@slow --@unit-style';

export default basicConfig;
