import { useState, useRef } from "react";

// this whole component was generated with Claude (spec. Sonnet 4.6)

export function TagInput({ value, onChange, placeholder = "Type and press Enter or comma..." }) {
    const [input, setInput] = useState("");
    const inputRef = useRef(null);

    function addTag(raw) {
        const trimmed = raw.trim();
        if (!trimmed || value.includes(trimmed)) return;
        onChange([...value, trimmed]);
    }

    function handleKeyDown(e) {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag(input);
            setInput("");
        } else if (e.key === "Backspace" && input === "") {
            onChange(value.slice(0, -1));
        }
    }

    function handlePaste(e) {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text");
        const newTags = pasted.split(/[,\n]+/).map(t => t.trim()).filter(Boolean);
        const unique = newTags.filter(t => !value.includes(t));
        onChange([...value, ...unique]);
    }

    function removeTag(tag) {
        onChange(value.filter(t => t !== tag));
    }

    return (
        <div
            className="tags"
            onClick={() => inputRef.current.focus()}
            style={{ cursor: "text", minHeight: "44px", alignItems: "center" }}
        >
            {value.map(tag => (
                <span key={tag} className="tag" style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                    {tag}
                    <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        style={{
                            background: "none",
                            color: "var(--text-muted)",
                            cursor: "pointer",
                            padding: 0,
                            lineHeight: 1,
                            fontSize: "1rem",
                        }}
                    >×</button>
                </span>
            ))}
            <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                placeholder={value.length === 0 ? placeholder : ""}
                style={{
                    outline: "none",
                    flex: 1,
                    minWidth: "120px",
                    fontSize: "0.9rem",
                    background: "transparent",
                    fontFamily: "inherit",
                    color: "var(--text-muted)",
                }}
            />
        </div>
    );
}