import { useAuth } from "../contexts/AuthProvider";
import { NavLink, Outlet } from "react-router-dom";

export default function Root() {
  const { profile, logOut } = useAuth();

  return (
    <>
      <nav
        className="navbar has-shadow"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="navbar-brand">
          {/* <a className="navbar-item is-family-code" href="/animals">
            Paws and Tails
          </a> */}

          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "navbar-item is-family-code active"
                : "navbar-item is-family-code"
            }
          >
            Paws and Tails
          </NavLink>

          <a
            role="button"
            className="navbar-burger"
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarBasicExample"
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div id="navbarBasicExample" className="navbar-menu">
          <div className="navbar-start">
            {/* <a className="navbar-item" href="/animals">
              Find by Animals
            </a>
            <a className="navbar-item" href="/breeders">
              Find by Breeders
            </a> */}
            {/* <% if current_user %>
        <a class="navbar-item" href="/messages/inbox/show">
          Message Inbox
        </a>
      <% end %> */}

            {/* <!--      <div class="navbar-item has-dropdown is-hoverable">-->
      <!--        <a class="navbar-link">-->
      <!--          More-->
      <!--        </a>-->

      <!--        <div class="navbar-dropdown">-->
      <!--          <a class="navbar-item">-->
      <!--            About-->
      <!--          </a>-->
      <!--          <a class="navbar-item">-->
      <!--            Jobs-->
      <!--          </a>-->
      <!--          <a class="navbar-item">-->
      <!--            Contact-->
      <!--          </a>-->
      <!--          <hr class="navbar-divider">-->
      <!--          <a class="navbar-item">-->
      <!--            Report an issue-->
      <!--          </a>-->
      <!--        </div>-->
      <!--      </div>--> */}
          </div>

          <div className="navbar-end">
            <div className="navbar-item">
              <div className="buttons">
                {profile ? (
                  <>
                    <NavLink
                      to="/profile"
                      className="button is-warning is-light"
                    >
                      My Profile
                    </NavLink>
                    <button onClick={logOut} className="button is-light">
                      Log Out
                    </button>
                  </>
                ) : (
                  <>
                    <NavLink to="/login" className="button is-light">
                      Log In
                    </NavLink>
                  </>
                )}
                {/* <% if current_user %>
                <%= link_to "My Profile", user_path(current_user.id), class: "button is-warning is-light" %>
                <%= link_to "Log Out", logout_path, class: "button is-light" %>
              <% else %>
                <%= link_to "Sign Up", signup_path, class: "button is-warning is-light" %>
                <%= link_to "Log In", login_path, class: "button is-light" %>
              <% end %> */}
              </div>
            </div>
          </div>
        </div>
      </nav>
      <section className="section">
        <div className="container">
          <Outlet />
        </div>
      </section>
    </>
  );
}
