"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";


export function Combobox({ value, onValueChange, options, placeholder, className }) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const triggerRef = React.useRef(null);
  const [contentWidth, setContentWidth] = React.useState("200px");

  const stringValue = value?.toString() || "";
  const selectedOption = options.find((option) => option.value === stringValue);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  React.useEffect(() => {
    if (triggerRef.current) {
      const width = triggerRef.current.getBoundingClientRect().width;
      setContentWidth(`${width}px`);
    }
  }, [open]);

  const handleValueChange = (newValue) => {
    onValueChange(newValue);
    setOpen(false);
    setSearchTerm("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between overflow-hidden", className)}
          ref={triggerRef}
        >
          <span className="truncate text-gray-400 font-normal flex-1 text-left">
            {displayText}
          </span>
          <ChevronsUpDown className="!ml-2 h-4 w-4 text-bg-primary font-bold shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn("!p-0 bg-white z-[1001]")}
        style={{ width: contentWidth }}
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
        onInteractOutside={(e) => {
          const isComboboxElement = e.target.closest('[role="combobox"]') || 
                                  e.target.closest('[role="listbox"]');
          if (isComboboxElement) {
            e.preventDefault();
          }
        }}
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={`Search ${placeholder.toLowerCase()}...`}
            className="h-9"
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            <CommandEmpty>No {placeholder.toLowerCase()} found.</CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                    className="!px-4 !py-2 cursor-pointer hover:bg-gray-100"
                  onSelect={() => {
                    // Removed event parameter since CommandItem doesn't pass it
                    handleValueChange(option.value);
                  }}
                >
                  {option.label}
                  <Check
                    className={cn(
                      "!ml-auto h-4 w-4",
                      stringValue === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}


export function ComboboxMultiSelect({ value, onValueChange, options, placeholder, className }) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const triggerRef = React.useRef(null);
  const [contentWidth, setContentWidth] = React.useState("200px");

  const selectedValues = Array.isArray(value) ? value : value ? [value] : [];

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  React.useEffect(() => {
    if (triggerRef.current) {
      const width = triggerRef.current.getBoundingClientRect().width;
      setContentWidth(`${width}px`);
    }
  }, [open]);

  const handleSelect = (currentValue) => {
    const newValues = selectedValues.includes(currentValue)
      ? selectedValues.filter((val) => val !== currentValue)
      : [...selectedValues, currentValue];
    onValueChange(newValues);
    // Don't close the popover here to allow multiple selections
    setSearchTerm(""); // Clear search term on selection
  };

  return (
    <Popover open={open} onOpenChange={setOpen} modal> {/* Add modal prop */}
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between overflow-hidden", className)}
          ref={triggerRef}
        >
          <span className="truncate !text-gray-200 flex-1 text-left">
            {selectedValues.length > 0
              ? selectedValues
                  .map((val) => options.find((opt) => opt.value === val)?.label)
                  .join(", ") || placeholder
              : placeholder}
          </span>
          <ChevronsUpDown className="!ml-2 h-4 w-4 text-bg-primary font-bold shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn("!p-0 bg-white z-[1001]")}
        style={{ width: contentWidth }}
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
        onInteractOutside={(e) => {
          const isComboboxElement = e.target.closest('[role="combobox"]') || 
                                  e.target.closest('[role="listbox"]');
          if (isComboboxElement) {
            e.preventDefault();
          }
        }}
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={`Search ${placeholder.toLowerCase()}...`}
            className="h-9"
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            <CommandEmpty>No {placeholder.toLowerCase()} found.</CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}
                >
                  {option.label}
                  <Check
                    className={cn(
                      "!ml-auto h-4 w-4",
                      selectedValues.includes(option.value) ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}