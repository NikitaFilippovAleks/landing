import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSettings, updateSetting } from "../lib/api";

const LOCALES = ["ru", "en"] as const;
type Locale = (typeof LOCALES)[number];

// SEO-настройки: переводимые (отдельное значение для каждой локали)
const SEO_TRANSLATABLE: Record<string, { label: string; multiline?: boolean }> = {
  meta_title: { label: "Title (тег <title>)" },
  meta_description: { label: "Description (мета-описание)", multiline: true },
};

// SEO-настройки: глобальные (без локали)
const SEO_GLOBAL: Record<string, { label: string }> = {
  site_url: { label: "URL сайта" },
};

// Контентные настройки (без локали, как раньше)
const CONTENT_LABELS: Record<string, { label: string; multiline?: boolean }> = {
  hero_title: { label: "Заголовок Hero" },
  hero_subtitle: { label: "Подзаголовок Hero" },
  about_text: { label: "Текст «О себе»", multiline: true },
};

// Ссылки (без локали)
const LINK_LABELS: Record<string, { label: string }> = {
  email: { label: "Email для связи" },
  github_url: { label: "GitHub URL" },
  telegram_url: { label: "Telegram URL" },
  linkedin_url: { label: "LinkedIn URL" },
};

// Уникальный ключ для формы: key + locale
function formKey(key: string, locale?: string) {
  return locale ? `${key}::${locale}` : key;
}

