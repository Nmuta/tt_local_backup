import { inject, InjectionToken, Provider } from '@angular/core';
import { Store } from '@ngxs/store';
import { UserRole } from '@models/enums';
import { chain, sortBy, values } from 'lodash';
import { combinations } from '@helpers/combinations';
import { UserRoleGuard } from './user-role.guard';

export function MakeKey(allowedRoles: UserRole[]): string {
  const roles = chain(allowedRoles)
    .map(v => v.toString())
    .sortBy()
    .value();
  return `ROLE_GUARD[${roles.join(',')}]`;
}

export function FindUserRoleGuard(allowedRoles: UserRole[]): InjectionToken<UserRoleGuard> {
  const key = `InjectionToken ${MakeKey(allowedRoles)}`;
  const foundInjectionToken = USER_GUARD_LOOKUP[key];
  if (!foundInjectionToken) {
    throw new Error(`Couldn't find injection token: ${key}`);
  }

  return foundInjectionToken;
}

export function GenerateUserRoleGuard(allowedRoles: UserRole[]): InjectionToken<UserRoleGuard> {
  return new InjectionToken<UserRoleGuard>(MakeKey(allowedRoles), {
    factory: () => new UserRoleGuard(inject(Store), allowedRoles),
  });
}

export function GenerateUserRoleGuards(roles: UserRole[]): InjectionToken<UserRoleGuard>[] {
  const aggregator: InjectionToken<UserRoleGuard>[] = [];
  for (let i = 0; i <= roles.length; i++) {
    const allCombinations = combinations(roles, i).map(combo => sortBy(combo));
    const sortedCombinations = sortBy(allCombinations, c => c.length);
    const allInjectors = sortedCombinations.map(combos => GenerateUserRoleGuard(combos));
    aggregator.push(...allInjectors);
  }

  return aggregator;
}

export const USER_GUARD_TOKENS = [
  // map all the singular values
  ...values(UserRole).map(r => GenerateUserRoleGuard([r])),
  // add in the customized extras
  GenerateUserRoleGuard([UserRole.LiveOpsAdmin, UserRole.SupportAgentAdmin]),
  GenerateUserRoleGuard([
    UserRole.LiveOpsAdmin,
    UserRole.SupportAgent,
    UserRole.SupportAgentAdmin,
    UserRole.SupportAgentNew,
  ]),
  GenerateUserRoleGuard([UserRole.LiveOpsAdmin, UserRole.CommunityManager]),
  GenerateUserRoleGuard([
    UserRole.LiveOpsAdmin,
    UserRole.DataPipelineRead,
    UserRole.DataPipelineContributor,
    UserRole.DataPipelineAdmin,
  ]),
];

export const USER_GUARD_PROVIDERS = USER_GUARD_TOKENS.map(v => <Provider>{ provide: v });

const USER_GUARD_LOOKUP: { [guardName: string]: InjectionToken<UserRoleGuard> } = chain(
  USER_GUARD_TOKENS,
)
  .map(it => [it.toString(), it])
  .fromPairs()
  .value();
