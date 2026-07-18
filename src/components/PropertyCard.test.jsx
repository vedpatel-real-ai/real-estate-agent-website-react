import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import PropertyCard from "./PropertyCard";
import { useFavouriteState } from "../hooks/useFavouriteState";

vi.mock("../hooks/useFavouriteState", () => ({
  useFavouriteState: vi.fn(),
}));

const mockUseFavouriteState = vi.mocked(useFavouriteState);

describe("PropertyCard", () => {
  beforeEach(() => {
    mockUseFavouriteState.mockReset();
  });

  it("shows persisted favorite state when no explicit props are supplied", () => {
    mockUseFavouriteState.mockReturnValue({
      isFavourite: () => true,
      toggleFavourite: vi.fn(),
    });

    render(
      <MemoryRouter>
        <PropertyCard
          property={{ id: 1, title: "Test property", image: "property.jpg" }}
        />
      </MemoryRouter>,
    );

    const button = screen.getByRole("button", {
      name: /remove from saved properties/i,
    });

    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(button).toHaveClass("is-active");
  });
});
