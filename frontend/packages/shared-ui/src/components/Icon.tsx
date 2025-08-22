import React from "react";
import { type LucideProps } from "lucide-react";

interface IconProps extends LucideProps {
  icon: React.ElementType;
}

export const Icon = ({ icon: IconComponent, ...props }: IconProps) => {
  return <IconComponent {...props} />;
};
