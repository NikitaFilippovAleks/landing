import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSettings, updateSetting } from "../lib/api";

// Человекочитаемые названия настроек
const SETTING_LABELS: Record<string, { label: string; multiline?: boolean }> = {
  hero_title: { label: "Заголовок Hero" },
  hero_subtitle: { label: "Подзаголовок Hero" },
  about_text: { label: "Текст «О себе»", multiline: true },
  email: { label: "Email для связи" },
  github_url: { label: "GitHub URL" },
  telegram_url: { label: "Telegram URL" },
  linkedin_url: { label: "LinkedIn URL" },
};

export function Settings() {
  const queryClient = useQueryClient();
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [savedKeys, setSavedKeys] = useState<Set<string>>(new Set());

  const { data: settings = [], isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
  });

  // Синхронизация формы с данными из API (только при первой загрузке)
  useEffect(() => {
    if (Object.keys(formValues).length === 0) {
      const values: Record<string, string> = {};
      // Инициализируем все ключи из SETTING_LABELS (пустые строки по умолчанию)
      Object.keys(SETTING_LABELS).forEach((key) => {
        values[key] = "";
      });
      // Перезаписываем значениями из API (если есть)
      settings.forEach((s) => {
        if (s.key in values) {
          values[s.key] = s.value;
        }
      });
      setFormValues(values);
    }
  }, [settings, formValues]);

  const updateMut = useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) =>
      updateSetting(key, value),
    onSuccess: (updatedSetting, variables) => {
      // Обновляем кеш напрямую, без перезапроса (чтобы порядок не менялся)
      queryClient.setQueryData(["settings"], (old: any[] | undefined) =>
        old?.map((s) => (s.key === variables.key ? updatedSetting : s))
      );
      // Показываем галочку на 2 секунды
      setSavedKeys((prev) => new Set(prev).add(variables.key));
      setTimeout(() => {
        setSavedKeys((prev) => {
          const next = new Set(prev);
          next.delete(variables.key);
          return next;
        });
      }, 2000);
    },
  });

  const handleSave = (key: string) => {
    updateMut.mutate({ key, value: formValues[key] || "" });
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Настройки сайта</h2>
        <p className="mt-1 text-sm text-white/40">
          Редактирование текстов и ссылок на лендинге
        </p>
      </div>

      {isLoading ? (
        <p className="text-white/40">Загрузка...</p>
      ) : (
        <div className="space-y-4">
          {/* Рендерим в фиксированном порядке из SETTING_LABELS, чтобы при сохранении порядок не менялся */}
          {Object.entries(SETTING_LABELS).map(([key, config]) => {
            const setting = settings.find((s) => s.key === key);
            const currentValue = formValues[key] ?? "";
            const savedValue = setting?.value ?? "";
            const isSaved = savedKeys.has(key);
            const isChanged = currentValue !== savedValue;

            return (
              <div
                key={key}
                className="rounded-xl border border-white/10 bg-gray-900 p-5"
              >
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-white/70">
                    {config.label}
                  </label>
                  <span className="text-xs text-white/30">{key}</span>
                </div>

                <div className="flex gap-3">
                  {config.multiline ? (
                    <textarea
                      value={currentValue}
                      onChange={(e) =>
                        setFormValues({ ...formValues, [key]: e.target.value })
                      }
                      rows={4}
                      className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-purple-500/50 resize-none"
                    />
                  ) : (
                    <input
                      value={currentValue}
                      onChange={(e) =>
                        setFormValues({ ...formValues, [key]: e.target.value })
                      }
                      className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-purple-500/50"
                    />
                  )}

                  <button
                    onClick={() => handleSave(key)}
                    disabled={!isChanged || updateMut.isPending}
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
          })}
        </div>
      )}

      {updateMut.error && (
        <p className="mt-4 text-sm text-red-400">{updateMut.error.message}</p>
      )}
    </div>
  );
}
