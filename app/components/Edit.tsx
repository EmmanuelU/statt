"use client"
import { useRef, useState, useEffect } from "react";
import clsx from "clsx";
import {
    SendIcon,
} from "../icons";
import Textarea from "react-textarea-autosize";

import { useRouter } from "next/navigation";

const examples = [
    "Go Back to StattAI.",
    "Save changes.",
    "Clear."
];

function fetchStatt() {
    return (typeof window !== 'undefined' && window.localStorage.getItem("statt_test")) || ""
}

function updateStatt(val: string) {

    if (typeof window !== 'undefined') {

        window.localStorage.setItem("statt_test", val)
        location.reload()
    }
}
function clearStatt() {
    (typeof window !== 'undefined' && window.localStorage.removeItem("statt_test"))
    location.reload()
}


export default function Chat() {
    const formRef = useRef<HTMLFormElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const [statt, setStatt] = useState(fetchStatt())

    const router = useRouter()

    useEffect(() => {

        setStatt(fetchStatt())

        let elem = (document.getElementById("textarea") as HTMLInputElement)
        if (elem) {
            elem.focus()
            elem.setSelectionRange(elem.value.length, elem.value.length);
        }

    }, [])

    return (
        <main className="flex flex-col items-center justify-between pb-40">

            <div className="border-gray-200sm:mx-0 mx-5 mt-20 max-w-screen-md rounded-md border sm:w-full">

                <div className="flex flex-col space-y-4 border-t border-gray-200 bg-gray-50 p-7 sm:p-10">
                    {examples.map((example, i) => (
                        <button
                            key={i}
                            className="rounded-md border border-gray-200 bg-white px-5 py-3 text-left text-sm text-gray-500 transition-all duration-75 hover:border-black hover:text-gray-700 active:bg-gray-50"
                            onClick={() => {
                                if (example === "Go Back to StattAI.") {
                                    router.push("/")
                                }
                                else if (example === "Save changes.") {
                                    updateStatt(statt)
                                }
                                else if (example === "Clear.") {
                                    clearStatt()
                                }
                            }}
                        >
                            {example}
                        </button>
                    ))}
                </div>
            </div>

            <div className="fixed bottom-0 flex w-full flex-col items-center space-y-3 bg-gradient-to-b from-transparent via-gray-100 to-gray-100 p-5 pb-3 sm:px-0">

                <div
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
                        value={statt}
                        onChange={(e) => setStatt(e.target.value)}
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
                        onClick={() => {
                            updateStatt(statt)
                        }}
                        className={clsx(
                            "absolute inset-y-0 right-3 my-auto flex h-8 w-8 items-center justify-center rounded-md transition-all",
                            "bg-green-500 hover:bg-green-600",
                        )}
                    >

                        <SendIcon
                            className={clsx(
                                "h-4 w-4",
                                statt.length === 0 ? "text-gray-300" : "text-white",
                            )}
                        />

                    </button>
                </div>

            </div>

        </main>
    );
}
