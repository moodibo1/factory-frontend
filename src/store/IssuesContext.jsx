import { createContext, useContext, useState } from 'react'
import { mockIssues } from './mockData'

const IssuesContext = createContext()

export function IssuesProvider({ children }) {
  const [issues, setIssues] = useState(mockIssues)

  const addIssue = (issue) => {
    setIssues((prev) => [{ ...issue, id: Date.now(), comments: [] }, ...prev])
  }

  const addComment = (issueId, comment) => {
    setIssues((prev) =>
      prev.map((i) =>
        i.id === issueId ? { ...i, comments: [...i.comments, comment] } : i
      )
    )
  }

  return (
    <IssuesContext.Provider value={{ issues, addIssue, addComment }}>
      {children}
    </IssuesContext.Provider>
  )
}

export function useIssues() {
  return useContext(IssuesContext)
}
