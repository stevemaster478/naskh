import ThemeToggle from "../ThemeToggle";
import { ThemeProvider } from "../ThemeProvider";

export default function ThemeToggleExample() {
  return (
    <ThemeProvider>
      <div className="p-8 flex justify-center">
        <ThemeToggle />
      </div>
    </ThemeProvider>
  );
}
