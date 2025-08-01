"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Sun, Moon } from "lucide-react"

export default function YearProgress() {
  const [progress, setProgress] = useState(0)
  const [daysRemaining, setDaysRemaining] = useState(0)
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // Initialize dark mode based on system preference or local storage
    const storedTheme = localStorage.getItem("theme")
    if (storedTheme === "dark") {
      setIsDarkMode(true)
    } else if (storedTheme === "light") {
      setIsDarkMode(false)
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setIsDarkMode(true)
    }
  }, [])

  useEffect(() => {
    // Apply or remove 'dark' class to the html element
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    // Store preference
    localStorage.setItem("theme", isDarkMode ? "dark" : "light")
  }, [isDarkMode])

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev)
  }

  useEffect(() => {
    const calculateProgress = () => {
      const now = new Date()
      const year = now.getFullYear()
      const startOfYear = new Date(year, 0, 1)
      const endOfYear = new Date(year + 1, 0, 1)

      const totalDays = (endOfYear.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)
      const daysPassed = (now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)

      const yearProgress = (daysPassed / totalDays) * 100
      const remaining = Math.ceil(totalDays - daysPassed)

      setProgress(yearProgress)
      setDaysRemaining(remaining)
      setCurrentYear(year)
    }

    calculateProgress()
    const interval = setInterval(calculateProgress, 1000 * 60 * 60) // Update every hour

    return () => clearInterval(interval)
  }, [])

  const circumference = 2 * Math.PI * 120
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-4 overflow-hidden relative">
      {/* Theme toggle button - Top Right */}
      <div className="absolute top-4 right-4 z-10">
        <Button variant="ghost" size="icon" onClick={toggleDarkMode} aria-label="Toggle dark mode">
          {isDarkMode ? (
            <Sun className="h-5 w-5 text-slate-700 dark:text-slate-300" />
          ) : (
            <Moon className="h-5 w-5 text-slate-700 dark:text-slate-300" />
          )}
        </Button>
      </div>

      {/* Main centered content */}
      <div className="text-center max-w-2xl mx-auto flex flex-col items-center justify-center h-full mt-12">
        {/* Your journey text - Centered above percentage */}
        <div className="mb-12">
          <p className="text-slate-700 dark:text-slate-300 text-xl md:text-2xl font-light leading-relaxed">
            Your journey through {currentYear}
          </p>
        </div>

        {/* Progress Circle */}
        <div className="relative mb-12">
          <svg className="transform -rotate-90 w-80 h-80 mx-auto" viewBox="0 0 280 280">
            {/* Background circle */}
            <circle
              cx="140"
              cy="140"
              r="120"
              stroke="rgb(226 232 240)"
              strokeWidth="8"
              fill="transparent"
              className="dark:stroke-gray-700"
            />
            {/* Progress circle */}
            <circle
              cx="140"
              cy="140"
              r="120"
              stroke="url(#purpleGradient)"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              {/* More Shades of Purple Gradient Definition */}
              <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgb(192 132 252)" /> {/* Light Lavender */}
                <stop offset="25%" stopColor="rgb(168 85 247)" /> {/* Medium Purple */}
                <stop offset="50%" stopColor="rgb(139 92 246)" /> {/* Amethyst */}
                <stop offset="75%" stopColor="rgb(124 58 237)" /> {/* Darker Purple */}
                <stop offset="100%" stopColor="rgb(109 40 217)" /> {/* Deep Violet */}
              </linearGradient>
            </defs>
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-light text-slate-800 dark:text-slate-200 mb-2">
                {progress.toFixed(1)}%
              </div>
              <div className="text-slate-500 dark:text-slate-400 text-sm uppercase tracking-wider">Complete</div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="text-center">
            <div className="text-2xl font-light text-slate-800 dark:text-slate-200 mb-1">
              {Math.floor((new Date().getTime() - new Date(currentYear, 0, 1).getTime()) / (1000 * 60 * 60 * 24))}
            </div>
            <div className="text-slate-500 dark:text-slate-400 text-sm uppercase tracking-wider">Days Passed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-light text-slate-800 dark:text-slate-200 mb-1">{daysRemaining}</div>
            <div className="text-slate-500 dark:text-slate-400 text-sm uppercase tracking-wider">Days Remaining</div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-slate-400 dark:text-slate-500 text-sm">
          <p>Time is precious. Make every moment count.</p>
        </div>
      </div>
    </div>
  )
}
