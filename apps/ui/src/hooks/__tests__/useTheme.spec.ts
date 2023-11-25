import "@testing-library/jest-dom";
import { act, renderHook } from "@testing-library/react";

import { useThemeStore } from "../../store/useThemeStore";
import { useTheme } from "../useTheme";

describe("useTheme", () => {
  it('should add the "data-theme" attribute to the document element', () => {
    renderHook(() => useTheme());

    const htmlTag = document.documentElement;

    expect(htmlTag).toHaveAttribute("data-theme", "light");
  });
  it('should toggle data-theme to dark when theme is "light"', () => {
    renderHook(() => useTheme());
    const htmlElement = document.documentElement;

    expect(htmlElement).toHaveAttribute("data-theme", "light");

    const { result } = renderHook(() => useThemeStore());

    act(() => result.current.toggleTheme("dark"));

    expect(htmlElement).toHaveAttribute("data-theme", "dark");
  });

  it("should toggle betwen themes successfully", () => {
    renderHook(() => useTheme());
    const htmlElement = document.documentElement;

    expect(htmlElement).toHaveAttribute("data-theme", "light");

    const { result } = renderHook(() => useThemeStore());

    act(() => result.current.toggleTheme("dark"));

    expect(htmlElement).toHaveAttribute("data-theme", "dark");

    act(() => result.current.toggleTheme("light"));

    expect(htmlElement).toHaveAttribute("data-theme", "light");
  });
});
