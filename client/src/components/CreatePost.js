import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  ToastsContainer,
  ToastsStore,
  ToastsContainerPosition,
} from "react-toasts";

function CreatePost() {
  const { register, handleSubmit, errors } = useForm();

  const history = useHistory();
  const [text, setText] = useState("Post");

  const onSubmit = (data) => {
    setText("Posting...");
    const regex = / /g;
    let quoteLink = data.quote.replace(regex, "%20");
    let quoteByLink = data.quoteBy.replace(regex, "%20");
    let twitterLink = `https://mobile.twitter.com/intent/tweet?hashtags=quotes&text=%22${quoteLink}%22%20${quoteByLink}`;

    fetch("/createpost", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        quote: data.quote,
        quoteBy: data.quoteBy,
        twitterLink,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          ToastsStore.error(data.error);
          setText("Post");
        } else {
          ToastsStore.success("Posted");
          history.push("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="create-post-wrapper">
      <div className="card">
        <div className="card-header">Create Post</div>
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label htmlFor="quote">Enter Quote</label>
              <textarea
                name="quote"
                className="form-control shadow-none"
                id="quote"
                minLength="5"
                maxLength="400"
                ref={register({ required: true })}
              ></textarea>
              {errors.quote && (
                <div className="alert alert-danger" role="alert">
                  Quote is required
                </div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="quoteBy">Quote By</label>
              <input
                name="quoteBy"
                type="text"
                className="form-control shadow-none"
                id="quoteBy"
                ref={register({ required: true })}
              />
              {errors.quoteBy && (
                <div className="alert alert-danger" role="alert">
                  Quote By is required
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block create-post-btn"
            >
              {text}
            </button>
          </form>
        </div>
      </div>
      <ToastsContainer
        store={ToastsStore}
        position={ToastsContainerPosition.TOP_CENTER}
        lightBackground
      />
    </div>
  );
}

export default CreatePost;
