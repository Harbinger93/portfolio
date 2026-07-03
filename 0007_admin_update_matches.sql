-- Permitir a los administradores actualizar la tabla de partidos (como asignar equipos y actualizar resultados manualmente)
create policy "Admins pueden actualizar partidos" 
on matches 
for update 
using (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid() and profiles.is_admin = true
  )
);
