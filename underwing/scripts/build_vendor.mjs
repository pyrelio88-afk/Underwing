#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(HERE, "..", "..");
const VENDOR_CAP_BYTES = 1024 * 1024;

function parseArgs(argv) {
  const args = {
    stageDir: process.cwd(),
    outDir: path.join(REPO_ROOT, "assets", "vendor"),
  };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--stage-dir" && argv[i + 1]) {
      args.stageDir = path.resolve(argv[++i]);
    } else if (arg === "--out-dir" && argv[i + 1]) {
      args.outDir = path.resolve(argv[++i]);
    }
  }
  return args;
}

async function loadEsbuild(stageDir) {
  const candidate = path.join(stageDir, "node_modules", "esbuild", "lib", "main.js");
  if (fs.existsSync(candidate)) {
    const mod = await import(pathToFileURL(candidate).href);
    return mod.default || mod;
  }
  const mod = await import("esbuild");
  return mod.default || mod;
}

async function main() {
  const { stageDir, outDir } = parseArgs(process.argv.slice(2));
  const esbuild = await loadEsbuild(stageDir);

  fs.mkdirSync(outDir, { recursive: true });

  const threeEntry = [
    'import * as THREE_NS from "three";',
    'import { OrbitControls } from "three/addons/controls/OrbitControls.js";',
    "const THREE = Object.assign({}, THREE_NS, { OrbitControls });",
    "window.THREE = THREE;",
    "window.THREE_ADDONS = Object.assign(window.THREE_ADDONS || {}, { OrbitControls });",
  ].join("\n");

  const iosEntry = [
    'import { CupertinoPane as RawCupertinoPane } from "cupertino-pane";',
    'import { animate, spring, stagger } from "motion";',
    "class CupertinoPane extends RawCupertinoPane {",
    "  constructor(...args) {",
    "    super(...args);",
    "    if (this.keyboardEvents) {",
    "      this.keyboardEvents.fixBodyKeyboardResize = function () {};",
    '      const kbProto = Object.getPrototypeOf(this.keyboardEvents);',
    '      if (kbProto && typeof kbProto.fixBodyKeyboardResize === "function" && !kbProto.__underwingPatched) {',
    "        kbProto.fixBodyKeyboardResize = function () {};",
    "        kbProto.__underwingPatched = true;",
    "      }",
    "    }",
    "  }",
    "}",
    "window.CupertinoPane = CupertinoPane;",
    "window.Motion = { animate, spring, stagger };",
  ].join("\n");

  const threeOut = path.join(outDir, "three-vendor.iife.js");
  const iosOut = path.join(outDir, "ios-vendor.iife.js");

  const common = {
    bundle: true,
    format: "iife",
    minify: true,
    platform: "browser",
    target: ["es2020"],
    legalComments: "none",
  };

  await esbuild.build({
    ...common,
    stdin: {
      contents: threeEntry,
      resolveDir: stageDir,
      sourcefile: "three-vendor-entry.js",
      loader: "js",
    },
    outfile: threeOut,
  });

  await esbuild.build({
    ...common,
    stdin: {
      contents: iosEntry,
      resolveDir: stageDir,
      sourcefile: "ios-vendor-entry.js",
      loader: "js",
    },
    outfile: iosOut,
  });

  const threeSize = fs.statSync(threeOut).size;
  const iosSize = fs.statSync(iosOut).size;
  const totalSize = threeSize + iosSize;

  if (threeSize <= 0 || iosSize <= 0) {
    throw new Error(`Vendor bundle must be non-empty (three=${threeSize}, ios=${iosSize})`);
  }
  if (totalSize >= VENDOR_CAP_BYTES) {
    throw new Error(
      `Combined vendor bundle ${totalSize} B exceeds cap ${VENDOR_CAP_BYTES} B`
    );
  }

  console.log(
    `vendor bundles ok -> ${outDir}\n` +
      `  three-vendor.iife.js: ${threeSize.toLocaleString("en-US")} B (${(threeSize / 1024).toFixed(2)} KB)\n` +
      `  ios-vendor.iife.js  : ${iosSize.toLocaleString("en-US")} B (${(iosSize / 1024).toFixed(2)} KB)\n` +
      `  total               : ${totalSize.toLocaleString("en-US")} B (${(totalSize / 1024).toFixed(2)} KB) < ${(VENDOR_CAP_BYTES / 1024).toFixed(1)} KB`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
