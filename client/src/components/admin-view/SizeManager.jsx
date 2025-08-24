import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AVAILABLE_SIZES = ["S", "M", "L", "XL", "XXL"];

export default function SizeManager({ sizes, setSizes }) {
  const [newSize, setNewSize] = useState({ value: "", stock: 0 });

  const handleAddSize = () => {
    if (!newSize.value || newSize.stock < 0) return;

    // prevent duplicate size entry
    if (sizes.some((s) => s.value === newSize.value)) return;

    setSizes([...sizes, newSize]);
    setNewSize({ value: "", stock: 0 });
  };

  const handleRemove = (index) => {
    const updated = [...sizes];
    updated.splice(index, 1);
    setSizes(updated);
  };

  return (
    <div className="space-y-4">
      <h4 className="text-md font-semibold">Sizes with Stock</h4>

      {sizes.map((size, index) => (
        <div key={index} className="flex gap-2 items-center">
          <span className="w-10">{size.value}</span>
          <span className="w-20">Stock: {size.stock}</span>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleRemove(index)}
          >
            Remove
          </Button>
        </div>
      ))}

      <div className="flex gap-2 items-center">
        <select
          className="border px-2 py-1 rounded"
          value={newSize.value}
          onChange={(e) => setNewSize({ ...newSize, value: e.target.value })}
        >
          <option value="">Select Size</option>
          {AVAILABLE_SIZES.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>

        <Input
          placeholder="Stock"
          type="number"
          min={0}
          value={newSize.stock}
          onChange={(e) =>
            setNewSize({ ...newSize, stock: parseInt(e.target.value) || 0 })
          }
        />

        <Button size="sm" onClick={handleAddSize}>
          Add
        </Button>
      </div>
    </div>
  );
}
