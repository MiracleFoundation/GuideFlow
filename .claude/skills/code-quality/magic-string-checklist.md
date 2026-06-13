# Quick Checklist: Magic String Detection

Use this checklist when writing or reviewing C# code.

---

## 🔴 Red Flags — Immediately Replace

| Pattern | Example | Fix |
|---------|---------|-----|
| String property with fixed values | `string Mode = "bubble"` | Use enum |
| String array with known values | `string[] Buttons = {"next","prev"}` | Use enum array |
| String comparison | `if (mode == "active")` | Use enum comparison |
| Inline CSS class | `"gf-active"` | Use constant |
| Inline default text | `"Next"`, `"Back"`, `"Done"` | Use constant |
| Status as string | `"Active"`, `"Inactive"` | Use enum |

---

## 🟡 Warning Signs — Check If Needs Enum

- String used in switch statement
- String validated against a list
- String passed to JS interop as mode/type
- String repeated in 2+ files

---

## 🟢 Acceptable Magic Strings

- Truly free-form user input
- Log messages
- Exception messages
- Template strings with dynamic content
- One-off debug strings

---

## Quick Decision Tree

```
Is this string a fixed set of values?
├─ YES → Is it mutually exclusive?
│        ├─ YES → Use ENUM
│        └─ NO  → Use ENUM ARRAY
└─ NO  → Is it shared across files?
         ├─ YES → Use CONSTANT
         └─ NO  → OK as inline string
```

---

## Before Committing

```bash
# Search for potential magic strings
grep -rn "\"[a-z]*\"" --include="*.cs" --include="*.razor" | grep -v "//"
```

Look for:
- Quoted lowercase words: `"center"`, `"bottom"`, `"active"`
- Quoted CSS classes: `"gf-"` prefix
- Quoted button text: `"Next"`, `"Back"`, `"Skip"`
