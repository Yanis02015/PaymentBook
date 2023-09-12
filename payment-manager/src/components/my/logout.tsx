import { logout } from "@/api/auth";
import { PATHS } from "@/utils/paths";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export const LogoutButton = ({ className }: { className?: string }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutationLogout = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries();
      navigate(PATHS.LOGIN);
    },
  });

  return (
    <Button
      variant="ghost"
      onClick={() => mutationLogout.mutate()}
      className={cn("", className)}
    >
      Se déconnecter
    </Button>
  );
};
