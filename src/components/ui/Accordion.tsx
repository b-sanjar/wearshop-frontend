import { useRef, useState, type ReactNode } from "react";
import { Plus } from "@phosphor-icons/react";

interface AccordionItem {
  q: string;
  a: ReactNode;
}

export function Accordion({ items, defaultOpen = -1 }: { items: AccordionItem[]; defaultOpen?: number }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="accordion">
      {items.map((it, i) => (
        <AccordionRow key={i} item={it} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
      ))}
    </div>
  );
}

function AccordionRow({ item, open, onToggle }: { item: AccordionItem; open: boolean; onToggle: () => void }) {
  const body = useRef<HTMLDivElement>(null);
  return (
    <div className={`accordion__row ${open ? "is-open" : ""}`}>
      <button className="accordion__head" onClick={onToggle} aria-expanded={open}>
        <span>{item.q}</span>
        <Plus size={18} className="accordion__icon" />
      </button>
      <div
        className="accordion__body"
        style={{ height: open ? `${body.current?.scrollHeight ?? 0}px` : 0 }}
      >
        <div ref={body} className="accordion__inner">
          {item.a}
        </div>
      </div>
    </div>
  );
}
