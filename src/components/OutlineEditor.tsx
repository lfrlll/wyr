"use client";

type OutlineEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export function OutlineEditor({ value, onChange }: OutlineEditorProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-ink">可编辑完整大纲</span>
      <textarea
        className="field min-h-[28rem] leading-7"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="生成的大纲会出现在这里，你可以直接修改，后续正文将以编辑后的版本为准。"
      />
    </label>
  );
}
