import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../App";

function Search() {
  const { state, dispatch } = useContext(UserContext);

  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [NoResult, setNoResultFound] = useState(false);

  const fetchUser = (query) => {
    setSearch(query);
    if (query !== "") {
      fetch("/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          setSearchResult(result.user);
          if (result.user.length === 0) {
            setNoResultFound(true);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setSearchResult([]);
      setNoResultFound(false);
    }
  };
  return (
    <div className="search-wrapper">
      <div className="form card">
        <input
          className="form-control shadow-none"
          type="text"
          placeholder="Search user"
          aria-label="Search"
          value={search}
          onChange={(e) => {
            e.preventDefault();
            fetchUser(e.target.value);
          }}
        />

        <ul className="search-container">
          {NoResult ? (
            <p className="text">User Not Found</p>
          ) : (
            searchResult.map((item, pos) => {
              return (
                <li key={pos}>
                  <div className="user-card">
                    <img className="user-icon" src={item.profileImage} alt="" />
                    <p className="user-name">
                      <Link
                        to={
                          item._id !== state._id
                            ? `/profile/${item._id}`
                            : "/profile"
                        }
                      >
                        {item.name}
                      </Link>
                    </p>
                  </div>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}

export default Search;
