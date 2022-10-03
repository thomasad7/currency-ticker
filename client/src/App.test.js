import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders currency ticker app", () => {
  render(<App />);
  const linkElement = screen.getByText(/Currency Ticker/i);
  expect(linkElement).toBeInTheDocument();
});

test("renders select element", () => {
  const { container } = render(<App />);
  const linkElement= container.querySelector('select');
  expect(linkElement).toBeInTheDocument();
});
