import { getRouterAuthority } from './authority';

export default function Authorized({ pathname, routes, authMenus, children, noMatch }) {
  let route = getRouterAuthority(pathname, routes, 'routes');
  let auth = getRouterAuthority(pathname, authMenus, 'children');
  if (route && auth) {
    route.authorized = Object.assign({}, auth.authChip);
    return auth.available ? children : noMatch;
  } else {
    return noMatch;
  }
}
