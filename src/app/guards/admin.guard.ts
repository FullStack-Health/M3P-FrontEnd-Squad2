import { CanActivateFn } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const serialized: string | null = localStorage.getItem("loggedUser");
  if (!serialized)  return false;
  const user = JSON.parse(serialized);

  if (user.perfil == "ADMIN") return true;
  return false;
};