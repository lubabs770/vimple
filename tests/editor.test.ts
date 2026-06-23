import { describe, it, expect, afterEach } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
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

  describe("with real paths on disk (filesystem wins over the name heuristic)", () => {
    let tmp: string;
    afterEach(() => {
      if (tmp) rmSync(tmp, { recursive: true, force: true });
    });

    it("treats an existing dir whose name contains a dot as XDG_CONFIG_HOME", () => {
      tmp = mkdtempSync(join(tmpdir(), "vimple-cfg-"));
      const dottedDir = join(tmp, ".config"); // basename has a dot but it IS a dir
      mkdirSync(dottedDir);
      const s = resolveEditor({ VIMPLE_CONFIG: dottedDir });
      expect(s.args).toEqual([]);
      expect(s.env).toEqual({ XDG_CONFIG_HOME: dottedDir });
    });

    it("treats an existing extensionless file as -u", () => {
      tmp = mkdtempSync(join(tmpdir(), "vimple-cfg-"));
      const file = join(tmp, "vimrc"); // no dot, but it IS a file
      writeFileSync(file, "\" config\n");
      const s = resolveEditor({ VIMPLE_CONFIG: file });
      expect(s.args).toEqual(["-u", file]);
      expect(s.env).toEqual({});
    });
  });
});
