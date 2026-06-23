import { describe, it, expect } from "vitest";
import { resolveEditor } from "../src/runner/editor";

describe("resolveEditor", () => {
  it("defaults to vim with no config", () => {
    expect(resolveEditor({})).toEqual({ bin: "vim", args: [], env: {} });
  });
  it("prefers VIMPLE_EDITOR over EDITOR", () => {
    expect(resolveEditor({ VIMPLE_EDITOR: "nvim", EDITOR: "vim" }).bin).toBe("nvim");
  });
  it("treats a .vim file config as -u", () => {
    const s = resolveEditor({ VIMPLE_CONFIG: "/home/u/.vimrc.vim" });
    expect(s.args).toEqual(["-u", "/home/u/.vimrc.vim"]);
  });
  it("treats a dir config as XDG_CONFIG_HOME", () => {
    const s = resolveEditor({ VIMPLE_CONFIG: "/home/u/.config/nvim" });
    expect(s.args).toEqual([]);
    expect(s.env).toEqual({ XDG_CONFIG_HOME: "/home/u/.config/nvim" });
  });
});
