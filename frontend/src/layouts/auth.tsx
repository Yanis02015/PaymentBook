import { refresh } from "@/api/auth";
import { LogoutButton } from "@/components/my/logout";
import { Error as ErrorComponent } from "@/components/utils/error";
import { Loading } from "@/components/utils/loading";
import { cn } from "@/lib/utils";
import { PATHS } from "@/utils/paths";
import { queries } from "@/utils/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { HTTPError } from "ky";
import { Navigate, Outlet, matchPath, useLocation } from "react-router-dom";

export default function AuthLayout() {
  const { isError, isLoading, error, isFetching } = useQuery({
    queryKey: [queries.loggedIn],
    queryFn: refresh,
    refetchOnWindowFocus: false,
    retry: false,
  });
  const location = useLocation();

  if (isLoading || isFetching) return <Loading />;

  if (isError) {
    if (error instanceof HTTPError && error.response.status === 401)
      return (
        // TODO: A good component to tel login
        // <>
        //   Vous n'êtes pas autorisé, vuillez vous authentifier d'abord.{" "}
        //   <Link to={PATHS.LOGIN}>Se connecter</Link>
        // </>
        <Navigate to={PATHS.LOGIN} />
      );

    return <ErrorComponent className="pt-20" />;
  }

  const showContainer =
    [PATHS.WORKER_MONTH].findIndex((path) =>
      matchPath(path, location.pathname)
    ) === -1;

  return (
    <div className={cn("pb-5", showContainer && "container")}>
      {showContainer && (
        <div className="flex justify-end py-4">
          <LogoutButton />
        </div>
      )}
      <Outlet />
    </div>
  );
}
