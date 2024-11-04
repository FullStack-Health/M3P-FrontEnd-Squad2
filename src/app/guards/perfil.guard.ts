import { CanActivateFn } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const perfilGuard: CanActivateFn = (route, state) => {
  const toastrService = inject(ToastrService);
  const router = inject(Router);
  const serialized: string | null = localStorage.getItem("loggedUser");
  if (!serialized)  return false;
  const user = JSON.parse(serialized);

  if (user.perfil == "MEDICO" || user.perfil == "ADMIN") return true;
  toastrService.error("Você não tem permissão para acessar esta página. Por favor, faça login com uma conta de pessoa médica ou administradora. ");
  toastrService.info("Redirecionando para página inicial.");
  router.navigate(["medical-records/"+user.paciente.id]);
  return false;
};
