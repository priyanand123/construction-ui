import React, {
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { routePath as RP } from "../../routes/routepath";
import { roleNames } from "../../constants/roleNames";

const SideNavBar = ({ showLabelledMenu }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showFullMenu, setshowFullMenu] = useState(showLabelledMenu);
  const navigate = useNavigate();
  const userType = localStorage.getItem("roleName");

  const authenticate = (routeName) => {
    const getUser = JSON.parse(localStorage.getItem("user"));
    if (getUser) {
      navigate(routeName);
    } else {
      navigate("/");
    }
  };

  function useOutsideAlerter(ref) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setShowMenu(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  useEffect(() => {
    setshowFullMenu(showLabelledMenu);
  }, [showLabelledMenu]);

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);

  const onNavigate = (ref, pageTitle) => {
    navigate(ref);
  };

  const menuItems = useMemo(
    () => [
      {
        title: "Dashboard",
        icon: "bx bx-home-circle",
        route: RP.dashboard,

      },
      {
        title: "Purchase",
        icon: "bx bx-cart",
        route: RP.purchase,
        nonAuth: [],
      },
      {
        title: "Users",
        icon: "bx bxs-user",
        route: RP.user,
        nonAuth: [roleNames.user],
      },
      {
        title: "Raw Material",
        icon: "bx bx-box",
        route: RP.rawmaterial,
        nonAuth: [roleNames.user],
      },
      {
        title: "Units",
        icon: "bx bx-cabinet",
        route: RP.units,
        nonAuth: [roleNames.user],
      },
      {
        title: "Machine Logs",
        icon: "bx bx-book-content",
        route: RP.machinelog,


      },
      {
        title: "Material History",
        icon: "bx bx-history",
        route: RP.materialhistory,

      },
      {
        title: "Stock",
        icon: "bx bx-package",
        route: RP.stock,


      },

      {
        title: "Delivery Challan",
        icon: "bx bx-wallet",
        route: RP.deliverychalen,


      },
      {
        title: "Billing",
        icon: "bx bx-receipt",
        route: RP.billing,


      },
      {
        title: "Transport Details",
        icon: "bx bx-bus",
        route: RP.transport,


      },
    ],
    []
  );

  useEffect(() => {
    const words = window.location.pathname?.split("/");
    const currentPage = words[words.length - 1];
    let pageTitle = "";
    for (let i = 0; i < menuItems.length; i++) {
      const menu = menuItems[i];
      if (!!menu?.subMenu) {
        menu.subMenu.forEach((i) => {
          const matched = i.route.includes(currentPage);
          if (matched) {
            pageTitle = i.title;
          }
        });
      }
      if (!menu?.subMenu) {
        const _matched = menu.route.includes(currentPage);
        if (_matched) {
          pageTitle = menu.title;
        }
      }
    }
    document.title = "BrikingSolution : " + pageTitle;
  }, [window.location.pathname]);

  const LabelMenuItem = memo(({ title, icon, subMenu, route }) => {
    let isActive = false;
    if (!route && !!subMenu) {
      isActive = subMenu?.find(
        (menu) => menu?.route === window?.location?.pathname?.split(`/`).pop()
      );
    } else if (!!route) {
      isActive = route === window?.location?.pathname?.split(`/`).pop();
    }
    const [showSubMenu, setshowSubMenu] = useState(!!isActive);

    return (
      <LabelMenuItemOpt>
        <div
          className={"d-flex align-items-center menu_item"}
          onClick={() => {
            setshowSubMenu(!showSubMenu);
            !!route && onNavigate(route);
          }}
        >
          <i className={`${icon} px-3 ${isActive && "text-light"}`}></i>
          <div className="d-flex flex-grow-1">
            <p
              className={`p-0 m-0 menu_title ${isActive && "text-light"}`}
              style={{ fontFamily: "GT-Walsheim" }}
            >
              {title}
            </p>
          </div>
        </div>
      </LabelMenuItemOpt>
    );
  });

  const IconMenuItem = memo(({ title, icon, route, index }) => {
    const [showSubMenu, setshowSubMenu] = useState(false);
    let isActive;
    const navigate = useNavigate();

    if (!!route) {
      isActive = window?.location?.pathname?.includes(route);
    }

    const onNavigate = (route) => {
      navigate(route);
    };

    return (
      <IconMenuItemOpt>
        <div
          className={`d-flex menu_item overflow-visible py-3 position-relative ${index > 9 ? "align-items-end " : "align-items-start"
            }`}
          onClick={() => {
            setshowSubMenu(!showSubMenu);
            !!route && onNavigate(route);
          }}
        >
          {/* Icon */}
          <i className={`${icon} px-3 ${isActive && "text-light"}`}></i>

          {/* Floating Title - Show on Hover */}
          <div
            className={`floting_opt p-2 ps-5 ${index < 9 ? "top-7" : "bottom-0"
              }`}
          >
            <div className="d-flex flex-grow-1">
              <p
                className="p-0 m-0 menu_title"
                style={{ fontFamily: "GT-Walsheim" }}
              >
                {title}
              </p>
            </div>
          </div>
        </div>
      </IconMenuItemOpt>
    );
  });

  return (
    <SideBarContainer className={`${showFullMenu ? "fullMenu" : "iconMenu"}`}>
      <div id="sidebar_menu" className="overflow-visible">
        {showFullMenu && (
          <ul className="list-unstyled p-2 pe-3  web_view_menu" id="">
            {menuItems.map((item, index) => {
              if (item?.nonAuth?.includes(userType)) return;
              return (
                <LabelMenuItem
                  key={index}
                  {...item}
                  onClick={() => item?.onClick()}
                />
              );
            })}
          </ul>
        )}
        {!showFullMenu && (
          <ul
            className="list-unstyled p-2 pe-3 overflow-visible mob_view_menu"
            id=""
          >
            {menuItems.map((item, index) => {
              if (item?.nonAuth?.includes(userType)) return;
              return (
                <IconMenuItem
                  key={index}
                  {...item}
                  index={index}
                  onClick={() => item?.onClick()}
                />
              );
            })}
          </ul>
        )}
      </div>
    </SideBarContainer>
  );
};