export function Settings() {
  const queryClient = useQueryClient();
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [savedKeys, setSavedKeys] = useState<Set<string>>(new Set());
  const [seoLocale, setSeoLocale] = useState<Locale>("ru");

  const { data: settings = [], isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
  });

  // Синхронизация формы с данными из API
  useEffect(() => {
    if (Object.keys(formValues).length === 0 && settings.length > 0) {
      const values: Record<string, string> = {};

      // Инициализируем все ключи пустыми строками
      Object.keys(SEO_GLOBAL).forEach((key) => {
        values[formKey(key)] = "";
      });
      Object.keys(SEO_TRANSLATABLE).forEach((key) => {
        LOCALES.forEach((locale) => {
          values[formKey(key, locale)] = "";
        });
      });
      Object.keys(CONTENT_LABELS).forEach((key) => {
        values[formKey(key)] = "";
      });
      Object.keys(LINK_LABELS).forEach((key) => {
        values[formKey(key)] = "";
      });

      // Заполняем из API
      settings.forEach((s) => {
        const fk = formKey(s.key, s.locale ?? undefined);
        if (fk in values) {
          values[fk] = s.value;
        }
      });

      setFormValues(values);
    }
  }, [settings, formValues]);

  const updateMut = useMutation({
    mutationFn: ({ key, value, locale }: { key: string; value: string; locale?: string }) =>
      updateSetting(key, value, locale),
    onSuccess: (updatedSetting, variables) => {
      queryClient.setQueryData(["settings"], (old: any[] | undefined) => {
        if (!old) return [updatedSetting];
        const exists = old.some(
          (s) => s.key === variables.key && s.locale === (variables.locale ?? null)
        );
        if (exists) {
          return old.map((s) =>
            s.key === variables.key && s.locale === (variables.locale ?? null)
              ? updatedSetting
              : s
          );
        }
        return [...old, updatedSetting];
      });

      const fk = formKey(variables.key, variables.locale);
      setSavedKeys((prev) => new Set(prev).add(fk));
      setTimeout(() => {
        setSavedKeys((prev) => {
          const next = new Set(prev);
          next.delete(fk);
          return next;
        });
      }, 2000);
    },
  });

  const handleSave = (key: string, locale?: string) => {
    const fk = formKey(key, locale);
    updateMut.mutate({ key, value: formValues[fk] || "", locale });
  };

  const setValue = (key: string, value: string, locale?: string) => {
    setFormValues((prev) => ({ ...prev, [formKey(key, locale)]: value }));
  };

  // Значение из API для сравнения (изменилось ли поле)
  const getSavedValue = (key: string, locale?: string) => {
    const found = settings.find(
      (s) => s.key === key && s.locale === (locale ?? null)
    );
    return found?.value ?? "";
  };

  if (isLoading) {
    return <p className="text-white/40">Загрузка...</p>;
  }

  return (
    <div className="space-y-10">
      {/* === SEO === */}
      <section>
        <div className="mb-4">
          <h2 className="text-2xl font-bold">SEO</h2>
          <p className="mt-1 text-sm text-white/40">
            Мета-теги, URL сайта — влияют на поисковую выдачу и шеринг в соцсетях
          </p>
        </div>

        {/* Глобальные SEO-настройки (site_url) */}
        <div className="space-y-4">
          {Object.entries(SEO_GLOBAL).map(([key, config]) => (
            <SettingField
              key={key}
              settingKey={key}
              label={config.label}
              value={formValues[formKey(key)] ?? ""}
              savedValue={getSavedValue(key)}
              isSaved={savedKeys.has(formKey(key))}
              isPending={updateMut.isPending}
              onChange={(v) => setValue(key, v)}
              onSave={() => handleSave(key)}
            />
          ))}
        </div>

        {/* Переводимые SEO-настройки с табами */}
        <div className="mt-4">
          <div className="mb-3 flex gap-2">
            {LOCALES.map((loc) => (
              <button
                key={loc}
                onClick={() => setSeoLocale(loc)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                  seoLocale === loc
                    ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                    : "bg-white/5 text-white/40 border border-white/10 hover:text-white/60"
                }`}
              >
                {loc.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {Object.entries(SEO_TRANSLATABLE).map(([key, config]) => (
              <SettingField
                key={`${key}-${seoLocale}`}
                settingKey={key}
                label={config.label}
                multiline={config.multiline}
                value={formValues[formKey(key, seoLocale)] ?? ""}
                savedValue={getSavedValue(key, seoLocale)}
                isSaved={savedKeys.has(formKey(key, seoLocale))}
                isPending={updateMut.isPending}
                onChange={(v) => setValue(key, v, seoLocale)}
                onSave={() => handleSave(key, seoLocale)}
                badge={seoLocale.toUpperCase()}
              />
            ))}
          </div>
        </div>
      </section>

      {/* === Контент === */}
      <section>
        <div className="mb-4">
          <h2 className="text-2xl font-bold">Контент</h2>
          <p className="mt-1 text-sm text-white/40">
            Тексты, отображаемые на лендинге
          </p>
        </div>
        <div className="space-y-4">
          {Object.entries(CONTENT_LABELS).map(([key, config]) => (
            <SettingField
              key={key}
              settingKey={key}
              label={config.label}
              multiline={config.multiline}
              value={formValues[formKey(key)] ?? ""}
              savedValue={getSavedValue(key)}
              isSaved={savedKeys.has(formKey(key))}
              isPending={updateMut.isPending}
              onChange={(v) => setValue(key, v)}
              onSave={() => handleSave(key)}
            />
          ))}
        </div>
      </section>

      {/* === Ссылки === */}
      <section>
        <div className="mb-4">
          <h2 className="text-2xl font-bold">Ссылки</h2>
          <p className="mt-1 text-sm text-white/40">
            Контактные данные и социальные сети
          </p>
        </div>
        <div className="space-y-4">
          {Object.entries(LINK_LABELS).map(([key, config]) => (
            <SettingField
              key={key}
              settingKey={key}
              label={config.label}
              value={formValues[formKey(key)] ?? ""}
              savedValue={getSavedValue(key)}
              isSaved={savedKeys.has(formKey(key))}
              isPending={updateMut.isPending}
              onChange={(v) => setValue(key, v)}
              onSave={() => handleSave(key)}
            />
          ))}
        </div>
      </section>

      {updateMut.error && (
        <p className="mt-4 text-sm text-red-400">{updateMut.error.message}</p>
      )}
    </div>
  );
}

// Переиспользуемый компонент поля настройки
function SettingField({
  settingKey,
  label,
  multiline,
  value,
  savedValue,
  isSaved,
  isPending,
  onChange,
  onSave,
  badge,
}: {
  settingKey: string;
  label: string;
  multiline?: boolean;
  value: string;
  savedValue: string;
  isSaved: boolean;
  isPending: boolean;
  onChange: (value: string) => void;
  onSave: () => void;
  badge?: string;
}) {
  const isChanged = value !== savedValue;

  return (
    <div className="rounded-xl border border-white/10 bg-gray-900 p-5">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-white/70">{label}</label>
          {badge && (
            <span className="rounded bg-purple-500/20 px-1.5 py-0.5 text-xs text-purple-400">
              {badge}
            </span>
          )}
        </div>
        <span className="text-xs text-white/30">{settingKey}</span>
      </div>

      <div className="flex gap-3">
        {multiline ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={4}
            className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-purple-500/50 resize-none"
          />
        ) : (
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-purple-500/50"
          />
        )}

        <button
          onClick={onSave}
          disabled={!isChanged || isPending}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
            isSaved
              ? "bg-green-500/20 text-green-400"
              : isChanged
                ? "bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90"
                : "bg-white/5 text-white/30 cursor-not-allowed"
          }`}
        >
          {isSaved ? "✓" : "Сохранить"}
        </button>
      </div>
    </div>
  );
}
