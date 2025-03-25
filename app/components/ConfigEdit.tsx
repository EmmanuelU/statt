"use client";
import { useRef, useState, useEffect } from "react";
import clsx from "clsx";
import { SendIcon } from "../icons";
import { useRouter } from "next/navigation";


async function fetchConfig() {
    const res = await fetch(
        "https://realmtest.sfo3.digitaloceanspaces.com/uic-statt0/config/settings.json",
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            cache: "no-cache",
        }
    );
    const config = await res.json();
    console.log(config)

    return config;
}

async function updateConfig(config: Record<string, string>) {
    const res = await fetch("/api/config", {
        method: "POST",
        body: JSON.stringify({ settings: config }),
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    });

    return res
}

export default function ConfigEdit() {
    const [config, setConfig] = useState<Record<string, string>>({});
    const [inputValue, setInputValue] = useState("");
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();



    const examples = [

        {
            title: "Go Back to StattAI.",
            onClick: () => {
                router.push("/")
            }
        },
        {
            title: "Make a change to watchlist.",
            onClick: () => router.push("/edit")
        },
        {
            title: "Make a change to notification group.",
            onClick: () => router.push("/emails")
        },
        {
            title: "Help.",
            onClick: () => {
                alert("You can set new params here, such as DebugMode:true")
            }
        }
        ,
        { title: "Save changes." }
    ];

    useEffect(() => {
        fetchConfig().then(setConfig);
    }, []);

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = "";
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [hasUnsavedChanges]);

    const addConfigValue = () => {
        if (inputValue) {
            const [key, value] = inputValue.split(":");
            if (key && value) {
                setConfig({ ...config, [key.trim()]: value.trim() });
                setHasUnsavedChanges(true);
                setInputValue("");
            }
        }
    };

    const removeConfigValue = (key: string) => {
        const newConfig = { ...config };
        delete newConfig[key];
        setConfig(newConfig);
        setHasUnsavedChanges(true);
    };

    const saveChanges = async () => {
        try {
            const response = await updateConfig(config);
            const out = await response.json()
            console.log(out)
            setHasUnsavedChanges(false);
            alert("Changes saved successfully.");

        } catch (e) {
            alert("error")
            console.log(e)
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
                                // Use custom onClick if defined, otherwise fall back to default behavior
                                if (example.onClick) {
                                    example.onClick();
                                }
                            }}
                        >
                            {example.title}
                        </button>
                    ))}
                </div>
            </div>

            <div className="fixed bottom-0 flex w-full flex-col items-center space-y-3 bg-gradient-to-b from-transparent via-gray-100 to-gray-100 p-5 pb-3 sm:px-0">
                <div className="relative w-full max-w-screen-md rounded-xl border border-gray-200 bg-white px-4 pb-2 pt-3 shadow-lg sm:pb-3 sm:pt-4">
                    <div className="flex flex-wrap gap-2 mb-2">
                        {Object.entries(config).map(([key, value]) => (
                            <div
                                key={key}
                                className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center"
                            >
                                <span>{key}: {value}</span>
                                <button
                                    onClick={() => removeConfigValue(key)}
                                    className="ml-2 text-blue-600 hover:text-blue-800"
                                >
                                    &times;
                                </button>
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
                                    addConfigValue();
                                    e.preventDefault();
                                }
                            }}
                            placeholder="Add key:value pair"
                            className="w-full pr-10 focus:outline-none"
                        />
                        <button
                            onClick={addConfigValue}
                            className={clsx(
                                "ml-2 flex h-8 w-8 items-center justify-center rounded-md transition-all",
                                "bg-green-500 hover:bg-green-600"
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