import React, { useContext, useEffect, useState } from "react";
import { FaHtml5 } from "react-icons/fa";
import { FaCss3Alt } from "react-icons/fa";
import { IoIosSettings } from "react-icons/io";
import { FaChevronDown } from "react-icons/fa";
import { DiJavascript } from "react-icons/di";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { html as HTML } from "@codemirror/lang-html";
import { css as CSS } from "@codemirror/lang-css";
import { color } from "@uiw/codemirror-extensions-color";
import { HiChevronDoubleDown } from "react-icons/hi";
import NewProjectHeader from "../components/headers/newProjectHeader/NewProjectHeader";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import Split from "react-split";
import { LuExpand } from "react-icons/lu";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase.config";
import { toast } from "react-toastify";
import ConsoleOutput from "../components/output/ConsoleOutput";
const NewProject = ({ data, owner }) => {
  const [hideOutput, setHideOutput] = useState(false);
  const [hideConsoleOutput, setHideConsoleOutput] = useState(true);
  const user = useSelector((state) => state.user.user);
  const [sameOwner, setSameOwner] = useState(
    user?.uid == owner?.uid.stringValue
  );
  const [title, setTitle] = useState(data?.title?.stringValue || "Untitled");
  const [js, setJs] = useState(
    data?.js?.stringValue ? data?.js?.stringValue : `console.log("hey")`
  );
  const [result, setResult] = useState(data?.result?.stringValue || "");
  const [html, setHtml] = useState(
    data?.html?.stringValue ? data.html.stringValue : ""
  );
  const [css, setCss] = useState(
    data?.css?.stringValue
      ? data?.css?.stringValue
      : `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
  `
  );
  useEffect(() => {
    window.location.href.includes("newProject") && setSameOwner(true);
  });

  useEffect(() => {
    const combinedOutput = `
    <html>
    <head>
    </head>
    <style>
    ${css}
    </style>
    <body>
    ${html}
    <script>${js}</script>
    </body>
    </html>`;
    setResult(combinedOutput);
  }, [html, css, js]);

  const handleSave = async () => {
    const id = `${Date.now()}`;
    const _doc = {
      id,
      title,
      html,
      css,
      js,
      result,
      owner: user,
    };
    const temp = await addDoc(collection(db, "Projects"), _doc)
      .then((res) => {
        toast.success("Project Saved Successfully.", { autoClose: 1500 });
      })
      .catch((err) => console.log(err));
    console.log(temp);
  };
  const updateProject = async () => {
    const id = data?.id?.stringValue;
    const _updatedDoc = {
      title,
      html,
      css,
      js,
      result,
    };
    try {
      console.log(id);
      const q = query(collection(db, "Projects"), where("id", "==", id));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (d) => {
        const projectRef = doc(db, "Projects", d.id);
        await updateDoc(projectRef, { ..._updatedDoc }).then((_) => {
          toast.success("Project Updated Successfully!", { autoClose: 1500 });
        });
      });
    } catch (error) {
      console.error("Error updating documents: ", error);
    }
  };
  return (
    <>
      <div
        className="text-white w-full h-full
      flex flex-col items-start justify-start overflow-hidden"
      >
        <NewProjectHeader
          title={title}
          setTitle={setTitle}
          user={user}
          owner={owner}
          handleSave={handleSave}
          updateProject={updateProject}
          sameOwner={sameOwner}
        />

        <Split className="w-full  h-full flex flex-col " direction="vertical">
          <Split className="split  h-full w-[100vw] flex-1 " minSize={300}>
            <div className="h-full w-full px-[5px] flex flex-col ">
              <div className="w-full flex items-center justify-between ">
                <div className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-sm border-t-2 border-gray-200">
                  <FaHtml5 className="text-red-400" />
                  <p className="text-[13px]">HTML</p>
                </div>
                <div className="flex  gap-2 items-center justify-center py-1 border-[.1px] rounded-sm px-1 bg-secondary cursor-pointer">
                  <LuExpand />
                  <IoIosSettings />
                  <FaChevronDown />
                </div>
              </div>
              <div className="w-full relative flex-1">
                <CodeMirror
                  extensions={[HTML({ matchClosingTags: true })]}
                  theme={"dark"}
                  editable={sameOwner}
                  height="100%"
                  style={{ scrollbarColor: "green" }}
                  className="absolute top-0 left-0 w-[100%] h-[100%] bg-black"
                  onChange={(value, viewUpdate) => {
                    setHtml(value);
                  }}
                  value={html}
                />
              </div>
            </div>
            <div className="h-full w-full px-[5px] flex flex-col">
              <div className="w-full flex items-center justify-between ">
                <div className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-sm border-t-2 border-gray-200">
                  <FaCss3Alt className="text-blue-400" />
                  <p className="text-[13px]">CSS</p>
                </div>
                <div className="flex  gap-2 items-center justify-center py-1 border-[.1px] rounded-sm px-1 bg-secondary cursor-pointer">
                  <LuExpand />
                  <IoIosSettings />
                  <FaChevronDown />
                </div>
              </div>
              <div className="w-full relative flex-1">
                <CodeMirror
                  extensions={[CSS(), color]}
                  theme={"dark"}
                  editable={sameOwner}
                  height="100%"
                  style={{ scrollbarColor: "green" }}
                  className="absolute top-0 left-0 w-[100%] h-[100%] bg-black"
                  onChange={(value, viewUpdate) => {
                    setCss(value);
                  }}
                  value={css}
                />
              </div>
            </div>
            <div className="h-full w-full px-[5px] flex flex-col">
              <div className="w-full flex items-center justify-between ">
                <div className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-sm border-t-2 border-gray-200">
                  <DiJavascript className="text-yellow-400 " />
                  <p className="text-[13px]">JS</p>
                </div>
                <div className="flex  gap-2 items-center justify-center py-1 border-[.1px] rounded-sm px-1 bg-secondary cursor-pointer">
                  <LuExpand />
                  <IoIosSettings />
                  <FaChevronDown />
                </div>
              </div>
              <div className="w-full relative flex-1">
                <CodeMirror
                  extensions={[javascript({ snippets: true })]}
                  theme={"dark"}
                  editable={sameOwner}
                  height="100%"
                  style={{ scrollbarColor: "green" }}
                  className="absolute top-0 left-0 w-[100%] h-[100%] bg-black"
                  onChange={(value, viewUpdate) => {
                    setJs(value);
                  }}
                  placeholder={"//hello"}
                  value={js}
                />
              </div>
            </div>
          </Split>
          <div
            className={` ${
              hideOutput ? `max-h-[0px]` : `max-h-full`
            } h-full w-full relative  duration-200 `}
          >
            <motion.div
              whileTap={{ scale: 0.9 }}
              className={`absolute text-white right-0 ${
                hideOutput ? `bottom-[100%]` : `top-0`
              } bg-emerald-400 cursor-pointer p-2 rounded-lg text-xl
                max-w-fit duration-200 `}
              onClick={() => setHideOutput(!hideOutput)}
            >
              <HiChevronDoubleDown
                className={`duration-300 ${
                  hideOutput && "rotate-180"
                } duration-150 text-primary`}
              />
            </motion.div>

            <div className={`min-h-full max-h-full w-full flex`}>
              <motion.div
                className={` min-h-full w-full bg-white  text-black duration-150 flex-1 `}
              >
                <iframe srcDoc={result} className="h-full w-full" />
              </motion.div>
            </div>
          </div>
        </Split>
      </div>
    </>
  );
};

export default NewProject;
{
}
