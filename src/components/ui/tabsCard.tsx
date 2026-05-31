"use client"

import { useState } from "react"

export const CustomTabsWithTooltips = ({setMode})=> {
  const [hovered, setHovered] = useState<string | null>(null)
  const [type, setType] = useState("noAi")

  const tabs = [
    {
      id: "noAi",
      label: "Fully Manual Mode",
      description: "No AI suggestions and spellcheck.",
    },
    {
      id: "ai",
      label: "AI Assist Mode",
      description: "AI Assist by providing suggestions and spellcheck.",
    },
    
  ]

  const handleNavClick = (id: string) => {
    id==="ai"?setMode(true):setMode(false)
    setType(id)
  }

  return (
    <div className="btnContainer flex gap-2 bg-black/10 backdrop-blur-md shadow-md shadow-white/5 rounded-4xl py-1 w-fit px-1  justify-center relative">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          onClick={() => handleNavClick(tab.id)}
          onMouseEnter={() => setHovered(tab.id)}
          onMouseLeave={() => setHovered(null)}
          className={`btn px-2 py-1 rounded-4xl cursor-pointer font-semibold relative ${
            type === tab.id ? "bg-[#bec5cb44]" : ""
          }`}
        >
          <p>{tab.label}</p>

          {/* Tooltip */}
          {/* {hovered === tab.id && (
            <div className="absolute left-0 top-full mt-2 w-64 bg-[#1234] border rounded-md shadow-lg p-3 z-10">
              <p className="text-sm text-gray-700">{tab.description}</p>
            </div>
          )} */}
        </div>
      ))}
    </div>
  )
}
