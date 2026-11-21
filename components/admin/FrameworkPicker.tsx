import { FRAMEWORK_GROUPS } from "@/lib/frameworks";

/**
 * Framework chips grouped by category. Each chip is a real checkbox named
 * "frameworks", so the form sends every checked one and it works without JavaScript.
 */
export default function FrameworkPicker({ defaultValue = [] }: { defaultValue?: string[] }) {
  const selected = new Set(defaultValue);

  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium text-ink">
        Frameworks <span className="font-normal text-faint">(optional, pick any)</span>
      </legend>
      <div className="space-y-3 rounded-2xl bg-canvas p-3.5">
        {FRAMEWORK_GROUPS.map((group) => (
          <div key={group.label} className="flex flex-col gap-2 sm:flex-row sm:items-baseline">
            <span className="w-24 shrink-0 text-xs font-medium text-muted">{group.label}</span>
            <div className="flex flex-wrap gap-1.5">
              {group.items.map((name) => (
                <label key={name} className="cursor-pointer">
                  <input
                    type="checkbox"
                    name="frameworks"
                    value={name}
                    defaultChecked={selected.has(name)}
                    className="peer sr-only"
                  />
                  <span className="inline-flex h-7 items-center rounded-full bg-surface px-3 text-[13px] text-ink-2 ring-1 ring-ink/10 transition select-none hover:ring-ink/25 peer-checked:bg-accent peer-checked:text-white peer-checked:ring-accent peer-focus-visible:ring-2 peer-focus-visible:ring-accent/50">
                    {name}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </fieldset>
  );
}
