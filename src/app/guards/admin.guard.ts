import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

export const adminGuard: CanActivateFn = (route, state) => {
  const toastrService = inject(ToastrService);
  const router = inject(Router);
  const serialized: string | null = localStorage.getItem("loggedUser");
  if (!serialized)  return false;
  const user = JSON.parse(serialized);

  if (user.perfil == "ADMIN") return true;
  toastrService.error("Você não tem permissão para acessar esta página. Por favor, faça login com uma conta de pessoa administradora.");
  toastrService.info("Redirecionando para página inicial.");
  router.navigate(["home"]);
  return false;
};