import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import MapLocationPicker from "./MapLocationPicker";
import MultiSelectDropdown from "@/components/MultiSelectDropdown";
import { Combobox, ComboboxMultiSelect } from "./ui/combobox";

export default function Add({ fields, lang, values, onChange }) {
  const commonInputClass =
    "rounded-[10px] !p-2 border border-gray-300 focus:border-bg-primary focus:ring-bg-primary";

  const handleChange = (name, value) => {
    if (onChange) {
      onChange(lang, name, value);
    }
  };

  // Separate map fields from other fields
  const mapFields = fields.filter(field => field.type === "map");
  const otherFields = fields.filter(field => field.type !== "map");

  return (
    <div className="w-full space-y-6">
      {/* Render other fields in the grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {otherFields.map((field, index) => {
          // Check for showIf condition before rendering
          if (field.showIf && !field.showIf(values)) return null;
          const value = values?.[field.name] || "";
          // Define fieldId for multi-select (if needed, otherwise remove)
          const fieldId = `${field.name}-${lang}-${index}`;

          return (
            <div key={index} className="space-y-2">
              <label
                htmlFor={field.name}
                className="block text-sm !p-3 font-medium text-gray-700"
              >
                {field.placeholder ? field.placeholder : field.name}
              </label>
              {(() => {
                switch (field.type) {
                  case "input":
                    return (
                      <Input
                        id={field.name}
                        key={index}
                        type={field.inputType || "text"}
                        placeholder={field.placeholder}
                        value={value}
                        multiple={field.multiple}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        className={`!px-5 !py-3 ${commonInputClass}`}
                      />
                    );

                  case "time":
                    return (
                      <Input
                        id={field.name}
                        key={index}
                        type="time"
                        placeholder={field.placeholder}
                        value={value}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        className={`!px-5 !py-3 ${commonInputClass}`}
                        step={field.step || "1"}
                      />
                    );

                  case "textarea":
                    return (
                      <Textarea
                        id={field.name}
                        key={index}
                        placeholder={field.placeholder}
                        value={value}
                        rows={2}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        className={`min-h-[40px] !px-5 !py-3 ${commonInputClass}`}
                      />
                    );

case "file":
  return (
    <div className="space-y-2">
      <Input
        id={field.name}
        type="file"
        multiple={field.multiple}
        onChange={(e) =>
          handleChange(
            field.name,
            field.multiple ? Array.from(e.target.files) : e.target.files?.[0]
          )
        }
        className={`min-h-[46px] flex items-center text-gray-500 ${commonInputClass} file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200`}
      />
    </div>
  );


                  case "multi-select":
                    return (
                      <ComboboxMultiSelect
                        id={fieldId}
                        value={value}
                        onValueChange={(val) => handleChange(field.name, val)}
                        options={field.options}
                        placeholder={field.placeholder}
                        className={`w-full !px-5 !py-6 ${commonInputClass}`}
                      />
                    );

                  case "select":
                    return (
                      <Combobox
                        key={`${field.name}-${values?.[field.name]}`}
 // Add key to force re-render
                        id={fieldId}
                        value={values?.[field.name]?.toString() || ""}
                        onValueChange={(val) => {
                          handleChange(field.name, val);
                        }}
                        options={field.options}
                        placeholder={field.placeholder}
                        className={`w-full !p-3 !mb-2 border border-gray-300 rounded-[10px] shadow-sm focus:outline-none focus:ring-2 focus:ring-bg-primary focus:border-bg-primary transition-all ${commonInputClass}`}
                      />
                    );

                  case "switch":
                    const isChecked = typeof value === 'string'
                      ? value === 'active' || value === '1'
                      : Boolean(value);

                    return (
                      <div className="flex items-center gap-3">
                        <Switch
                          id={field.name}
                          checked={isChecked}
                          onCheckedChange={(checked) => {
                            let newValue;
                            if (field.returnType === 'binary') {
                              newValue = checked ? 1 : 0;
                            } else if (field.returnType === 'string') {
                              newValue = checked ? 'active' : 'inactive';
                            } else {
                              newValue = checked;
                            }
                            handleChange(field.name, newValue);
                          }}
                          className={`
                              ${field.switchClassName},
                              ${isChecked ? "data-[state=checked]:bg-bg-primary dark:data-[state=checked]:bg-bg-primary" : ""}
                            `}
                        />
                        <label
                          htmlFor={field.name}
                          className={`text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                              ${isChecked ? "text-bg-primary dark:text-bg-primary" : "text-foreground"}`}>
                          {isChecked ? (field.activeLabel || 'Active') : (field.inactiveLabel || 'Inactive')}
                        </label>
                      </div>
                    );

                  default: // Correct placement for the final default case
                    return null;
                }
              })()}
            </div>
          );
        })}
      </div>

      {/* Render map fields first, outside the grid */}
      {mapFields.map((field, index) => {
        if (field.showIf && !field.showIf(values)) return null;
const value = field.type === "file"
  ? values?.[field.name]
  : values?.[field.name] || "";

        return (
          <div key={`map-${index}`} className="w-full space-y-2">
            <label
              htmlFor={field.name}
              className="block text-sm !p-3 font-medium text-gray-700"
            >
              {field.placeholder ? field.placeholder : field.name}
            </label>
            <MapLocationPicker
              value={value}
              onChange={(val) => handleChange(field.name, val)}
              placeholder={field.placeholder}
            />
          </div>
        );
      })}
    </div>
  );
}