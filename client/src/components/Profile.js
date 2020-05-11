import React, { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "../App";
import { useHistory } from "react-router-dom";

function Profile() {
  const [posts, setPosts] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [profileImage, setProfileImage] = useState(undefined);
  const [localURL, setLocalURL] = useState(undefined);

  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();

  if (state && localURL === undefined) {
    setLocalURL(state.profileImage);
  }

  let fileInput = useRef(null);

  useEffect(() => {
    fetch("/mypost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setLoadingStatus(false);
        setPosts(result.posts);
      })
      .catch((err) => {
        console.log(err);
        history.push("/error");
      });
  }, []);

  useEffect(() => {
    if (profileImage) {
      uploadImageToCloud();
    }
  }, [profileImage]);

  const likePost = (id) => {
    fetch("/like", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = posts.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setPosts(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const unlikePost = (id) => {
    fetch("/unlike", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = posts.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setPosts(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const makeComment = (text, postId) => {
    fetch("/comment", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        text,
        postId,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = posts.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });

        setPosts(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deletePost = (postId) => {
    fetch(`/deletepost/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = posts.filter((item) => {
          return item._id !== result._id;
        });
        setPosts(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteComment = (postId, commentId) => {
    fetch(`/deletecomment`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        postId,
        commentId,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = posts.filter((item) => {
          if (item._id === result._id) {
            item.comments = result.comments;
            return item;
          }
          return item;
        });
        setPosts(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const uploadImageToCloud = () => {
    const fd = new FormData();
    fd.append("file", profileImage);
    fd.append("upload_preset", "quotes-app");
    fd.append("cloud_name", "my-cloud-ss");

    fetch("https://api.cloudinary.com/v1_1/my-cloud-ss/image/upload", {
      method: "POST",
      body: fd,
    })
      .then((res) => res.json())
      .then((result) => {
        fetch("/updateprofile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({
            profileImage: result.url,
          }),
        })
          .then((res) => res.json())
          .then((result) => {
            let imgURL = result.profileImage;
            localStorage.setItem(
              "user",
              JSON.stringify({
                ...state,
                profileImage: imgURL,
              })
            );
            dispatch({
              type: "UPDATEPROFILE",
              payload: { profileImage: imgURL },
            });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fileSelectedHandler = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.addEventListener("load", () => {
        let result = reader.result;
        setLocalURL(result);
      });
      setProfileImage(file);
    }
  };

  return (
    <div className="profile-wrapper">
      <div className="main">
        <div className="container">
          <div className="user-wrapper">
            <div className="user-profile">
              <img className="profile-pic" alt="" src={localURL} />
              <input
                type="file"
                onChange={fileSelectedHandler}
                style={{ display: "none" }}
                ref={(el) => {
                  fileInput = el;
                }}
              />
              <button
                type="button"
                onClick={() => fileInput.click()}
                className="btn btn-primary update-img-btn shadow-none"
              >
                <svg
                  className="update-img-svg"
                  width="26"
                  height="18"
                  viewBox="0 0 46 38"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M31 20.5C31 25.061 27.418 28.758 23 28.758C18.582 28.758 15 25.061 15 20.5C15 15.939 18.582 12.242 23 12.242C27.418 12.242 31 15.939 31 20.5V20.5Z"
                    stroke="#fff"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M13 8H13.125H2V36H44V8H34H33.125L30.125 2H16.125L13.125 8"
                    stroke="#fff"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <div className="user-info">
              <h4>{state ? state.name : "loading"}</h4>
              <div className="user-stats">
                <p>
                  <span>{posts.length}</span> posts
                </p>
                <p>
                  <span>{state ? state.followers.length : "0"}</span> followers
                </p>
                <p>
                  <span>{state ? state.following.length : "0"}</span> following
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="gallery">
          {loadingStatus ? (
            <div className="loader-wrapper profile-loader">
              <div className="spinner-border loader" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : posts.length === 0 ? (
            <div className="make-post-wrapper">
              <p>Create some posts..</p>
            </div>
          ) : (
            posts.map((item, pos) => {
              return (
                <div
                  className="card post-card"
                  id={item.postedBy._id}
                  key={pos}
                >
                  <div className="delete-wrapper">
                    {item.postedBy._id === state._id ? (
                      <svg
                        onClick={() => deletePost(item._id)}
                        className="trash-icon"
                        width="16"
                        height="18"
                        viewBox="0 0 20 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M0 5C0 4.44772 0.447715 4 1 4H19C19.5523 4 20 4.44772 20 5C20 5.55228 19.5523 6 19 6H1C0.447715 6 0 5.55228 0 5Z"
                          fill="#666"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M8 2C7.73478 2 7.48043 2.10536 7.29289 2.29289C7.10536 2.48043 7 2.73478 7 3V4H13V3C13 2.73478 12.8946 2.48043 12.7071 2.29289C12.5196 2.10536 12.2652 2 12 2H8ZM15 4V3C15 2.20435 14.6839 1.44129 14.1213 0.87868C13.5587 0.31607 12.7956 0 12 0H8C7.20435 0 6.44129 0.31607 5.87868 0.87868C5.31607 1.44129 5 2.20435 5 3V4H3C2.44772 4 2 4.44772 2 5V19C2 19.7957 2.31607 20.5587 2.87868 21.1213C3.44129 21.6839 4.20435 22 5 22H15C15.7957 22 16.5587 21.6839 17.1213 21.1213C17.6839 20.5587 18 19.7957 18 19V5C18 4.44772 17.5523 4 17 4H15ZM4 6V19C4 19.2652 4.10536 19.5196 4.29289 19.7071C4.48043 19.8946 4.73478 20 5 20H15C15.2652 20 15.5196 19.8946 15.7071 19.7071C15.8946 19.5196 16 19.2652 16 19V6H4Z"
                          fill="#666"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M8 9C8.55228 9 9 9.44771 9 10V16C9 16.5523 8.55228 17 8 17C7.44772 17 7 16.5523 7 16V10C7 9.44771 7.44772 9 8 9Z"
                          fill="#666"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 9C12.5523 9 13 9.44771 13 10V16C13 16.5523 12.5523 17 12 17C11.4477 17 11 16.5523 11 16V10C11 9.44771 11.4477 9 12 9Z"
                          fill="#666"
                        />
                      </svg>
                    ) : null}
                  </div>
                  <div className="post-body">
                    <blockquote className="quote">
                      “{item.quote}”<footer>{item.quoteBy}</footer>
                    </blockquote>
                  </div>
                  <div className="icons-wrapper">
                    <div className="stats-container">
                      {item.likes.includes(state._id) ? (
                        <svg
                          onClick={() => {
                            unlikePost(item._id);
                          }}
                          className="unlike"
                          width="23"
                          height="21"
                          viewBox="0 0 22 19"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10.9996 18.0541C-9 7 4.99999 -5 10.9996 2.58806C17 -5 31 7 10.9996 18.0541Z"
                            fill="#f62e4b"
                          />
                        </svg>
                      ) : (
                        <svg
                          onClick={() => {
                            likePost(item._id);
                          }}
                          width="23"
                          height="21"
                          viewBox="0 0 23 21"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M13.9131 0.495075C14.702 0.168228 15.5474 0 16.4013 0C17.2551 0 18.1006 0.168229 18.8894 0.495075C19.6781 0.821861 20.3947 1.30081 20.9982 1.90455C21.602 2.5081 22.0813 3.22501 22.408 4.01368C22.7349 4.80249 22.9031 5.64797 22.9031 6.50183C22.9031 7.35568 22.7349 8.20116 22.408 8.98997C22.0812 9.77872 21.6022 10.4953 20.9984 11.0989C20.9983 11.099 20.9985 11.0989 20.9984 11.0989L12.1584 19.9389C11.7679 20.3295 11.1347 20.3295 10.7442 19.9389L1.90418 11.0989C0.684956 9.8797 0 8.22607 0 6.50183C0 4.77758 0.684956 3.12395 1.90418 1.90472C3.12341 0.68549 4.77704 0.000534773 6.50129 0.000534773C8.22554 0.000534773 9.87917 0.68549 11.0984 1.90472L11.4513 2.25761L11.804 1.90488C11.8041 1.90483 11.804 1.90494 11.804 1.90488C12.4076 1.30106 13.1244 0.821892 13.9131 0.495075ZM16.4013 2C15.8102 2 15.2248 2.11647 14.6787 2.34274C14.1326 2.56902 13.6365 2.90068 13.2186 3.31877L12.1584 4.37893C11.7679 4.76946 11.1347 4.76946 10.7442 4.37893L9.68418 3.31893C8.84003 2.47478 7.69511 2.00053 6.50129 2.00053C5.30747 2.00053 4.16255 2.47478 3.3184 3.31893C2.47424 4.16309 2 5.30801 2 6.50183C2 7.69564 2.47424 8.84056 3.3184 9.68472L11.4513 17.8176L19.5842 9.68472C20.0023 9.26683 20.3341 8.77049 20.5604 8.22439C20.7866 7.67828 20.9031 7.09295 20.9031 6.50183C20.9031 5.9107 20.7866 5.32537 20.5604 4.77926C20.3341 4.23316 20.0024 3.73699 19.5843 3.3191C19.1665 2.90101 18.67 2.56902 18.1239 2.34274C17.5778 2.11647 16.9924 2 16.4013 2Z"
                            fill="#263145"
                          />
                        </svg>
                      )}
                      {item.likes.length !== 0 ? (
                        <span className="stats">{item.likes.length}</span>
                      ) : null}
                      <svg
                        data-toggle="modal"
                        data-target={"#exampleModalCenter" + pos}
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M3 2C2.73478 2 2.48043 2.10536 2.29289 2.29289C2.10536 2.48043 2 2.73478 2 3V16.5858L4.29289 14.2929C4.48043 14.1054 4.73478 14 5 14H17C17.2652 14 17.5196 13.8946 17.7071 13.7071C17.8946 13.5196 18 13.2652 18 13V3C18 2.73478 17.8946 2.48043 17.7071 2.29289C17.5196 2.10536 17.2652 2 17 2H3ZM0.87868 0.87868C1.44129 0.31607 2.20435 0 3 0H17C17.7957 0 18.5587 0.31607 19.1213 0.87868C19.6839 1.44129 20 2.20435 20 3V13C20 13.7957 19.6839 14.5587 19.1213 15.1213C18.5587 15.6839 17.7957 16 17 16H5.41421L1.70711 19.7071C1.42111 19.9931 0.990991 20.0787 0.617317 19.9239C0.243642 19.7691 0 19.4045 0 19V3C0 2.20435 0.31607 1.44129 0.87868 0.87868Z"
                          fill="#263145"
                        />
                      </svg>
                      {item.comments.length !== 0 ? (
                        <span className="stats">{item.comments.length}</span>
                      ) : null}
                    </div>
                    <div>
                      <a target="_blank" href={item.twitterLink}>
                        <svg
                          width="30"
                          height="30"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M22.5 5.77249C21.7271 6.10042 20.8978 6.32282 20.0264 6.42212C20.9161 5.91196 21.5972 5.10278 21.92 4.14155C21.0854 4.61398 20.1642 4.95703 19.1826 5.143C18.3966 4.3401 17.2785 3.84 16.0384 3.84C13.6593 3.84 11.7303 5.68706 11.7303 7.96385C11.7303 8.28676 11.7683 8.60214 11.8418 8.90373C8.26201 8.73156 5.08768 7.08932 2.96314 4.59388C2.59176 5.20204 2.38049 5.91068 2.38049 6.66712C2.38049 8.0983 3.14161 9.36108 4.2964 10.0999C3.5904 10.0773 2.92639 9.89131 2.34508 9.5822V9.63372C2.34508 11.6316 3.83056 13.2989 5.80024 13.6784C5.43936 13.7714 5.05882 13.8229 4.66514 13.8229C4.38696 13.8229 4.11794 13.7965 3.85417 13.7463C4.40267 15.386 5.99315 16.5784 7.87756 16.6111C6.40388 17.7169 4.54573 18.374 2.52749 18.374C2.17976 18.374 1.83724 18.3539 1.5 18.3175C3.40671 19.4898 5.67036 20.1733 8.10327 20.1733C16.028 20.1733 20.3597 13.8883 20.3597 8.43757L20.3453 7.90356C21.1917 7.32552 21.9239 6.59927 22.5 5.77249Z"
                            fill="#00acee"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>

                  <div
                    className="modal fade"
                    id={"exampleModalCenter" + pos}
                    tabIndex="-1"
                    role="dialog"
                    aria-labelledby="exampleModalCenterTitle"
                    aria-hidden="true"
                  >
                    <div
                      className="modal-dialog modal-dialog-centered modal-dialog-scrollable"
                      role="document"
                    >
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5
                            className="modal-title"
                            id="exampleModalCenterTitle"
                          >
                            Comments
                          </h5>
                          <button
                            type="button"
                            className="close"
                            data-dismiss="modal"
                            aria-label="Close"
                          >
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div className="modal-body">
                          {item.comments.length === 0 ? (
                            <p>Add comments</p>
                          ) : (
                            item.comments.map((record, pos) => {
                              return (
                                <div key={pos} className="comment-wrapper">
                                  <p>
                                    <b>{record.postedBy.name}</b>{" "}
                                    <span>{record.text}</span>
                                  </p>
                                  {record.postedBy._id === state._id ? (
                                    <div>
                                      <svg
                                        onClick={() =>
                                          deleteComment(item._id, record._id)
                                        }
                                        width="16"
                                        height="18"
                                        viewBox="0 0 20 22"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          clipRule="evenodd"
                                          d="M0 5C0 4.44772 0.447715 4 1 4H19C19.5523 4 20 4.44772 20 5C20 5.55228 19.5523 6 19 6H1C0.447715 6 0 5.55228 0 5Z"
                                          fill="#263145"
                                        />
                                        <path
                                          fillRule="evenodd"
                                          clipRule="evenodd"
                                          d="M8 2C7.73478 2 7.48043 2.10536 7.29289 2.29289C7.10536 2.48043 7 2.73478 7 3V4H13V3C13 2.73478 12.8946 2.48043 12.7071 2.29289C12.5196 2.10536 12.2652 2 12 2H8ZM15 4V3C15 2.20435 14.6839 1.44129 14.1213 0.87868C13.5587 0.31607 12.7956 0 12 0H8C7.20435 0 6.44129 0.31607 5.87868 0.87868C5.31607 1.44129 5 2.20435 5 3V4H3C2.44772 4 2 4.44772 2 5V19C2 19.7957 2.31607 20.5587 2.87868 21.1213C3.44129 21.6839 4.20435 22 5 22H15C15.7957 22 16.5587 21.6839 17.1213 21.1213C17.6839 20.5587 18 19.7957 18 19V5C18 4.44772 17.5523 4 17 4H15ZM4 6V19C4 19.2652 4.10536 19.5196 4.29289 19.7071C4.48043 19.8946 4.73478 20 5 20H15C15.2652 20 15.5196 19.8946 15.7071 19.7071C15.8946 19.5196 16 19.2652 16 19V6H4Z"
                                          fill="#263145"
                                        />
                                        <path
                                          fillRule="evenodd"
                                          clipRule="evenodd"
                                          d="M8 9C8.55228 9 9 9.44771 9 10V16C9 16.5523 8.55228 17 8 17C7.44772 17 7 16.5523 7 16V10C7 9.44771 7.44772 9 8 9Z"
                                          fill="#263145"
                                        />
                                        <path
                                          fillRule="evenodd"
                                          clipRule="evenodd"
                                          d="M12 9C12.5523 9 13 9.44771 13 10V16C13 16.5523 12.5523 17 12 17C11.4477 17 11 16.5523 11 16V10C11 9.44771 11.4477 9 12 9Z"
                                          fill="#263145"
                                        />
                                      </svg>
                                    </div>
                                  ) : null}
                                </div>
                              );
                            })
                          )}
                        </div>
                        <div className="modal-footer">
                          <form
                            className="comment-form"
                            onSubmit={(e) => {
                              e.preventDefault();
                              makeComment(e.target[0].value, item._id);
                              e.target[0].value = "";
                            }}
                          >
                            <input
                              name="comment"
                              type="text"
                              className="form-control shadow-none"
                              id="comment"
                              placeholder="Add a comment"
                            />
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
