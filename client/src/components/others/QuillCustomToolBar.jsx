import { Tooltip } from "@chakra-ui/react";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaListOl,
  FaListUl,
  FaLink,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaAlignJustify,
  FaEraser,
} from "react-icons/fa";
import { useEffect, useState } from "react";

const CustomToolbar = ({ quillRef }) => {
  const [formats, setFormats] = useState({});

  useEffect(() => {
    const editor = quillRef?.current?.getEditor();
    if (!editor) return;

    const handleChange = (range) => {
      if (range) {
        const activeFormats = editor.getFormat(range);
        setFormats(activeFormats);
        console.log(formats);
      }
    };

    editor.on("selection-change", handleChange);
    return () => editor.off("selection-change", handleChange);
  }, [quillRef]);

  const applyFormat = (format, value = true) => {
    const editor = quillRef?.current?.getEditor();
    if (!editor) return;

    const currentFormats = editor.getFormat();
    if (
      currentFormats[format] === value ||
      (value === true && currentFormats[format])
    ) {
      editor.format(format, false);
    } else {
      editor.format(format, value);
    }

    const updatedFormats = editor.getFormat();
    setFormats(updatedFormats);
    console.log(formats);
  };

  const insertLink = () => {
    const editor = quillRef?.current?.getEditor();
    const url = prompt("Enter the link URL:");
    if (url && editor) {
      const range = editor.getSelection();
      if (range) {
        editor.format("link", url);
      }
    }
  };

  const clearFormatting = () => {
    const editor = quillRef?.current?.getEditor();
    if (editor) {
      editor.format("bold", false);
      editor.format("italic", false);
      editor.format("underline", false);
      editor.format("list", false);
      editor.format("header", false);
      editor.format("color", false);
      editor.format("background", false);
      editor.format("font", false);
      editor.format("align", false);
    }
  };

  const isActive = (format, value = true) =>
    formats[format] === value || (value === true && formats[format]);

  const buttonClass = (active) =>
    `px-3 py-2 rounded-md border-primary border-[1px] ${
      active ? "bg-green-200" : "hover:bg-green-100"
    }`;

  return (
    <div className="w-full h-max flex flex-wrap justify-between gap-1 border-primary border-[1px] p-2 rounded-t-lg bg-white dark:bg-darkBackground">
      <select
        value={formats.size || ""}
        onChange={(e) => applyFormat("size", e.target.value || false)}
        className="p-1 border-primary border-[1px] hover:bg-green-100 cursor-pointer rounded-md text-primary font-medium"
      >
        <option value="">Normal</option>
        <option value="extra-small">XS</option>
        <option value="small">Small</option>
        <option value="medium">Medium</option>
        <option value="large">Large</option>
        <option value="huge">Huge</option>
      </select>
      
      {/* Font Family */}
      <select
        value={formats.font || ""}
        onChange={(e) => applyFormat("font", e.target.value || false)}
        className="p-1 border-primary border-[1px] hover:bg-green-100 cursor-pointer rounded-md text-primary font-medium"
      >
        <option value="">Default</option>
        <option value="serif">Serif</option>
        <option value="monospace">Monospace</option>
      </select>

      {/* Text Color */}
      <Tooltip label="Text Color">
        <input
          type="color"
          value={formats.color || "#000000"}
          onChange={(e) => applyFormat("color", e.target.value)}
          className="w-[40px] h-[40px] rounded-md border-primary border-[1px] cursor-pointer"
        />
      </Tooltip>

      {/* Background Color */}
      <Tooltip label="Background Color">
        <input
          type="color"
          value={formats.background || "#ffffff"}
          onChange={(e) => applyFormat("background", e.target.value)}
          className="w-[40px] h-[40px] rounded-md border-primary border-[1px] cursor-pointer"
        />
      </Tooltip>

      {/* Bold */}
      <Tooltip label="Bold">
        <button
          className={buttonClass(isActive("bold"))}
          onClick={() => applyFormat("bold")}
        >
          <FaBold className="text-primary font-extrabold" />
        </button>
      </Tooltip>

      {/* Italic */}
      <Tooltip label="Italic">
        <button
          className={buttonClass(isActive("italic"))}
          onClick={() => applyFormat("italic")}
        >
          <FaItalic className="text-primary font-extrabold" />
        </button>
      </Tooltip>

      {/* Underline */}
      <Tooltip label="Underline">
        <button
          className={buttonClass(isActive("underline"))}
          onClick={() => applyFormat("underline")}
        >
          <FaUnderline className="text-primary font-extrabold" />
        </button>
      </Tooltip>

      {/* Ordered List */}
      <Tooltip label="Ordered List">
        <button
          className={buttonClass(isActive("list", "ordered"))}
          onClick={() => applyFormat("list", "ordered")}
        >
          <FaListOl className="text-primary font-extrabold" />
        </button>
      </Tooltip>

      {/* Bullet List */}
      <Tooltip label="Bullet List">
        <button
          className={buttonClass(isActive("list", "bullet"))}
          onClick={() => applyFormat("list", "bullet")}
        >
          <FaListUl className="text-primary font-extrabold" />
        </button>
      </Tooltip>

      {/* Insert Link */}
      <Tooltip label="Insert Link">
        <button className={buttonClass(false)} onClick={insertLink}>
          <FaLink className="text-primary font-extrabold" />
        </button>
      </Tooltip>

      {/* Align Left */}
      <Tooltip label="Align Left">
        <button
          className={buttonClass(isActive("align", "left"))}
          onClick={() => applyFormat("align", "left")}
        >
          <FaAlignLeft className="text-primary font-extrabold" />
        </button>
      </Tooltip>

      {/* Align Center */}
      <Tooltip label="Align Center">
        <button
          className={buttonClass(isActive("align", "center"))}
          onClick={() => applyFormat("align", "center")}
        >
          <FaAlignCenter className="text-primary font-extrabold" />
        </button>
      </Tooltip>

      {/* Align Right */}
      <Tooltip label="Align Right">
        <button
          className={buttonClass(isActive("align", "right"))}
          onClick={() => applyFormat("align", "right")}
        >
          <FaAlignRight className="text-primary font-extrabold" />
        </button>
      </Tooltip>

      {/* Justify */}
      <Tooltip label="Justify">
        <button
          className={buttonClass(isActive("align", "justify"))}
          onClick={() => applyFormat("align", "justify")}
        >
          <FaAlignJustify className="text-primary font-extrabold" />
        </button>
      </Tooltip>

      {/* Clear Formatting */}
      <Tooltip label="Clear Formatting">
        <button className={buttonClass(false)} onClick={clearFormatting}>
          <FaEraser className="text-primary font-extrabold" />
        </button>
      </Tooltip>
    </div>
  );
};

export default CustomToolbar;
