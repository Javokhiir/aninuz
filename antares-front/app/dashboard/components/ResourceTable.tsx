"use client"

import React from "react"

interface Column {
  key: string
  label: string
  render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode
}

interface ResourceTableProps {
  title: string
  columns: Column[]
  data: Record<string, unknown>[]
  loading?: boolean
  onAdd?: () => void
  onEdit?: (row: Record<string, unknown>) => void
  onDelete?: (row: Record<string, unknown>) => void
  pagination?: {
    currentPage: number
    lastPage: number
    onPageChange: (page: number) => void
  }
  extraActions?: (row: Record<string, unknown>) => React.ReactNode
}

export function ResourceTable({
  title,
  columns,
  data,
  loading,
  onAdd,
  onEdit,
  onDelete,
  pagination,
  extraActions,
}: ResourceTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="flex items-center justify-between p-6 border-b">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        {onAdd && (
          <button
            onClick={onAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            + Add New
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b">
                {columns.map((col) => (
                  <th key={col.key} className="text-left px-6 py-3 font-semibold text-gray-600 uppercase text-xs tracking-wider">
                    {col.label}
                  </th>
                ))}
                {(onEdit || onDelete || extraActions) && (
                  <th className="text-right px-6 py-3 font-semibold text-gray-600 uppercase text-xs tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="text-center py-12 text-gray-400">
                    No data found
                  </td>
                </tr>
              ) : (
                data.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    {columns.map((col) => (
                      <td key={col.key} className="px-6 py-4 text-gray-700">
                        {col.render
                          ? col.render(row[col.key], row)
                          : String(row[col.key] ?? "")}
                      </td>
                    ))}
                    {(onEdit || onDelete || extraActions) && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {extraActions?.(row)}
                          {onEdit && (
                            <button
                              onClick={() => onEdit(row)}
                              className="text-blue-600 hover:text-blue-800 font-medium text-xs px-2 py-1 rounded border border-blue-200 hover:border-blue-400 transition-colors"
                            >
                              Edit
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => {
                                if (confirm("Are you sure?")) onDelete(row)
                              }}
                              className="text-red-500 hover:text-red-700 font-medium text-xs px-2 py-1 rounded border border-red-200 hover:border-red-400 transition-colors"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
      {pagination && pagination.lastPage > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t">
          <span className="text-sm text-gray-500">
            Page {pagination.currentPage} of {pagination.lastPage}
          </span>
          <div className="flex gap-1">
            {Array.from({ length: pagination.lastPage }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => pagination.onPageChange(page)}
                className={`w-8 h-8 rounded text-sm transition-colors ${
                  page === pagination.currentPage
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
