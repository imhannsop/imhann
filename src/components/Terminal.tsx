"use client";

import { useRef, useState } from "react";
import { terminalFiles, terminalSections } from "@/lib/data";
import { scrollToSection } from "@/lib/useActiveSection";

type Line = { text: string; isCmd: boolean };

export default function Terminal() {
  const [lines, setLines] = useState<Line[]>([{ text: "type 'help' to see available commands", isCmd: false }]);
  const [value, setValue] = useState("");
  const logRef = useRef<HTMLDivElement>(null);

  const print = (text: string, isCmd = false) => {
    setLines((prev) => [...prev, { text, isCmd }]);
    requestAnimationFrame(() => {
      if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
    });
  };

  const runCommand = (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;
    print(cmd, true);
    const [base, ...rest] = cmd.split(" ");
    const arg = rest.join(" ");

    switch (base) {
      case "help":
        print("commands: help, ls, cat <file>, cd <section>, open github, open resume, whoami, clear");
        break;
      case "ls":
        print("about.txt  01-clinic-portal.md  02-ragbot-ai.md  certs/  blogs/  contact/");
        break;
      case "cat":
        if (terminalFiles[arg]) print(terminalFiles[arg]);
        else print(`cat: ${arg || "(missing file)"}: no such file`);
        break;
      case "cd":
        if (terminalSections.includes(arg)) {
          scrollToSection(arg);
          print(`cd: ${arg}/`);
        } else {
          print(`cd: ${arg || "(missing dir)"}: no such directory`);
        }
        break;
      case "open":
        if (arg === "github") print("opening github ↗ (placeholder link)");
        else if (arg === "resume") print("opening resume ↗ (placeholder link)");
        else print(`open: ${arg || "(missing target)"}: unknown target`);
        break;
      case "whoami":
        print("guest — welcome to ekoubuyoi.dev");
        break;
      case "clear":
        setLines([]);
        break;
      default:
        print(`command not found: ${base} — try 'help'`);
    }
  };

  return (
    <div className="relative rounded-xl border-3 border-black bg-bg-panel p-8 max-sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="absolute -top-[9px] left-4 bg-bg px-2 text-xs tracking-[.14em] font-semibold text-text-dim uppercase">shell</div>
      <div
        className="mb-4 flex max-h-72 flex-col gap-2.5 overflow-y-auto text-sm sm:text-base leading-relaxed"
        ref={logRef}
      >
        {lines.map((l, i) => (
          <div
            className={l.isCmd ? "text-text-bright before:content-['guest@ekoubuyoi:~$_'] before:text-green" : "text-text-dim whitespace-pre-wrap"}
            key={i}
          >
            {l.text}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2.5 border-t border-border-dim pt-3">
        <span className="text-sm sm:text-base whitespace-nowrap text-green font-medium">guest@ekoubuyoi:~$</span>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              runCommand(value);
              setValue("");
            }
          }}
          autoComplete="off"
          spellCheck={false}
          placeholder="try: help"
          className="flex-1 bg-transparent py-1 text-sm sm:text-base text-text-bright caret-purple focus:outline-none"
        />
      </div>
      <div className="mt-3.5 text-xs sm:text-sm text-text-dim">
        try <b className="font-medium text-text">help</b>, <b className="font-medium text-text">ls</b>,{" "}
        <b className="font-medium text-text">cat 01-clinic-portal.md</b>,{" "}
        <b className="font-medium text-text">cd blogs</b>, <b className="font-medium text-text">open github</b>,{" "}
        <b className="font-medium text-text">clear</b>
      </div>
    </div>
  );
}