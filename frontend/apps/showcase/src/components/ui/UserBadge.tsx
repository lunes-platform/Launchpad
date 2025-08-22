import { Crown, Shield, User, Ban, Settings } from "lucide-react";

interface UserBadgeProps {
  role:
    | "admin"
    | "project"
    | "vip"
    | "verified"
    | "standard"
    | "banned"
    | "oracle";
  isVip?: boolean;
  isVerified?: boolean;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

/**
 * Badge que mostra o tipo/papel do usuário com cores e ícones apropriados
 */
export function UserBadge({
  role,
  isVip = false,
  isVerified = false,
  size = "md",
  showLabel = true,
}: UserBadgeProps) {
  const sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-10 h-10 text-base",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const getBadgeConfig = () => {
    switch (role) {
      case "admin":
        return {
          icon: Settings,
          bgColor: "bg-grafite",
          textColor: "text-white",
          label: "Admin",
        };

      case "project":
        return {
          icon: User,
          bgColor: "bg-roxo",
          textColor: "text-white",
          label: "Projeto",
        };

      case "vip":
        return {
          icon: Crown,
          bgColor: "bg-gradient-to-r from-roxo to-laranja",
          textColor: "text-white",
          label: "VIP",
        };

      case "verified":
        return {
          icon: Shield,
          bgColor: "bg-verde",
          textColor: "text-white",
          label: "Verificado",
        };

      case "standard":
        return {
          icon: User,
          bgColor: "bg-gray-500",
          textColor: "text-white",
          label: "Padrão",
        };

      case "banned":
        return {
          icon: Ban,
          bgColor: "bg-red-500",
          textColor: "text-white",
          label: "Banido",
        };

      case "oracle":
        return {
          icon: Settings,
          bgColor: "bg-roxo",
          textColor: "text-white",
          label: "Oráculo",
        };

      default:
        return {
          icon: User,
          bgColor: "bg-gray-400",
          textColor: "text-white",
          label: "Usuário",
        };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  if (!showLabel) {
    return (
      <div
        className={`
        ${sizeClasses[size]} 
        ${config.bgColor} 
        ${config.textColor}
        rounded-full flex items-center justify-center
      `}
      >
        <Icon className={iconSizes[size]} />
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <div
        className={`
        ${sizeClasses[size]} 
        ${config.bgColor} 
        ${config.textColor}
        rounded-full flex items-center justify-center
      `}
      >
        <Icon className={iconSizes[size]} />
      </div>

      {showLabel && (
        <span
          className={`font-medium ${
            size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-sm"
          }`}
        >
          {config.label}
        </span>
      )}

      {/* Badges adicionais */}
      <div className="flex space-x-1">
        {isVerified && role !== "verified" && role !== "vip" && (
          <div className="w-4 h-4 bg-verde rounded-full flex items-center justify-center">
            <Shield className="w-2 h-2 text-white" />
          </div>
        )}

        {isVip && role !== "vip" && (
          <div className="w-4 h-4 bg-gradient-to-r from-roxo to-laranja rounded-full flex items-center justify-center">
            <Crown className="w-2 h-2 text-white" />
          </div>
        )}
      </div>
    </div>
  );
}
