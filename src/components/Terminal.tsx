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
    <div className="panel term">
      <div className="panel-title">shell</div>
      <div className="term-log" ref={logRef}>
        {lines.map((l, i) => (
          <div className={l.isCmd ? "cmd" : "out"} key={i}>
            {l.text}
          </div>
        ))}
      </div>
      <div className="term-input-row">
        <span className="prompt">guest@ekoubuyoi:~$</span>
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
        />
      </div>
      <div className="hint">
        try <b>help</b>, <b>ls</b>, <b>cat 01-clinic-portal.md</b>, <b>cd blogs</b>, <b>open github</b>,{" "}
        <b>clear</b>
      </div>
    </div>
  );
}
