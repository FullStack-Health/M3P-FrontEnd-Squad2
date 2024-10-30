import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const serialized: string | null = localStorage.getItem("loggedUser");
  if (!serialized)  return false;
  const user = JSON.parse(serialized);

  if (user.perfil == "ADMIN") return true;
  router.navigate(["home"]);
  return false;
};