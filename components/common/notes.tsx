"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Save, Expand, Shrink, Trash2 } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { useDebounce } from "use-debounce";
import { toast } from "sonner";

type NotesSectionProps = {
  fileUrl: string;
  userId?: string;
  className?: string;
};

const NotesSection = ({ fileUrl, userId, className }: NotesSectionProps) => {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [debouncedNotes] = useDebounce(notes, 2000); // Auto-save after 2s inactivity

  // Save notes
  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/save-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileUrl, userId, notes }),
      });

      if (!res.ok) throw new Error("Failed to save notes");

      toast.success("Notes saved successfully");
    } catch (err) {
      toast.error("Failed to save notes");
      console.error(err);
    } finally {
      setSaving(false);
    }
  }, [fileUrl, userId, notes]);

  // Fetch saved notes
  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/get-notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileUrl, userId }),
        });
        const data = await res.json();
        setNotes(data.notes || "");
      } catch (err) {
        console.error("Failed to load notes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [fileUrl, userId]);

  // Auto-save on debounced input
  useEffect(() => {
    if (debouncedNotes && debouncedNotes !== notes) {
      handleSave();
    }
  }, [debouncedNotes, handleSave, notes]);

  const clearNotes = () => {
    setNotes("");
    toast.info("Notes cleared (save to confirm)");
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-gray-800 text-lg">Document Notes</h4>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? (
              <Shrink className="w-4 h-4" />
            ) : (
              <Expand className="w-4 h-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearNotes}
            title="Clear notes"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={saving}
            className="gap-1"
          >
            {saving ? (
              "Saving..."
            ) : (
              <>
                <Save className="w-4 h-4" /> Save
              </>
            )}
          </Button>
        </div>
      </div>

      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Write your notes here..."
        rows={isExpanded ? 15 : 8}
        disabled={loading}
        className={`resize-none focus:ring-emerald-200 focus:border-emerald-300 transition-all ${
          isExpanded ? "min-h-[400px]" : "min-h-[200px]"
        }`}
      />

      <div className="mt-2 flex justify-between items-center text-sm text-gray-500">
        <div>
          {notes.length > 0 && (
            <span>
              {notes.length} characters •{" "}
              {notes.split(/\s+/).filter(Boolean).length} words
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesSection;
