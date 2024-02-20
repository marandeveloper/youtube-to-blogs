"use client";

import { FormEvent, useRef, useState } from "react";
import { BsStars } from "react-icons/bs";
import { IoCopy } from "react-icons/io5";
import Markdown from "react-markdown";

export default function Home() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [gpt, setGpt] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [err, setErr] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const submitUrl = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const id = inputRef.current?.value;
      const res = await fetch(`/api/gpt?video_id=${id}`);
      const data = await res.json();
      if (!data.success) {
        setErr(data?.message);
        setLoading(false);
      }

      const { gpt, original } = data.blog;
      setGpt(gpt);
      setText(original);
      setLoading(false);
    } catch (error) {
      setErr("Error");
      setLoading(false);
    }
  };

  const copyClipBoard = (value: string) => {
    navigator.clipboard.writeText(value);
    alert("Blog copied");
  };

  return (
    <main className="m-auto w-full max-w-[900px] px-5 pb-2">
      <div
        id="header"
        className="flex w-full flex-col items-center justify-center gap-4 py-5 text-center"
      >
        <h1 className="font-[Circular] text-4xl font-[800]">
          VideoVista Hub: Explore Limitless Visual Wonders!
        </h1>
        <p className="text-sm font-[450] text-[#B0B0B0]">
          Dive into a tapestry of captivating YouTube videos curated for you.
          Subscribe for a visual journey like never before!
        </p>
        <form
          id="inputBox"
          onSubmit={submitUrl}
          className="flex items-center gap-4 rounded-lg border-[1px] border-gray-400 bg-[#262626] px-3 py-[6px]"
        >
          <input
            className="border-none bg-transparent text-xl text-[#fff] outline-none placeholder:text-[#757575] "
            ref={inputRef}
            placeholder="Enter youtube id...."
            type="text"
          />
          <button
            disabled={loading}
            className="box-border flex items-center gap-3 rounded-lg bg-[#9C75FF] p-2 text-sm"
          >
            <BsStars />
            <span>Generate</span>
          </button>
        </form>
      </div>
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-t-4 border-solid border-blue-500 border-opacity-25"></div>
        </div>
      ) : err ? (
        <h1 className="text-center font-[700] text-red-600">{err}</h1>
      ) : (
        <>
          <div className="flex justify-between py-4">
            <button
              className="flex h-[34px] items-center gap-2 rounded-md bg-[#9C75FF] px-2 text-sm text-white "
              onClick={() => copyClipBoard(text)}
            >
              <IoCopy />
              <span>Markdown</span>
            </button>
            <button
              className="flex h-[34px] items-center gap-2 rounded-md bg-[#9C75FF] px-2 text-sm text-white "
              onClick={() => copyClipBoard(gpt)}
            >
              <IoCopy />
              HTML
            </button>
          </div>
          <Markdown>{text}</Markdown>
        </>
      )}
    </main>
  );
}
