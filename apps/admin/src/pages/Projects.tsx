import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProjects, createProject, updateProject, deleteProject } from "../lib/api";
import type { Project } from "@portfolio/shared-types";

const EMPTY_FORM = {
  title: "",
  description: "",
  short_description: "",
  image_url: "",
  demo_url: "",
  github_url: "",
  tags: [] as string[],
  order: 0,
  is_visible: true,
  is_featured: false,
};

export function Projects() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Project | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [tagsInput, setTagsInput] = useState("");

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const createMut = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setCreating(false);
      setForm(EMPTY_FORM);
      setTagsInput("");
    },
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Project> }) =>
      updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setEditing(null);
    },
  });

  const deleteMut = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
  });

  const openEdit = (project: Project) => {
    setEditing(project);
    setForm({
      title: project.title,
      description: project.description,
      short_description: project.short_description,
      image_url: project.image_url || "",
      demo_url: project.demo_url || "",
      github_url: project.github_url || "",
      tags: project.tags,
      order: project.order,
      is_visible: project.is_visible,
      is_featured: project.is_featured,
    });
    setTagsInput(project.tags.join(", "));
  };

  const openCreate = () => {
    setEditing(null);
    setCreating(true);
    setForm(EMPTY_FORM);
    setTagsInput("");
  };

  const handleSubmit = () => {
    const data = {
      ...form,
      tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
      image_url: form.image_url || null,
      demo_url: form.demo_url || null,
      github_url: form.github_url || null,
    };

    if (editing) {
      updateMut.mutate({ id: editing.id, data });
    } else {
      createMut.mutate(data as Omit<Project, "id">);
    }
  };

  const isFormOpen = creating || editing;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Проекты</h2>
        <button
          onClick={openCreate}
          className="rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90"
        >
          + Добавить проект
        </button>
      </div>

      {/* Форма */}
      {isFormOpen && (
        <div className="mb-6 rounded-xl border border-white/10 bg-gray-900 p-6">
          <h3 className="mb-4 text-lg font-semibold">
            {editing ? "Редактирование проекта" : "Новый проект"}
          </h3>

          <div className="space-y-4">
            {/* Название */}
            <div>
              <label className="mb-1.5 block text-sm text-white/60">Название</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-purple-500/50"
                placeholder="Мой крутой проект"
              />
            </div>

            {/* Краткое описание */}
            <div>
              <label className="mb-1.5 block text-sm text-white/60">Краткое описание</label>
              <input
                value={form.short_description}
                onChange={(e) => setForm({ ...form, short_description: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-purple-500/50"
                placeholder="Краткое описание для карточки"
              />
            </div>

            {/* Полное описание */}
            <div>
              <label className="mb-1.5 block text-sm text-white/60">Полное описание</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-purple-500/50 resize-none"
                placeholder="Подробное описание для featured-проектов"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {/* URL изображения */}
              <div>
                <label className="mb-1.5 block text-sm text-white/60">URL изображения</label>
                <input
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-purple-500/50"
                  placeholder="https://..."
                />
              </div>

              {/* Demo URL */}
              <div>
                <label className="mb-1.5 block text-sm text-white/60">Demo URL</label>
                <input
                  value={form.demo_url}
                  onChange={(e) => setForm({ ...form, demo_url: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-purple-500/50"
                  placeholder="https://demo.example.com"
                />
              </div>

              {/* GitHub URL */}
              <div>
                <label className="mb-1.5 block text-sm text-white/60">GitHub URL</label>
                <input
                  value={form.github_url}
                  onChange={(e) => setForm({ ...form, github_url: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-purple-500/50"
                  placeholder="https://github.com/..."
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Теги */}
              <div>
                <label className="mb-1.5 block text-sm text-white/60">
                  Теги (через запятую)
                </label>
                <input
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-purple-500/50"
                  placeholder="React, TypeScript, Next.js"
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
            </div>

            {/* Чекбоксы */}
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm text-white/60">
                <input
                  type="checkbox"
                  checked={form.is_visible}
                  onChange={(e) => setForm({ ...form, is_visible: e.target.checked })}
                />
                Видимый
              </label>
              <label className="flex items-center gap-2 text-sm text-white/60">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                />
                Избранный
              </label>
            </div>
          </div>

          {/* Кнопки */}
          <div className="mt-4 flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={createMut.isPending || updateMut.isPending}
              className="rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {editing ? "Сохранить" : "Создать"}
            </button>
            <button
              onClick={() => { setCreating(false); setEditing(null); }}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/60 hover:text-white"
            >
              Отмена
            </button>
          </div>

          {(createMut.error || updateMut.error) && (
            <p className="mt-3 text-sm text-red-400">
              {(createMut.error || updateMut.error)?.message}
            </p>
          )}
        </div>
      )}

      {/* Список проектов */}
      {isLoading ? (
        <p className="text-white/40">Загрузка...</p>
      ) : projects.length === 0 ? (
        <p className="text-white/40">Проектов пока нет</p>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="rounded-xl border border-white/10 bg-gray-900 p-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white">{project.title}</h3>
                    {project.is_featured && (
                      <span className="rounded bg-purple-500/20 px-2 py-0.5 text-xs text-purple-300">
                        Featured
                      </span>
                    )}
                    {!project.is_visible && (
                      <span className="rounded bg-white/10 px-2 py-0.5 text-xs text-white/40">
                        Скрыт
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-white/50">{project.short_description}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {project.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="rounded bg-white/5 px-2 py-0.5 text-xs text-white/50"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="ml-4 flex gap-2">
                  <button
                    onClick={() => openEdit(project)}
                    className="text-white/50 hover:text-white"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Удалить проект "${project.title}"?`)) {
                        deleteMut.mutate(project.id);
                      }
                    }}
                    className="text-white/50 hover:text-red-400"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
