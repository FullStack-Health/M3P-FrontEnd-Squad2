import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  let loggedUser = localStorage.getItem("loggedUser");
  if (!!loggedUser) {
    return true;
  };
  router.navigate(["login"]);
  return false;
};
