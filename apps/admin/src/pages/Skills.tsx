import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSkills, createSkill, updateSkill, deleteSkill } from "../lib/api";
import type { Skill } from "@portfolio/shared-types";

const CATEGORIES = [
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "mobile", label: "Mobile" },
  { value: "devops", label: "DevOps" },
];

// Тип категории из Skill
type SkillCategory = Skill["category"];

// Начальные значения для формы создания/редактирования
const EMPTY_FORM: Omit<Skill, "id"> = {
  name: "",
  category: "frontend" as SkillCategory,
  icon: "",
  level: 50,
  order: 0,
  is_visible: true,
};

export function Skills() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Skill | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  // Загрузка навыков
  const { data: skills = [], isLoading } = useQuery({
    queryKey: ["skills"],
    queryFn: getSkills,
  });

  // Мутации
  const createMut = useMutation({
    mutationFn: createSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      setCreating(false);
      setForm(EMPTY_FORM);
    },
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Skill> }) =>
      updateSkill(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      setEditing(null);
    },
  });

  const deleteMut = useMutation({
    mutationFn: deleteSkill,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["skills"] }),
  });

  // Открытие формы редактирования
  const openEdit = (skill: Skill) => {
    setEditing(skill);
    setForm({
      name: skill.name,
      category: skill.category,
      icon: skill.icon,
      level: skill.level,
      order: skill.order,
      is_visible: skill.is_visible,
    });
  };

  // Открытие формы создания
  const openCreate = () => {
    setEditing(null);
    setCreating(true);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = () => {
    if (editing) {
      updateMut.mutate({ id: editing.id, data: form });
    } else {
      createMut.mutate(form as Omit<Skill, "id">);
    }
  };

  const isFormOpen = creating || editing;

  return (
    <div>
      {/* Заголовок */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Навыки</h2>
        <button
          onClick={openCreate}
          className="rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90"
        >
          + Добавить навык
        </button>
      </div>

      {/* Форма создания/редактирования */}
      {isFormOpen && (
        <div className="mb-6 rounded-xl border border-white/10 bg-gray-900 p-6">
          <h3 className="mb-4 text-lg font-semibold">
            {editing ? "Редактирование навыка" : "Новый навык"}
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Название */}
            <div>
              <label className="mb-1.5 block text-sm text-white/60">Название</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-purple-500/50"
                placeholder="React"
              />
            </div>

            {/* Категория */}
            <div>
              <label className="mb-1.5 block text-sm text-white/60">Категория</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as SkillCategory })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-purple-500/50"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Иконка */}
            <div>
              <label className="mb-1.5 block text-sm text-white/60">Иконка</label>
              <input
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-purple-500/50"
                placeholder="react"
              />
            </div>

            {/* Уровень */}
            <div>
              <label className="mb-1.5 block text-sm text-white/60">
                Уровень: {form.level}%
              </label>
              <input
                type="range"
                min={1}
                max={100}
                value={form.level}
                onChange={(e) => setForm({ ...form, level: Number(e.target.value) })}
                className="w-full"
              />
            </div>

            {/* Порядок */}
            <div>
              <label className="mb-1.5 block text-sm text-white/60">Порядок</label>
              <input
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-purple-500/50"
              />
            </div>

            {/* Видимость */}
            <div className="flex items-center gap-2 self-end">
              <input
                type="checkbox"
                id="skill-visible"
                checked={form.is_visible}
                onChange={(e) => setForm({ ...form, is_visible: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="skill-visible" className="text-sm text-white/60">
                Отображать на сайте
              </label>
            </div>
          </div>

          {/* Кнопки формы */}
          <div className="mt-4 flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={createMut.isPending || updateMut.isPending}
              className="rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {editing ? "Сохранить" : "Создать"}
            </button>
            <button
              onClick={() => {
                setCreating(false);
                setEditing(null);
              }}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/60 hover:text-white"
            >
              Отмена
            </button>
          </div>

          {/* Ошибки */}
          {(createMut.error || updateMut.error) && (
            <p className="mt-3 text-sm text-red-400">
              {(createMut.error || updateMut.error)?.message}
            </p>
          )}
        </div>
      )}

      {/* Таблица навыков */}
      {isLoading ? (
        <p className="text-white/40">Загрузка...</p>
      ) : skills.length === 0 ? (
        <p className="text-white/40">Навыков пока нет</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10 bg-white/5">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-white/60">Название</th>
                <th className="px-4 py-3 text-left font-medium text-white/60">Категория</th>
                <th className="px-4 py-3 text-left font-medium text-white/60">Уровень</th>
                <th className="px-4 py-3 text-left font-medium text-white/60">Видим</th>
                <th className="px-4 py-3 text-right font-medium text-white/60">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {skills.map((skill) => (
                <tr key={skill.id} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3 text-white">{skill.name}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-md bg-white/10 px-2 py-0.5 text-xs text-white/70">
                      {skill.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                      <span className="text-xs text-white/40">{skill.level}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={skill.is_visible ? "text-green-400" : "text-white/30"}>
                      {skill.is_visible ? "✓" : "✗"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openEdit(skill)}
                      className="mr-2 text-white/50 hover:text-white"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Удалить навык "${skill.name}"?`)) {
                          deleteMut.mutate(skill.id);
                        }
                      }}
                      className="text-white/50 hover:text-red-400"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
