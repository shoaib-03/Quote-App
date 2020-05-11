import React, { useRef, useState, useEffect, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import {
  ToastsContainer,
  ToastsStore,
  ToastsContainerPosition,
} from "react-toasts";
import { UserContext } from "../App";

function Signup() {
  const { state, dispatch } = useContext(UserContext);

  const [userName, setName] = useState("");
  const [userEmail, setEmail] = useState("");
  const [userPass1, setPass1] = useState("");
  const [userPass2, setPass2] = useState("");

  const [passNotMatchErr, setPassNotMatchErr] = useState(false);

  const [overlay, setOverlay] = useState(false);
  const [profileImage, setProfileImage] = useState(undefined);
  const [displayImgStyle, setDisplayImgStyle] = useState("none");
  const [localURL, setLocalURL] = useState("");
  const [cloudURL, setCloudURL] = useState(undefined);

  const history = useHistory();
  let fileInput = useRef(null);
  let imgPreviewText = useRef(null);

  if (state) {
    history.push("/");
  }

  useEffect(() => {
    if (cloudURL) {
      uploadFeilds();
    }
  }, [cloudURL]);

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
        setCloudURL(result.url);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const uploadFeilds = () => {
    fetch("/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: userName,
        email: userEmail,
        password: userPass1,
        profileImage: cloudURL,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          ToastsStore.error(data.error);
          setOverlay(false);
        } else {
          ToastsStore.success(data.message);
          history.push("/signin");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onSubmit = () => {
    if (userPass1 !== userPass2) {
      setPassNotMatchErr(true);
    } else {
      setPassNotMatchErr(false);

      setOverlay(true);
      if (profileImage) {
        uploadImageToCloud();
      } else {
        uploadFeilds();
      }
    }
  };

  const fileSelectedHandler = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);

    if (file) {
      const reader = new FileReader();
      imgPreviewText.style.display = "none";

      reader.readAsDataURL(file);

      reader.addEventListener("load", () => {
        let result = reader.result;
        setLocalURL(result);
        setDisplayImgStyle("block");
      });
    }
  };

  return (
    <div className="wrapper">
      <div className="container signup-wrapper">
        <div className="card">
          <div className="card-header">Create Account</div>
          <div className="card-body">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
              }}
            >
              <div className="form-group profile-img-wrapper">
                <div className="img-preview-wrapper">
                  <span
                    className="img-preview-text"
                    ref={(el) => {
                      imgPreviewText = el;
                    }}
                  >
                    Image Preview
                  </span>
                  <img
                    className="img"
                    src={localURL}
                    alt="Image Preview"
                    style={{ display: displayImgStyle }}
                  />
                </div>

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
                  className="btn btn-primary"
                >
                  Add Profile Image
                </button>
              </div>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  name="name"
                  type="text"
                  className="form-control shadow-none"
                  id="name"
                  required
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input
                  name="email"
                  type="email"
                  className="form-control shadow-none"
                  id="email"
                  required
                  aria-describedby="emailHelp"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password1">Password</label>
                <input
                  name="password1"
                  type="password"
                  required
                  className="form-control shadow-none"
                  id="password1"
                  onChange={(e) => setPass1(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password2">Confirm Password</label>
                <input
                  name="password2"
                  type="password"
                  className="form-control shadow-none"
                  id="password2"
                  required
                  onChange={(e) => setPass2(e.target.value)}
                />

                {passNotMatchErr && (
                  <div className="alert alert-danger " role="alert">
                    Password not matched
                  </div>
                )}
              </div>
              <button type="submit" className="btn btn-primary btn-block">
                Sign Up
              </button>
            </form>
          </div>
          <p>
            Have an account? <Link to="/signin">Sign in</Link>
          </p>
        </div>
      </div>

      {overlay ? (
        <div className="overlay">
          <div className="spinner-border text-light spiner" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : null}

      <ToastsContainer
        store={ToastsStore}
        position={ToastsContainerPosition.TOP_CENTER}
        lightBackground
      />
    </div>
  );
}

export default Signup;
