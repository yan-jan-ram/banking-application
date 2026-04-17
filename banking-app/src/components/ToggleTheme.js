import React, { useEffect } from "react";
import { toggleTheme } from "../features/themeSlice";
import { useSelector, useDispatch } from "react-redux";
import style from "./toggleTheme.module.css";

const ToggleTheme = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.mode);

  const handleToggle = () => {
    dispatch(toggleTheme());
  };

  useEffect(() => {
    document.body.classList.toggle("dark-mode", theme === "dark");
  }, [theme]);

  return (
    <button onClick={handleToggle} className={style.toggleButton}>
      {theme === "light" ? "switch to dark-mode" : "switch to light-mode"}
    </button>
  );
};

export default ToggleTheme;
