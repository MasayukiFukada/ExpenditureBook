'use client'

import { useState } from 'react'
import { Check, Edit2 } from 'lucide-react'

export function CommentForm({ yearMonth, initialComment }: { yearMonth: string, initialComment: string }) {
  const [comment, setComment] = useState(initialComment)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ yearMonth, comment })
      })
      if (response.ok) {
        setIsEditing(false)
      } else {
        alert('保存に失敗しました')
      }
    } catch (error) {
      console.error('Save error:', error)
      alert('エラーが発生しました')
    } finally {
      setIsSaving(false)
    }
  }

  if (isEditing) {
    return (
      <div className="flex flex-col gap-2">
        <textarea 
          className="w-full bg-background border rounded px-2 py-1 text-sm min-h-[80px]"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          autoFocus
        />
        <div className="flex justify-end gap-2">
          <button 
            onClick={() => setIsEditing(false)}
            className="text-xs px-2 py-1 rounded hover:bg-muted"
          >
            キャンセル
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs flex items-center gap-1 disabled:opacity-50"
          >
            <Check size={14} />
            <span>保存</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-between items-start group min-h-[40px]">
      <p className="text-sm italic text-muted-foreground whitespace-pre-wrap">
        {comment || "コメントなし"}
      </p>
      <button 
        onClick={() => setIsEditing(true)}
        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-muted rounded transition-opacity shrink-0"
      >
        <Edit2 size={14} />
      </button>
    </div>
  )
}
