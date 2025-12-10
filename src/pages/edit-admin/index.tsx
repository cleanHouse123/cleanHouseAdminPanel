import { Button } from "@/core/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/core/components/ui/form";
import { Input } from "@/core/components/ui/inputs/input";
import { updateAdminSchema } from "@/modules/admins/forms/update-admin-form";
import { useUpdateAdmin, useAdmin } from "@/modules/admins/hooks/useAdmins";
import { UpdateAdminDto } from "@/modules/admins/types/admin";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle, Shield, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

export const EditAdminPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isSuccess, setIsSuccess] = useState(false);

  const { data: admin, isLoading: isLoadingAdmin } = useAdmin(id || "");
  const { mutateAsync: updateAdmin, isPending, error } = useUpdateAdmin();

  const form = useForm<UpdateAdminDto>({
    resolver: zodResolver(updateAdminSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  useEffect(() => {
    if (admin) {
      form.reset({
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        password: "",
      });
    }
  }, [admin, form]);

  const onSubmit = async (data: UpdateAdminDto) => {
    if (!id) return;
    
    try {
      // Удаляем пустые поля и пустой пароль
      const updateData: UpdateAdminDto = {};
      if (data.name && data.name !== admin?.name) updateData.name = data.name;
      if (data.email && data.email !== admin?.email) updateData.email = data.email;
      if (data.phone && data.phone !== admin?.phone) updateData.phone = data.phone;
      if (data.password && data.password.trim() !== "") updateData.password = data.password;

      if (Object.keys(updateData).length === 0) {
        navigate("/admin/admin");
        return;
      }

      await updateAdmin({ id, data: updateData });
      setIsSuccess(true);
      setTimeout(() => {
        navigate("/admin/admin");
      }, 2000);
    } catch (_err) {
      // Ошибка уже обрабатывается в error state
    }
  };

  if (isLoadingAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          <h2 className="text-2xl font-bold text-foreground">{t("editAdmin.success")}</h2>
          <p className="text-muted-foreground">Перенаправление на страницу администраторов...</p>
        </div>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <XCircle className="h-16 w-16 text-destructive mx-auto" />
          <h2 className="text-2xl font-bold text-foreground">{t("editAdmin.notFound")}</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/admin/admin")}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("common.back")}
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate">{t("editAdmin.title")}</h1>
          <p className="text-sm sm:text-base text-muted-foreground">{t("editAdmin.description")}</p>
        </div>
      </div>

      {/* Form Card */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">{t("editAdmin.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">{t("editAdmin.name.label")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={t("editAdmin.name.placeholder")}
                        className="text-foreground placeholder:text-muted-foreground"
                      />
                    </FormControl>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">{t("editAdmin.email.label")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder={t("editAdmin.email.placeholder")}
                        className="text-foreground placeholder:text-muted-foreground"
                      />
                    </FormControl>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />

              {/* Phone Field */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">{t("editAdmin.phone.label")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="tel"
                        placeholder={t("editAdmin.phone.placeholder")}
                        className="text-foreground placeholder:text-muted-foreground"
                      />
                    </FormControl>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">{t("editAdmin.password.label")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder={t("editAdmin.password.placeholder")}
                        className="text-foreground placeholder:text-muted-foreground"
                      />
                    </FormControl>
                    <FormMessage className="text-destructive" />
                    <p className="text-xs text-muted-foreground">{t("editAdmin.password.hint")}</p>
                  </FormItem>
                )}
              />

              {/* Error Display */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <XCircle className="h-4 w-4 text-destructive" />
                  <p className="text-destructive text-sm">{error.message}</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/admin")}
                  className="flex-1 order-2 sm:order-1"
                >
                  {t("common.cancel")}
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 order-1 sm:order-2"
                >
                  {isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {t("common.loading")}
                    </>
                  ) : (
                    t("editAdmin.submit")
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

