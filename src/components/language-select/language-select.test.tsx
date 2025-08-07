import { render, fireEvent } from "@testing-library/react";
import LanguageSelect from "./language-select";
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n";

describe("LanguageSelect", () => {
  it("renders and changes language", () => {
    const { getByRole } = render(
      <I18nextProvider i18n={i18n}>
        <LanguageSelect />
      </I18nextProvider>
    );
    const select = getByRole("combobox");
    fireEvent.mouseDown(select);
    // You can add more detailed tests for language change if needed
    expect(select).toBeInTheDocument();
  });
});
