-- vimple turnkey IDE config (Neovim, no plugin manager required).
--
-- Loaded only when you pick "turnkey" in `./vimple` setup, via
-- XDG_CONFIG_HOME=config/turnkey. It wires Neovim's *built-in* LSP client to
-- typescript-language-server, so jump-to-definition, auto-import, completion,
-- rename and diagnostics work out of the box — the keymaps below match the
-- defaults shipped in keymap.json.

vim.g.mapleader = " "

-- Sensible IDE-ish defaults.
vim.opt.number = true
vim.opt.relativenumber = true
vim.opt.expandtab = true
vim.opt.shiftwidth = 2
vim.opt.tabstop = 2
vim.opt.signcolumn = "yes"
vim.opt.ignorecase = true
vim.opt.smartcase = true
vim.opt.completeopt = { "menuone", "noselect" }

-- Built-in fuzzy-ish file finding: `:find <Tab>` searches recursively.
vim.opt.path:append("**")
vim.opt.wildmenu = true
vim.opt.wildmode = { "longest:full", "full" }
-- A simple project grep via ripgrep when available, else grep.
if vim.fn.executable("rg") == 1 then
  vim.opt.grepprg = "rg --vimgrep --smart-case"
  vim.opt.grepformat = "%f:%l:%c:%m"
end

-- Start typescript-language-server for TS/JS buffers using the built-in client.
local function ts_root()
  return vim.fs.dirname(vim.fs.find({ "tsconfig.json", "package.json", ".git" }, { upward = true })[1])
end

vim.api.nvim_create_autocmd("FileType", {
  pattern = { "typescript", "typescriptreact", "javascript", "javascriptreact" },
  callback = function(args)
    if vim.fn.executable("typescript-language-server") ~= 1 then
      return
    end
    vim.lsp.start({
      name = "tsserver",
      cmd = { "typescript-language-server", "--stdio" },
      root_dir = ts_root(),
    }, { bufnr = args.buf })
  end,
})

-- IDE keymaps (these mirror keymap.json's defaults).
vim.api.nvim_create_autocmd("LspAttach", {
  callback = function(args)
    local buf = args.buf
    local map = function(lhs, rhs) vim.keymap.set("n", lhs, rhs, { buffer = buf, silent = true }) end
    map("gd", vim.lsp.buf.definition) -- jump_to_def
    map("<leader>rn", vim.lsp.buf.rename) -- rename_symbol
    map("K", vim.lsp.buf.hover)
    map("gr", vim.lsp.buf.references)
    map("[d", function() vim.diagnostic.jump({ count = -1 }) end)
    map("]d", function() vim.diagnostic.jump({ count = 1 }) end)
    -- LSP-driven omni-completion: insert mode <C-x><C-o> (omni_complete).
    vim.bo[buf].omnifunc = "v:lua.vim.lsp.omnifunc"
  end,
})

vim.diagnostic.config({ virtual_text = true, signs = true, underline = true })
