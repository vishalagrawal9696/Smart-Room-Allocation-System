import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

const defaultFilters = { minCapacity: "", hasAC: "", hasAttachedWashroom: "", isAllocated: "" };

export default function RoomFilters({ onFilter }) {
  const [filters, setFilters] = useState(defaultFilters);
  const [open, setOpen] = useState(false);

  const hasActive = Object.values(filters).some((v) => v !== "");

  const apply = () => {
    const params = {};
    if (filters.minCapacity) params.minCapacity = filters.minCapacity;
    if (filters.hasAC !== "") params.hasAC = filters.hasAC;
    if (filters.hasAttachedWashroom !== "") params.hasAttachedWashroom = filters.hasAttachedWashroom;
    if (filters.isAllocated !== "") params.isAllocated = filters.isAllocated;
    onFilter(params);
  };

  const reset = () => {
    setFilters(defaultFilters);
    onFilter({});
  };

  const SelectFilter = ({ label, filterKey, options }) => (
    <div>
      <label className="label text-xs">{label}</label>
      <select
        className="input text-sm"
        value={filters[filterKey]}
        onChange={(e) => setFilters({ ...filters, [filterKey]: e.target.value })}
      >
        <option value="">Any</option>
        {options.map(({ value, label }) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setOpen((p) => !p)}
          className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {hasActive && (
            <span className="w-5 h-5 bg-blue-600 text-white text-[10px] rounded-full flex items-center justify-center">
              {Object.values(filters).filter(Boolean).length}
            </span>
          )}
        </button>
        {hasActive && (
          <button onClick={reset} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700">
            <X className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>

      {open && (
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="label text-xs">Min Capacity</label>
            <input
              type="number"
              className="input text-sm"
              placeholder="e.g. 2"
              min={1}
              value={filters.minCapacity}
              onChange={(e) => setFilters({ ...filters, minCapacity: e.target.value })}
            />
          </div>
          <SelectFilter
            label="AC"
            filterKey="hasAC"
            options={[{ value: "true", label: "With AC" }, { value: "false", label: "Without AC" }]}
          />
          <SelectFilter
            label="Washroom"
            filterKey="hasAttachedWashroom"
            options={[{ value: "true", label: "Attached" }, { value: "false", label: "Shared" }]}
          />
          <SelectFilter
            label="Status"
            filterKey="isAllocated"
            options={[{ value: "false", label: "Available" }, { value: "true", label: "Occupied" }]}
          />
          <div className="col-span-2 sm:col-span-4 flex gap-2">
            <button onClick={apply} className="btn-primary">
              <Search className="w-4 h-4" />
              Apply Filters
            </button>
            {hasActive && (
              <button onClick={reset} className="btn-secondary">
                <X className="w-4 h-4" />
                Reset
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
