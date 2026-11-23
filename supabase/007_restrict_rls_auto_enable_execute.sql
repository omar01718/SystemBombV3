-- Supabase administra esta función de evento. La aplicación no la invoca.
-- Algunas instalaciones locales no incluyen el disparador administrado.
do $$
begin
  if to_regprocedure('public.rls_auto_enable()') is not null then
    revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
  end if;
end;
$$;
