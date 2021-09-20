import { Provider } from "react-redux";
import { store } from "./store";
import React from "react";
import {
  useAddBlogPostMutation,
  useDeleteBlogPostMutation,
  useGetBlogPostsQuery,
  useUpdateBlogPostMutation,
} from "./todosApi";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import "./App.scss";

interface FormElements extends HTMLFormControlsCollection {
  titleInput: HTMLInputElement;
  textInput: HTMLInputElement;
}

interface TitleFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

function BlogPostList() {
  const { data: posts, isLoading } = useGetBlogPostsQuery();
  const [createBlogPost] = useAddBlogPostMutation();
  const [updateBlogPost] = useUpdateBlogPostMutation();
  const [deleteBlogPost] = useDeleteBlogPostMutation();

  const [title, setTitle] = React.useState("");
  const [text, setText] = React.useState("");

  const [editItemId, setEditItemId] = React.useState("");

  const itemToEdit = posts?.data?.find((i) => i.id === editItemId);
  const inEditMode = Boolean(itemToEdit);

  async function handleSubmit(event: React.FormEvent<TitleFormElement>) {
    event.preventDefault();
    const { titleInput, textInput } = event.currentTarget.elements;

    if (inEditMode) {
      await updateBlogPost({
        id: editItemId,
        title: titleInput.value,
        text: textInput.value,
      });
    } else {
      await createBlogPost({ title: titleInput.value, text: textInput.value });
    }

    setTitle("");
    setText("");
  }

  function deleteItem(id: string) {
    deleteBlogPost(id);
  }

  function editItem(id: string) {
    const itemToEdit = posts?.data?.find((i) => i.id === id);
    if (itemToEdit) {
      setTitle(itemToEdit.title);
      setText(itemToEdit.text);
      setEditItemId(id);
    }
  }

  if (isLoading) {
    console.log("isLoading:", isLoading);
  }

  return (
    <div className="App">
      <Router>
        <nav>
          <ul>
            <li>Blog</li>
          </ul>
          <ul>
            <li>
              <Link to="/">Posts</Link>
            </li>
            <li>
              <Link to="/new">New post</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/new">
            <form onSubmit={handleSubmit}>
              <label htmlFor="titleInput">Title</label>
              <input
                type="text"
                id="titleInput"
                value={title}
                onChange={(e) => {
                  setTitle(e.currentTarget.value);
                }}
              />

              <label htmlFor="text">Text</label>
              <input
                type="text"
                id="textInput"
                value={text}
                onChange={(e) => {
                  setText(e.currentTarget.value);
                }}
              />

              <button type="submit">
                {inEditMode ? "Update item" : "Add item"}
              </button>
            </form>
          </Route>

          <Route path="/">
            {posts?.data ? (
              posts.data.map((i) => (
                <article key={i.id}>
                  <header>
                    <div className="text">{i.title}</div>
                    <div className="buttons">
                      <button
                        onClick={(e) => editItem(i.id)}
                        data-test-id={`edit-${i.id}`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => deleteItem(i.id)}
                        data-test-id={`delete-${i.id}`}
                      >
                        Delete
                      </button>
                    </div>
                  </header>
                  {i.text}
                </article>
              ))
            ) : (
              <p>Please write your first post</p>
            )}
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <BlogPostList />
    </Provider>
  );
}

export { App };
