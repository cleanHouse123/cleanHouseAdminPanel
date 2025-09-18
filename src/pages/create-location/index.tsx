import { Button } from "@/core/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/core/components/ui/form";
import { Input } from "@/core/components/ui/inputs/input";
import { createLocationSchema } from "@/modules/locations/forms/create-location-form";
import { useCreateLocation } from "@/modules/locations/hooks/useLocations";
import { CreateLocationDto } from "@/modules/locations/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle, MapPin, XCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export const CreateLocationPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);

  const { mutateAsync: createLocation, isPending, error } = useCreateLocation();

  const form = useForm<CreateLocationDto>({
    resolver: zodResolver(createLocationSchema),
    defaultValues: {
      region: null,
      area: null,
      city: null,
      settlement: null,
    },
  });

  const onSubmit = async (data: CreateLocationDto) => {
    try {
      await createLocation(data);
      setIsSuccess(true);
      // Редирект через 2 секунды
      setTimeout(() => {
        navigate("/admin/locations");
      }, 2000);
    } catch (_err) {
      // Ошибка уже обрабатывается в error state
    }
  };

  if (isSuccess) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          <h2 className="text-2xl font-bold text-foreground">{t("createLocation.success")}</h2>
          <p className="text-muted-foreground">Перенаправление на страницу локаций...</p>
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
          onClick={() => navigate("/admin/locations")}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("common.back")}
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate">{t("createLocation.title")}</h1>
          <p className="text-sm sm:text-base text-muted-foreground">{t("createLocation.description")}</p>
        </div>
      </div>

      {/* Form Card */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">{t("createLocation.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Region Field */}
              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">{t("createLocation.region.label")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value || ""}
                        placeholder={t("createLocation.region.placeholder")}
                        className="text-foreground placeholder:text-muted-foreground"
                      />
                    </FormControl>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />

              {/* Area Field */}
              <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">{t("createLocation.area.label")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value || ""}
                        placeholder={t("createLocation.area.placeholder")}
                        className="text-foreground placeholder:text-muted-foreground"
                      />
                    </FormControl>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />

              {/* City Field */}
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">{t("createLocation.city.label")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value || ""}
                        placeholder={t("createLocation.city.placeholder")}
                        className="text-foreground placeholder:text-muted-foreground"
                      />
                    </FormControl>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />

              {/* Settlement Field */}
              <FormField
                control={form.control}
                name="settlement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">{t("createLocation.settlement.label")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value || ""}
                        placeholder={t("createLocation.settlement.placeholder")}
                        className="text-foreground placeholder:text-muted-foreground"
                      />
                    </FormControl>
                    <FormMessage className="text-destructive" />
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
                  onClick={() => navigate("/admin/locations")}
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
                    t("createLocation.submit")
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
