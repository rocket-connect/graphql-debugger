import "@testing-library/jest-dom";
import { act, render, renderHook } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import "../../__mocks__/matchMedia";
import { Page } from "../../components/utils/page";
import { Toggle } from "../../components/utils/toggle";
import { THEME_TYPE } from "../../utils/constants";
import { useThemeStore } from "../useThemeStore";

describe("useThemeStore", () => {
  it("should render with the correct initial state based on system preference", () => {
    const { result } = renderHook(() => useThemeStore());

    const isDarkMode = window.matchMedia("(prefers-color-scheme: dark").matches;

    expect(result.current.theme).toBe(
      isDarkMode ? THEME_TYPE.dark : THEME_TYPE.light,
    );
  });
  it('should toggle the theme from "light" to "dark"', () => {
    const { result } = renderHook(() => useThemeStore());
    expect(result.current.theme).toBe("light");

    act(() => result.current.toggleTheme("dark"));

    expect(result.current.theme).toBe("dark");
  });

  it("should toggle when user clicks toggle button", async () => {
    const { result } = renderHook(() => useThemeStore());
    expect(result.current.theme).toBe("light");

    const { getByTestId } = render(
      <Toggle
        initialState={false}
        label="toggle dark mode"
        onToggle={(check) => {
          if (check) {
            result.current.toggleTheme(THEME_TYPE.dark);
          } else {
            result.current.toggleTheme(THEME_TYPE.light);
          }
        }}
      />,
    );

    expect(getByTestId("toggle-wrapper")).toBeInTheDocument();

    await userEvent.click(getByTestId("checkbox"));
    expect(result.current.theme).toBe(THEME_TYPE.dark);

    await userEvent.click(getByTestId("checkbox"));
    expect(result.current.theme).toBe(THEME_TYPE.light);
  });
});
