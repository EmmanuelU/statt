"use client"
import { useRef, useState, useEffect } from "react";
import clsx from "clsx";
import { SendIcon } from "../icons";
import { useRouter } from "next/navigation";

const examples = [
    "Go Back to StattAI.",
    "Save changes."
];

async function fetchStatt() {
    const res = await fetch("https://realmtest.sfo3.digitaloceanspaces.com/uic-statt0/log/urls.example.json", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        cache: "no-cache"
    });
    const log = await res.json()
    return log.urls;
}

async function updateStatt(urls: string[]) {
    const jsonObject = { urls };
    const res = await fetch("/api/urls", {
        method: "POST",
        body: JSON.stringify(jsonObject),
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    });
}

export default function Chat() {
    const [urls, setUrls] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        fetchStatt().then(setUrls);
    }, []);

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasUnsavedChanges]);

    const validateUrls = (urlsToValidate: string[]) => {
        const newErrors: Record<string, string> = {};
        const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

        urlsToValidate.forEach((url, index) => {
            if (!urlRegex.test(url)) {
                newErrors[`url${index}`] = "Invalid URL format";
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const addUrl = () => {
        if (inputValue && !urls.includes(inputValue)) {
            if (validateUrls([inputValue])) {
                setUrls([...urls, inputValue]);
                setInputValue("");
                setHasUnsavedChanges(true);
            }
        }
    };

    const removeUrl = (url: string) => {
        setUrls(urls.filter(u => u !== url));
        setHasUnsavedChanges(true);
    };

    const saveChanges = async () => {
        if (validateUrls(urls)) {
            await updateStatt(urls);
            setHasUnsavedChanges(false);
            alert("Changes saved successfully.");
        } else {
            alert("Please correct the invalid URLs before saving.");
        }
    };

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
                                    if (!hasUnsavedChanges || window.confirm("You have unsaved URLs, are you sure?"))
                                        router.push("/")
                                } else if (example === "Save changes.") {
                                    saveChanges()
                                }
                            }}
                        >
                            {example} {example === "Save changes." && hasUnsavedChanges && "*"}
                        </button>
                    ))}
                </div>
            </div>

            <div className="fixed bottom-0 flex w-full flex-col items-center space-y-3 bg-gradient-to-b from-transparent via-gray-100 to-gray-100 p-5 pb-3 sm:px-0">
                <div className="relative w-full max-w-screen-md rounded-xl border border-gray-200 bg-white px-4 pb-2 pt-3 shadow-lg sm:pb-3 sm:pt-4">
                    <div className="flex flex-wrap gap-2 mb-2">
                        {urls.map((url, index) => (
                            <div key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center">
                                <span>{url}</span>
                                <button onClick={() => removeUrl(url)} className="ml-2 text-blue-600 hover:text-blue-800">
                                    &times;
                                </button>
                                {errors[`url${index}`] && (
                                    <span className="text-red-500 text-xs ml-2">{errors[`url${index}`]}</span>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex">
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    addUrl();
                                    e.preventDefault();
                                }
                            }}
                            placeholder="Add URL to watchlist"
                            className="w-full pr-10 focus:outline-none"
                        />
                        <button
                            onClick={addUrl}
                            className={clsx(
                                "ml-2 flex h-8 w-8 items-center justify-center rounded-md transition-all",
                                "bg-green-500 hover:bg-green-600",
                            )}
                        >
                            <SendIcon className="h-4 w-4 text-white" />
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}