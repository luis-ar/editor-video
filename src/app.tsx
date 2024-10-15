import { useEffect } from "react";
import Editor from "./pages/editor";
import useDataState from "./store/use-data-state";
import { getCompactFontData } from "./pages/editor/utils/fonts";
import { FONTS } from "./data/fonts";

export default function App() {
  const { setCompactFonts, setFonts } = useDataState();

  useEffect(() => {
    setCompactFonts(getCompactFontData(FONTS));
    setFonts(FONTS);
  }, []);

  return <Editor />;
}
