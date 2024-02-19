"use client";

import { FormEvent, useRef, useState } from "react";

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
  };

  return (
    <>
      <form
        onSubmit={submitUrl}
        className="m-auto w-full flex flex-col justify-center items-center"
      >
        <h1 className="rext-2xl">Youtube script to medium blog</h1>
        <input
          className="text-black"
          ref={inputRef}
          placeholder="enter url...."
          type="text"
        />
      </form>
      <div className="flex justify-between py-10">
        <button
          className="p-4 bg-black text-white "
          onClick={() => copyClipBoard(text)}
        >
          text
        </button>
        <button
          className="p-4 bg-black text-white "
          onClick={() => copyClipBoard(gpt)}
        >
          Markdown
        </button>
      </div>
      <p>{gpt}</p>
      <p>{err}</p>
      <p>{loading && "Loading"}</p>
    </>
  );
}
