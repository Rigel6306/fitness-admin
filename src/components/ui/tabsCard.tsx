"use client"

import { useState } from "react"

export default function CustomTabsWithTooltips() {
  const [hovered, setHovered] = useState<string | null>(null)
  const [type, setType] = useState("overview")

  const tabs = [
    {
      id: "overview",
      label: "Fully Manual Mode",
      description: "No AI suggestions and spellcheck.",
    },
    {
      id: "workout",
      label: "AI Assist Mode",
      description: "AI Assist by providing suggestions and spellcheck.",
    },
    {
      id: "analytics",
      label: "Auto Mode",
      description: "AI will generate the Schedule for you based on the user data.",
    },
  ]

  const handleNavClick = (id: string) => {
    setType(id)
  }

  return (
    <div className="btnContainer flex gap-2 bg-[#4d4d4e44] rounded-4xl py-2 w-fit px-2  justify-center relative">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          onClick={() => handleNavClick(tab.id)}
          onMouseEnter={() => setHovered(tab.id)}
          onMouseLeave={() => setHovered(null)}
          className={`btn px-2 rounded-4xl cursor-pointer font-semibold relative ${
            type === tab.id ? "bg-[#bec5cb44]" : ""
          }`}
        >
          <p>{tab.label}</p>

          {/* Tooltip */}
          {hovered === tab.id && (
            <div className="absolute left-0 top-full mt-2 w-64 bg-[#1234] border rounded-md shadow-lg p-3 z-10">
              <p className="text-sm text-gray-700">{tab.description}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
