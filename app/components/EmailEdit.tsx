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

async function fetchEmails() {
    /*
    const res = await fetch("/api/log",{next: { revalidate: 0 }, cache: "no-store"})
    const log = await res.json()

    setLog(log.status)
    */
    const res = await fetch("https://realmtest.sfo3.digitaloceanspaces.com/uic-statt0/log/emails.example.json", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        cache: "no-cache"
    });
    const log = await res.json()

    return log.emails;
}

/*
function fetchStatt() {
    return (typeof window !== 'undefined' && window.localStorage.getItem("statt_test")) || ""
}
    */

async function updateEmails(val: string | undefined) {
    if (typeof val === "undefined")
        return;

    // Split the input string by commas and trim any whitespace from each URL
    const urlArray = String(val).split(',').map(url => url.trim());

    // Create a JSON object with the key 'urls'
    const jsonObject = {
        emails: urlArray
    };

    const res = await fetch("/api/emails", {
        method: "POST",
        body: JSON.stringify(jsonObject),
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    });

    alert("Updated emails.");
}
function clearStatt() {
    (typeof window !== 'undefined' && window.localStorage.removeItem("statt_test"))
    location.reload()
}


export default function Chat() {
    const formRef = useRef<HTMLFormElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const [emails, setEmails] = useState<string | undefined>();

    const router = useRouter()

    async function fetcher() {
        const res = await fetchEmails();
        setEmails(res)
    }

    useEffect(() => {

        fetcher();

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
                                    updateEmails(emails)
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
                        placeholder="Separate emails by comma ,"
                        value={emails}
                        onChange={(e) => setEmails(e.target.value)}
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
                            updateEmails(emails)
                        }}
                        className={clsx(
                            "absolute inset-y-0 right-3 my-auto flex h-8 w-8 items-center justify-center rounded-md transition-all",
                            "bg-green-500 hover:bg-green-600",
                        )}
                    >

                        <SendIcon
                            className={clsx(
                                "h-4 w-4",
                                emails && emails.length === 0 ? "text-gray-300" : "text-white",
                            )}
                        />

                    </button>
                </div>

            </div>

        </main>
    );
}
