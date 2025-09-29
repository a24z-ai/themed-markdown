import { Pencil, Save, X } from 'lucide-react';
import React, { useState, useCallback, useRef, useEffect } from 'react';

import { Theme, useTheme } from '@a24z/industry-theme';

import { IndustryMarkdownSlide, IndustryMarkdownSlideProps } from './IndustryMarkdownSlide';

export interface IndustryEditableMarkdownSlideProps extends IndustryMarkdownSlideProps {
  onContentChange?: (newContent: string) => void;
  onSave?: (content: string) => Promise<void>;
  autoSaveDelay?: number;
  editable?: boolean;
  showEditButton?: boolean;
  theme?: Theme; // Add theme as optional prop
}

export const IndustryEditableMarkdownSlide: React.FC<IndustryEditableMarkdownSlideProps> = ({
  content,
  onContentChange,
  onSave,
  autoSaveDelay = 1000,
  editable = true,
  showEditButton = true,
  theme: themeProp,
  ...slideProps
}) => {
  // Try to get theme from context, but don't fail if not available
  let contextTheme;
  try {
    const themeContext = useTheme();
    contextTheme = themeContext.theme;
  } catch {
    // Context not available, will use prop
  }

  const theme = themeProp || contextTheme;

  if (!theme) {
    throw new Error(
      'IndustryEditableMarkdownSlide: theme must be provided either as a prop or through ThemeProvider',
    );
  }
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const [isSaving, setIsSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Update edit content when prop changes
  useEffect(() => {
    setEditContent(content);
  }, [content]);

  // Auto-save functionality
  useEffect(() => {
    if (isEditing && autoSaveDelay && onSave) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        handleSave(false); // Auto-save shouldn't exit edit mode
      }, autoSaveDelay);
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [editContent, isEditing, autoSaveDelay]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
    setTimeout(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(0, 0);
    }, 100);
  }, []);

  const handleCancel = useCallback(() => {
    setEditContent(content);
    setIsEditing(false);
  }, [content]);

  const handleSave = useCallback(async (exitEditMode = true) => {
    if (onContentChange) {
      onContentChange(editContent);
    }

    if (onSave) {
      setIsSaving(true);
      try {
        await onSave(editContent);
      } catch (error) {
        console.error('Failed to save:', error);
      } finally {
        setIsSaving(false);
      }
    }

    if (exitEditMode) {
      setIsEditing(false);
    }
  }, [editContent, onContentChange, onSave]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCancel();
      } else if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    },
    [handleCancel, handleSave],
  );

  // Auto-resize textarea
  const handleTextareaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    setEditContent(textarea.value);

    // Auto-resize
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, []);

  if (isEditing) {
    return (
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: theme.colors.background,
          color: theme.colors.text,
        }}
      >
        {/* Edit Mode Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: theme.space[3],
            borderBottom: `1px solid ${theme.colors.border}`,
            backgroundColor: theme.colors.muted,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.space[2],
              fontSize: theme.fontSizes[1],
              color: theme.colors.textSecondary,
            }}
          >
            <Pencil size={16} />
            <span>Editing Mode</span>
            {autoSaveDelay && <span>(Auto-save enabled)</span>}
          </div>
          <div
            style={{
              display: 'flex',
              gap: theme.space[2],
            }}
          >
            <button
              onClick={() => handleSave()}
              disabled={isSaving}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.space[1],
                padding: `${theme.space[1]}px ${theme.space[3]}px`,
                backgroundColor: theme.colors.primary,
                color: theme.colors.background,
                border: 'none',
                borderRadius: theme.radii[1],
                fontSize: theme.fontSizes[1],
                cursor: isSaving ? 'not-allowed' : 'pointer',
                opacity: isSaving ? 0.7 : 1,
              }}
            >
              <Save size={14} />
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.space[1],
                padding: `${theme.space[1]}px ${theme.space[3]}px`,
                backgroundColor: theme.colors.secondary,
                color: theme.colors.text,
                border: 'none',
                borderRadius: theme.radii[1],
                fontSize: theme.fontSizes[1],
                cursor: 'pointer',
              }}
            >
              <X size={14} />
              Cancel
            </button>
          </div>
        </div>

        {/* Edit Mode Content */}
        <div
          style={{
            flex: 1,
            padding: theme.space[4],
            overflow: 'auto',
          }}
        >
          <textarea
            ref={textareaRef}
            value={editContent}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            style={{
              width: '100%',
              minHeight: '100%',
              padding: theme.space[3],
              backgroundColor: theme.colors.background,
              color: theme.colors.text,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.radii[2],
              fontFamily: theme.fonts.monospace,
              fontSize: theme.fontSizes[1],
              lineHeight: theme.lineHeights.relaxed,
              resize: 'none',
              outline: 'none',
            }}
            placeholder="Enter your markdown content here..."
          />
        </div>
      </div>
    );
  }

  // View Mode
  return (
    <div style={{ position: 'relative', height: '100%' }}>
      {/* Edit Button */}
      {editable && showEditButton && (
        <button
          onClick={handleEdit}
          style={{
            position: 'absolute',
            top: theme.space[3],
            right: theme.space[3],
            display: 'flex',
            alignItems: 'center',
            gap: theme.space[1],
            padding: `${theme.space[1]}px ${theme.space[3]}px`,
            backgroundColor: theme.colors.secondary,
            color: theme.colors.background,
            border: 'none',
            borderRadius: theme.radii[1],
            fontSize: theme.fontSizes[1],
            cursor: 'pointer',
            zIndex: 10,
            transition: 'opacity 0.2s',
            opacity: 0.8,
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '0.8')}
        >
          <Pencil size={14} />
          Edit
        </button>
      )}

      {/* Markdown Content */}
      <IndustryMarkdownSlide {...slideProps} content={content} theme={theme} />
    </div>
  );
};
