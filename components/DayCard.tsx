import React from 'react'

export default function DayCard({ title, content }: { title: string, content: React.ReactNode }) {
  return (
    <div className="prayer-card">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div>{content}</div>
    </div>
  )
}
