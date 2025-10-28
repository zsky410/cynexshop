import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/cynexshop/", // Thay 'cynexshop' bằng tên repo của bạn
});
