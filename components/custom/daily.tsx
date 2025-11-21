"use client";

import { useEffect, useState } from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

export default function Daily() {
  return (
    //<div className="p-6 space-y-4">
    <div>
      <Command className="rounded-lg border shadow-md w-100">
        <CommandItem>Daily Picks</CommandItem>
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="">
            <CommandItem>
              <span>Risali</span>
            </CommandItem>
            <CommandItem>
              <span>Bhilai</span>
            </CommandItem>
            <CommandItem disabled>
              <span>Durg</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
        </CommandList>
      </Command>
    </div>
  );
}
