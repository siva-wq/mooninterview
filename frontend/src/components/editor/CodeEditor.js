import { useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import Output from "./Output";

function CodeEditor() {

    // ========================================
    // States
    // ========================================

    const [inputHeight, setInputHeight] = useState(200);

    const [language, setLanguage] = useState("c");

    const [code, setCode] = useState(`#include <stdio.h>

int main() {

    printf("Hello World");

    return 0;
}`);

    const [input, setInput] = useState("");

    const [output, setOutput] = useState(null);

    const [loading, setLoading] = useState(false);



    // ========================================
    // Change Language
    // ========================================

    const ChangeLanguage = (lang) => {

        setLanguage(lang);
        setInput("");
        setOutput(null);

        // JavaScript
        if (lang === "javascript") {

            setCode(`console.log("Hello World");`);
        }

        // Python
        else if (lang === "python") {

            setCode(`print("Hello World")`);
        }

        // Java
        else if (lang === "java") {

            setCode(`public class Main {

    public static void main(String[] args) {

        System.out.println("Hello World");

    }
}`);
        }

        // C++
        else if (lang === "cpp") {

            setCode(`#include <iostream>

using namespace std;

int main() {

    cout << "Hello World" << endl;

    return 0;
}`);
        }

        // C
        else if (lang === "c") {

            setCode(`#include <stdio.h>

int main() {

    printf("Hello World");

    return 0;
}`);
        }
    };



    // ========================================
    // Run Code
    // ========================================

    const runCode = async () => {

        try {

            setLoading(true);

            // Running Message
            setOutput({

                success: true,

                output: "Running..."
            });

            const response = await axios.post(

                "https://mooninterview-compier.onrender.com/run",

                {
                    language,
                    code,
                    input
                }
            );

            console.log(response);

            // Final Output
            setOutput(response.data);

        }

        catch (error) {

            console.log(error);

            setOutput({

                success: false,

                output: "Error running code"
            });
        }

        finally {

            setLoading(false);
        }
    };



    // ========================================
    // UI
    // ========================================

    return (

        <div className="w-full h-screen bg-white text-black flex flex-col">

            {/* ======================================== */}
            {/* Navbar */}
            {/* ======================================== */}

            <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-300 shadow-sm shrink-0">

                {/* Language Selector */}

                <select
                    value={language}
                    onChange={(e) => ChangeLanguage(e.target.value)}
                    className="bg-gray-100 text-black px-4 py-2 rounded-lg outline-none border border-gray-300"
                >

                    <option value="javascript">
                        JavaScript
                    </option>

                    <option value="python">
                        Python
                    </option>

                    <option value="java">
                        Java
                    </option>

                    <option value="cpp">
                        C++
                    </option>

                    <option value="c">
                        C
                    </option>

                </select>



                {/* Run Button */}

                <button
                    onClick={runCode}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-semibold"
                >

                    {
                        loading
                            ? "Running..."
                            : "Run Code"
                    }

                </button>

            </div>



            {/* ======================================== */}
            {/* Main Layout */}
            {/* ======================================== */}

            <div className="flex flex-1 overflow-hidden min-h-0">

                {/* ======================================== */}
                {/* LEFT SIDE */}
                {/* ======================================== */}

                <div className="w-1/2 flex flex-col min-h-0 border-r border-gray-300 bg-white">

                    {/* Monaco Editor */}

                    <div className="flex-1 min-h-0">

                        <Editor
                            height="100%"
                            language={language}
                            value={code}
                            theme="vs-light"

                            onChange={(value) =>
                                setCode(value || "")
                            }

                            options={{

                                fontSize: 15,

                                minimap: {
                                    enabled: false
                                },

                                automaticLayout: true,

                                scrollBeyondLastLine: false,

                                wordWrap: "on",

                                padding: {
                                    top: 15
                                },

                                fontFamily: "Consolas",

                                cursorSmoothCaretAnimation: "on",

                                smoothScrolling: true
                            }}
                        />

                    </div>



                    {/* ======================================== */}
                    {/* Input Section */}
                    {/* ======================================== */}

                    <div
                        style={{
                            height: `${inputHeight}px`
                        }}
                        className="
                            bg-white
                            border-t
                            border-gray-300
                            transition-all
                            duration-300
                            overflow-hidden
                            flex
                            flex-col
                            shrink-0
                        "
                    >

                        {/* Header */}

                        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-300 bg-gray-100 shrink-0">

                            <h2 className="text-black text-lg font-semibold">
                                Input
                            </h2>



                            {/* Buttons */}

                            <div className="flex items-center gap-2">

                                {/* Expand */}

                                <button
                                    onClick={() =>
                                        setInputHeight(500)
                                    }
                                    className="
                                        bg-gray-200
                                        hover:bg-gray-300
                                        px-3
                                        py-1
                                        rounded
                                        text-sm
                                        text-black
                                    "
                                >
                                    ▲
                                </button>



                                {/* Minimize */}

                                <button
                                    onClick={() =>
                                        setInputHeight(140)
                                    }
                                    className="
                                        bg-gray-200
                                        hover:bg-gray-300
                                        px-3
                                        py-1
                                        rounded
                                        text-sm
                                        text-black
                                    "
                                >
                                    ▼
                                </button>

                            </div>

                        </div>



                        {/* Textarea */}

                        <div className="flex-1 p-4 min-h-0">

                            <textarea
                                value={input}
                                onChange={(e) =>
                                    setInput(e.target.value)
                                }
                                placeholder="Enter input here..."
                                className="
                                    w-full
                                    h-full
                                    bg-gray-50
                                    text-black
                                    p-3
                                    rounded-lg
                                    border
                                    border-gray-300
                                    outline-none
                                    resize-none
                                "
                            />

                        </div>

                    </div>

                </div>



                {/* ======================================== */}
                {/* RIGHT SIDE */}
                {/* ======================================== */}

                <div className="w-1/2 h-full min-h-0 bg-white">

                    <Output data={output} />

                </div>

            </div>

        </div>
    );
}

export default CodeEditor;