export default SideNavBar;

/* ------------------------------------ */
/*  Updated Styling Starts Here         */
/* ------------------------------------ */

/* Updated: No horizontal scroll, and hover title display correctly */
const SideBarContainer = styled.div`
  background-color: #2a3042;
  overflow-x: visible; /* Ensure overflow-x is visible */
  
  p,
  a {
    font-family: "GT-Walsheim";
  }

  .fullMenu {
    overflow-y: auto;
    min-width: 30vmin;
  }

  /* Highlighted Change: Ensure overflow-x is visible */
  .iconMenu {
    overflow-x: visible; /* Highlighted Change */
  }

  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none;
  }

  .web_view_menu {
    height: 100%;
    overflow: auto;
    min-width: 250px;
  }

  .web_view_menu::-webkit-scrollbar {
    display: none;
  }

  .mob_view_menu {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    overflow: auto;
  }

  @media (max-width: 770px) {
    .mob_view_menu {
      display: none;
    }
    .web_view_menu {
      position: absolute;
      background-color: #2a3042;
      z-index: 200;
    }
  }
`;

const LabelMenuItemOpt = styled.li`
  cursor: pointer;
  padding: 0.75rem 0px;
  .menu_item:hover {
    i,
    .menu_title {
      color: #fff;
    }
  }
  i {
    font-size: 1.25rem;
    color: #6a7187;
  }
  .menu_title {
    font-size: 14px;
    color: #6a7187;
  }
`;

const IconMenuItemOpt = styled.li`
  cursor: pointer;
  position: relative;
  overflow: visible;

  /* Highlighted Change: Hover Effect - Show Icon and Title */
  .menu_item:hover {
    i,
    .menu_title {
      color: #fff;
    }
    .floting_opt {
      display: block; /* Display the floating title */
    }
  }

  i {
    font-size: 1.25rem;
    color: #6a7187;
  }

  .floting_opt {
  display: none; /* Hidden by default */
  position: absolute;
  left: 100%; /* Position to the right of the icon */
  top: 50%; /* Center vertically */
  transform: translateY(-50%);
  z-index: 200;
  background-color: #2a3042;
  min-width: 120px;
  padding: 8px;
  white-space: nowrap;
}

  .menu_title {
    font-size: 14px;
    color: #fff; /* Ensure text is white */
  }
`;
