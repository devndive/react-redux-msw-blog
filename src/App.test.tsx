import {
  render,
  waitFor,
  screen,
  within,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { App } from "./App";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import "@testing-library/jest-dom";
import { handlers } from "./mocks/handlers";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const server = setupServer(...handlers);

test("can create, edit and delete todo item", async () => {
  render(<App />);
  await waitFor(() => screen.getByRole("heading"));
  await waitFor(() => screen.getByText("Prefilled item from server"));

  const titleInput = screen.getByLabelText("Title");
  userEvent.type(titleInput, "New Todo Item");
  userEvent.click(screen.getByText("Add item"));

  await waitFor(() => screen.getByText("New Todo Item"));
  expect(screen.getByText("New Todo Item")).toBeVisible();

  const editNode = screen.getByText("New Todo Item");
  userEvent.click(within(editNode).getByText("Edit"));
  userEvent.type(titleInput, " updated");
  userEvent.click(screen.getByText("Update item"));

  await waitFor(() => screen.getByText("New Todo Item updated"));
  expect(screen.getByText("New Todo Item updated")).toBeVisible();

  const deleteNode = screen.getByText("New Todo Item updated");
  userEvent.click(within(deleteNode).getByText("Delete"));
  await waitForElementToBeRemoved(() =>
    screen.getByText("New Todo Item updated")
  );
  expect(screen.queryByText("New Todo Item updatd")).not.toBeInTheDocument();

  expect(screen.getByRole("heading")).toHaveTextContent("Todo tracker");
});

test("user should see initial list of items", async () => {
  render(<App />);
  await waitFor(() => screen.getByRole("heading"));
  await waitFor(() => screen.getByText("Prefilled item from server"));

  expect(screen.getByText("Prefilled item from server")).toBeVisible();
});
