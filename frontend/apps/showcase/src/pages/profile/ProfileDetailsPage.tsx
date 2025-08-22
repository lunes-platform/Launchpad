import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Card, Input, Button } from "@launchpad/shared-ui";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNotifications } from "../../hooks/useNotifications";

const profileSchema = z.object({
  displayName: z
    .string()
    .min(2, { message: "O nome deve ter pelo menos 2 caracteres." }),
  email: z.string().email({ message: "Por favor, insira um email válido." }),
  bio: z
    .string()
    .max(200, { message: "A biografia não pode exceder 200 caracteres." })
    .optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const ProfileDetailsPage: React.FC = () => {
  const { user, isLoading, updateUserProfile } = useAuth();
  const { addNotification } = useNotifications();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: user?.profile?.displayName || "",
      email: user?.email || "",
      bio: user?.profile?.bio || "",
    },
  });

  React.useEffect(() => {
    if (user) {
      reset({
        displayName: user.profile?.displayName || "",
        email: user.email || "",
        bio: user.profile?.bio || "",
      });
    }
  }, [user, reset]);

  if (isLoading && !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        Carregando...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateUserProfile({
        displayName: data.displayName,
        bio: data.bio,
      });
      addNotification({
        title: "Sucesso!",
        message: "Seu perfil foi atualizado.",
        type: "success",
      });
    } catch (error) {
      addNotification({
        title: "Erro!",
        message: "Não foi possível atualizar seu perfil.",
        type: "error",
      });
      console.error("Erro ao atualizar perfil:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-2">Meu Perfil</h1>
      <p className="text-gray-600 mb-8">
        Mantenha suas informações pessoais atualizadas.
      </p>

      <Card padding="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="displayName" className="font-semibold">
              Nome Completo
            </label>
            <Controller
              name="displayName"
              control={control}
              render={({ field }) => <Input id="displayName" {...field} />}
            />
            {errors.displayName && (
              <p className="text-red-500 text-sm">
                {errors.displayName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="font-semibold">
              Endereço de Email
            </label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input id="email" type="email" {...field} />
              )}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="bio" className="font-semibold">
              Biografia
            </label>
            <Controller
              name="bio"
              control={control}
              render={({ field }) => (
                <textarea
                  id="bio"
                  {...field}
                  className="w-full p-2 border rounded-md"
                  rows={4}
                />
              )}
            />
            {errors.bio && (
              <p className="text-red-500 text-sm">{errors.bio.message}</p>
            )}
          </div>

          <div className="flex justify-end">
            <Button type="submit" loading={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ProfileDetailsPage;
