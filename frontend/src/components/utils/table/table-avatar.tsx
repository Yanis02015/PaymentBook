import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const TableAvatar = ({
  name,
  image,
}: {
  name: string;
  image: string;
}) => {
  return (
    <Avatar className="w-8 h-8 mr-1">
      <AvatarImage src={image} alt={`@${name}`} />
      <AvatarFallback>{name.charAt(0)}</AvatarFallback>
    </Avatar>
  );
};
