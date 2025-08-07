import { render, fireEvent } from "@testing-library/react";
import ThemeToggle from "./theme-toggle";

describe("ThemeToggle", () => {
  it("renders and toggles theme", () => {
    const toggleTheme = jest.fn();
    const { getByRole } = render(
      <ThemeToggle theme="light" toggleTheme={toggleTheme} />
    );
    const button = getByRole("button");
    fireEvent.click(button);
    expect(toggleTheme).toHaveBeenCalled();
  });
});
