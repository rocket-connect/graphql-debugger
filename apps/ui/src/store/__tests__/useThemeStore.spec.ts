import { act, renderHook } from "@testing-library/react";

import { useThemeStore } from "../useThemeStore";

describe("useThemeStore", () => {
  it("should render with the correct initial state(light)", () => {
    const { result } = renderHook(() => useThemeStore());

    expect(result.current.theme).toBe("light");
  });
  it('should toggle the theme from "light" to "dark"', () => {
    const { result } = renderHook(() => useThemeStore());
    expect(result.current.theme).toBe("light");

    act(() => result.current.toggleTheme("dark"));

    expect(result.current.theme).toBe("dark");
  });
});
