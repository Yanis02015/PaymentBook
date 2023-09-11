import { refresh } from "@/api/auth";
import { Error as ErrorComponent } from "@/components/utils/error";
import { Loading } from "@/components/utils/loading";
import { PATHS } from "@/utils/paths";
import { queries } from "@/utils/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { HTTPError } from "ky";
import { Link, Outlet } from "react-router-dom";

export default function AuthLayout() {
  const { isError, isLoading, error } = useQuery({
    queryKey: [queries.loggedIn],
    queryFn: refresh,
    refetchOnWindowFocus: false,
    retry: false,
  });

  if (isLoading) return <Loading />;

  if (isError) {
    if (error instanceof HTTPError && error.response.status === 401)
      return (
        <>
          Vous n'êtes pas autorisé, vuillez vous authentifier d'abord.{" "}
          <Link to={PATHS.LOGIN}>Se connecter</Link>
        </>
      );

    return <ErrorComponent />;
  }

  return <Outlet />;
}
