import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import ProtectedRoute from "./protected-route";

const mockStore = configureStore([]);

describe("ProtectedRoute", () => {
  it("renders children when authenticated", () => {
    const store = mockStore({
      auth: { isAuthenticated: true },
    });

    const { getByText } = render(
      <Provider store={store}>
        <MemoryRouter>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </MemoryRouter>
      </Provider>
    );

    expect(getByText("Protected Content")).toBeInTheDocument();
  });

  it("redirects to /login when not authenticated", () => {
    const store = mockStore({
      auth: { isAuthenticated: false },
    });

    const { container } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/dashboard"]}>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </MemoryRouter>
      </Provider>
    );

    // The Navigate component will render nothing, so the protected content should not be present
    expect(container.textContent).not.toContain("Protected Content");
  });
});
