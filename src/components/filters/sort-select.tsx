"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface SortSelectProps {
  defaultValue: string;
  options: { value: string; label: string }[];
}

export function SortSelect({ defaultValue, options }: SortSelectProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", e.target.value);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <select
      defaultValue={defaultValue}
      onChange={handleChange}
      className="px-3 py-1.5 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary/20 outline-none"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
