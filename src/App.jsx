import React, { useState } from 'react'
import "./App.css"
import Navbar from './components/Navbar'
import Editor from '@monaco-editor/react';
import Select from 'react-select';
import Markdown from 'react-markdown'
import RingLoader from "react-spinners/RingLoader";

const App = () => {
  const options = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'csharp', label: 'C#' },
    { value: 'cpp', label: 'C++' },
    { value: 'php', label: 'PHP' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'go', label: 'Go' },
    { value: 'swift', label: 'Swift' },
    { value: 'kotlin', label: 'Kotlin' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'rust', label: 'Rust' },
    { value: 'dart', label: 'Dart' },
    { value: 'scala', label: 'Scala' },
    { value: 'perl', label: 'Perl' },
    { value: 'haskell', label: 'Haskell' },
    { value: 'elixir', label: 'Elixir' },
    { value: 'r', label: 'R' },
    { value: 'matlab', label: 'MATLAB' },
    { value: 'bash', label: 'Bash' }
  ];

  const [selectedOption, setSelectedOption] = useState(options[0]);

  const customStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: '#000',
    border: '1px solid white',
    color: 'white',
    width: '100%',
    boxShadow: 'none',
    minHeight: '42px',
  }),

  menu: (provided) => ({
    ...provided,
    backgroundColor: '#000',
    border: '1px solid white',
    color: 'white',
  }),

  singleValue: (provided) => ({
    ...provided,
    color: 'white',
  }),

  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? '#111' : '#000',
    color: 'white',
    cursor: 'pointer',
  }),

  input: (provided) => ({
    ...provided,
    color: 'white',
  }),

  placeholder: (provided) => ({
    ...provided,
    color: '#aaa',
  }),
};

  const [code, setCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  async function reviewCode() {
    try {
      setResponse("")
      setLoading(true);

      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Authorization": "Bearer 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",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "openrouter/free",
            messages: [
              {
                role: "user",
                content: `You are an expert-level software developer, skilled in writing efficient, clean, and advanced code.
I’m sharing a piece of code written in ${selectedOption.value}.
Your job is to deeply review this code and provide the following:

1️⃣ A quality rating: Better, Good, Normal, or Bad.
2️⃣ Detailed suggestions for improvement, including best practices and advanced alternatives.
3️⃣ A clear explanation of what the code does, step by step.
4️⃣ A list of any potential bugs or logical errors, if found.
5️⃣ Identification of syntax errors or runtime errors, if present.
6️⃣ Solutions and recommendations on how to fix each identified issue.

Analyze it like a senior developer reviewing a pull request.

Code: ${code}`
              }
            ]
          })
        }
      );

      const data = await response.json();

      if (data.error) {
        setResponse(`❌ ${data.error.message}`);
      } else {
        setResponse(data.choices[0].message.content);
      }
      setLoading(false);

    } catch (error) {
      console.log(error);
      setResponse("❌ Error reviewing code");
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />

      <div className="main flex justify-between" style={{ height: "calc(100vh - 90px)" }}>

        <div className="left h-[87.5%] w-[50%]">
          <div className="tabs !mt-5 !px-5 !mb-3 w-full flex items-center gap-[10px]">

            <Select
              value={selectedOption}
              onChange={(e) => { setSelectedOption(e) }}
              options={options}
              styles={customStyles}
            />

            {/* <button className="btnNormal bg-zinc-900 min-w-[120px] transition-all hover:bg-zinc-800">
              Fix Code
            </button> */}

            <button
              onClick={() => {
                if (code === "") {
                  alert("Please enter code first")
                }
                else {
                  reviewCode()
                }
              }}
              className="btnNormal bg-zinc-900 min-w-[120px] transition-all hover:bg-zinc-800"
            >
              Review
            </button>

          </div>

          <Editor
            height="100%"
            theme='vs-dark'
            language={selectedOption.value}
            value={code}
            onChange={(e) => { setCode(e) }}
          />
        </div>

        <div className="right overflow-scroll !p-[10px] bg-zinc-900 w-[50%] h-[101%]">

          <div className="topTab border-b-[1px] border-t-[1px] border-[#27272a] flex items-center justif-between h-[60px]">
            <p className='font-[700] text-[17px]'>Response</p>
          </div>

          {loading && <RingLoader color='#9333ea' />}

          <Markdown>{response}</Markdown>

        </div>

      </div>
    </>
  )
}

export default App