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


    async function newLog() {
        const res = await fetch("https://faas-nyc1-2ef2e6cc.doserverless.co/api/v1/web/fn-57c901d6-87ec-4d97-8aac-42270b1b86cb/default/statt-log")

    }


    async function emailLog() {
        const res = await fetch("https://faas-nyc1-2ef2e6cc.doserverless.co/api/v1/web/fn-57c901d6-87ec-4d97-8aac-42270b1b86cb/default/statt-log?forceEmail=true")


    }

    async function jiraLog() {
        const res = await fetch("https://faas-nyc1-2ef2e6cc.doserverless.co/api/v1/web/fn-57c901d6-87ec-4d97-8aac-42270b1b86cb/default/statt-log?jiraUpdate=true")

    }

    const examples = [

        {
            title: "Go Back to StattAI.",
            onClick: () => {
                router.push("/")
            }
        },
        {
            title: "Generate a new report.",
            onClick: () => {
                newLog();
                alert("Report may take a few minutes to refresh.");
                if (window) window.location.reload();
            }
        },
        {
            title: "Send an email to watchlist.",
            onClick: () => {
                emailLog();
                alert("Email will be sent once report is refreshed.");
                if (window) window.location.reload();
            }
        },

        {
            title: "Post update to JIRA.",
            onClick: () => {
                jiraLog();
                alert("Jira will be updated once report is refreshed.");
                if (window) window.location.reload();
            }
        },
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

                        
        </main>
    );
}