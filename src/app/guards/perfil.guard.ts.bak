import { CanActivateFn } from '@angular/router';

export const perfilGuard: CanActivateFn = (route, state) => {
  const serialized: string | null = localStorage.getItem("loggedUser");
  if (!serialized)  return false;
  const user = JSON.parse(serialized);

  if (user.perfil == "MEDICO" || user.perfil == "PACIENTE") return true;
  return false;
};
