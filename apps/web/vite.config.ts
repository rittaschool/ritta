import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
const commitHash = require("child_process")
  .execSync("git rev-parse --short HEAD")
  .toString();

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __COMMIT_HASH__: JSON.stringify(commitHash),
  },
  plugins: [react()],
});
