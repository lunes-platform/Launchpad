import React from "react";
import { UserRole, UserProfile, getUserPermissions } from "../../types/user";
import { AdminLayout } from "./AdminLayout";
import { InvestorLayout } from "./InvestorLayout";
import { ProjectLayout } from "./ProjectLayout";
import { BannedUserLayout } from "./BannedUserLayout";

interface RoleBasedLayoutProps {
  userRole: UserRole;
  userProfile: UserProfile;
  children: React.ReactNode;
}

/**
 * Layout que se adapta baseado no papel do usuário
 * Renderiza diferentes layouts e navegações para cada tipo de usuário
 */
export function RoleBasedLayout({
  userRole,
  userProfile,
  children,
}: RoleBasedLayoutProps) {
  const permissions = getUserPermissions(userRole, userProfile);

  // Layout para usuários banidos
  if (userProfile.isBanned) {
    return (
      <BannedUserLayout userProfile={userProfile}>{children}</BannedUserLayout>
    );
  }

  // Layout baseado no papel do usuário
  switch (userRole) {
    case UserRole.ADMIN:
      return (
        <AdminLayout userProfile={userProfile} permissions={permissions}>
          {children}
        </AdminLayout>
      );

    case UserRole.PROJECT:
      return (
        <ProjectLayout userProfile={userProfile} permissions={permissions}>
          {children}
        </ProjectLayout>
      );

    case UserRole.VIP_INVESTOR:
    case UserRole.VERIFIED_INVESTOR:
    case UserRole.STANDARD_INVESTOR:
      return (
        <InvestorLayout
          userProfile={userProfile}
          permissions={permissions}
          isVip={userRole === UserRole.VIP_INVESTOR}
          isVerified={
            userRole === UserRole.VERIFIED_INVESTOR ||
            userRole === UserRole.VIP_INVESTOR
          }
        >
          {children}
        </InvestorLayout>
      );

    default:
      return (
        <InvestorLayout
          userProfile={userProfile}
          permissions={permissions}
          isVip={false}
          isVerified={false}
        >
          {children}
        </InvestorLayout>
      );
  }
}
