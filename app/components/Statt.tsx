"use client"
import { useRef, useState, useEffect } from "react";
import { useChat } from "ai/react";
import clsx from "clsx";
import {
    LoadingCircle,
    SendIcon,
    UserIcon,
} from "../icons";
import Textarea from "react-textarea-autosize";
import { useRouter } from "next/navigation";

const examples = [
    "What is the current status?",
    "When was the report last updated?",
    "Read out the full report.",
    "Make a change to watchlist."
];

function fetchStatt() {
    return (typeof window !== 'undefined' && window.localStorage.getItem("statt_test")) || ""
}

export default function Chat() {
    const formRef = useRef<HTMLFormElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const [statt, setStatt] = useState(fetchStatt())
    const [log, setLog] = useState()
    const router = useRouter()



    async function fetchLog() {
        const res = await fetch("/api/log",{cache: "no-store"})
        const log = await res.json()

        setLog(log.status)
        console.log(log)
    }


    const { messages, input, setInput, handleSubmit, isLoading } = useChat({
        onResponse: (response) => {
            if (response.status === 500) {
                window.alert("Error :(")
            }
            if (response.status === 429) {
                window.alert("You have reached your request limit for the day.");
                return;
            }
        },
        body: {
            content:
                "StattAI is an AI bot that intakes a digital resource status report and provides viable solutions. Today is " + (new Date())
                    .toString() + "\nBEGIN REPORT\n"
                + log + "\nEND REPORT\n"
        },



    });

    useEffect(() => {

        fetchLog()
        setStatt(fetchStatt())

        let elem = (document.getElementById("textarea") as HTMLInputElement)
        if (elem) {
            elem.focus()
            elem.setSelectionRange(elem.value.length, elem.value.length);
        }

    }, [])

    const disabled = isLoading || input.length === 0 || input === "Commit an update to your journal.";

    return (
        <main className="flex flex-col items-center justify-between pb-40">

            {messages.map((message, i) => (
                <div
                    key={i}
                    className={clsx(
                        "flex w-full items-center justify-center border-b border-gray-200 py-8",
                        message.role === "user" ? "bg-white" : "bg-gray-100",
                    )}
                >
                    <div className="flex w-full max-w-screen-md items-start space-x-4 px-5 sm:px-0">
                        <div
                            className={clsx(
                                message.role === "assistant"
                                    ? "bg-white"
                                    : "bg-black p-1.5 text-white",
                            )}
                        >
                            {message.role === "user" ? (
                                <UserIcon />
                            ) : (
                                "StattAI"
                            )}
                        </div>
                        <div className="prose prose-p:leading-relaxed mt-1 w-full break-words">
                            {message.content}
                        </div>
                    </div>
                </div>
            ))
            }
            <div className="border-gray-200sm:mx-0 mx-5 mt-20 max-w-screen-md rounded-md border sm:w-full">

                <div className="flex flex-col space-y-4 border-t border-gray-200 bg-gray-50 p-7 sm:p-10">
                    {examples.map((example, i) => (
                        <button
                            key={i}
                            className="rounded-md border border-gray-200 bg-white px-5 py-3 text-left text-sm text-gray-500 transition-all duration-75 hover:border-black hover:text-gray-700 active:bg-gray-50"
                            onClick={() => {
                                if (example === "Make a change to watchlist.") {
                                    router.push("/edit")
                                }
                                else {

                                    setInput(example);
                                    inputRef.current?.focus();
                                }
                            }}
                        >
                            {example}
                        </button>
                    ))}
                </div>
            </div>

            <div className="fixed bottom-0 flex w-full flex-col items-center space-y-3 bg-gradient-to-b from-transparent via-gray-100 to-gray-100 p-5 pb-3 sm:px-0">

                <form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    className="relative w-full max-w-screen-md rounded-xl border border-gray-200 bg-white px-4 pb-2 pt-3 shadow-lg sm:pb-3 sm:pt-4"
                >
                    <Textarea
                        id="textarea"
                        ref={inputRef}
                        tabIndex={0}
                        required
                        rows={1}
                        maxRows={5}
                        autoFocus
                        placeholder="Send a message, organize journal by dates"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                formRef.current?.requestSubmit();
                                e.preventDefault();
                            }
                        }}
                        spellCheck={false}
                        className="w-full pr-10 focus:outline-none"
                    />
                    <button
                        className={clsx(
                            "absolute inset-y-0 right-3 my-auto flex h-8 w-8 items-center justify-center rounded-md transition-all",
                            disabled
                                ? "cursor-not-allowed bg-white"
                                : "bg-red-500 hover:bg-red-600",
                        )}
                        disabled={disabled}
                    >
                        {isLoading ? (
                            <LoadingCircle />
                        ) : (
                            <SendIcon
                                className={clsx(
                                    "h-4 w-4",
                                    input.length === 0 ? "text-gray-300" : "text-white",
                                )}
                            />
                        )}
                    </button>
                </form>

            </div>

        </main>
    );
}
