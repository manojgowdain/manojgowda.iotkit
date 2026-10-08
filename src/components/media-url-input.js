"use client";

import { useState } from "react";
import { createClient } from "../lib/client";

const MAX_FILE_SIZE = 50 * 1024 * 1024;

export default function MediaUrlInput({ id, name, label, defaultValue = "", mediaType }) {
  const [url, setUrl] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  async function uploadFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setMessage("Choose a file smaller than 50 MB.");
      event.target.value = "";
      return;
    }
    if (!file.type.startsWith(`${mediaType}/`)) {
      setMessage(`Choose a valid ${mediaType} file.`);
      event.target.value = "";
      return;
    }

    setUploading(true);
    setMessage("");
    try {
      const supabase = createClient();
      const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
      const path = `${mediaType}/${crypto.randomUUID()}-${safeName}`;
      const { data, error } = await supabase.storage
        .from("content-media")
        .upload(path, file, { contentType: file.type, upsert: false });

      if (error) throw error;

      const { data: publicData } = supabase.storage
        .from("content-media")
        .getPublicUrl(data.path);
      setUrl(publicData.publicUrl);
      setMessage("Uploaded. Save the content to keep this URL.");
    } catch (error) {
      console.error("Unable to upload content media:", error);
      setMessage(
        error.message?.includes("Bucket not found")
          ? "Storage is not set up yet. Apply the content-media migration, or paste an external URL."
          : `Upload failed: ${error.message || "Please try again."}`,
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  const fileId = `${id}-upload`;

  return (
    <div className="media-url-field">
      <label htmlFor={id}>{label} URL <span className="label-hint">(external URL or uploaded file)</span></label>
      <input
        id={id}
        name={name}
        type="url"
        maxLength={2000}
        value={url}
        onChange={(event) => setUrl(event.target.value)}
      />
      <label className="media-upload-label" htmlFor={fileId}>
        {uploading ? "Uploading…" : `Upload ${mediaType} to Supabase Storage`}
      </label>
      <input
        className="media-file-input"
        id={fileId}
        type="file"
        accept={`${mediaType}/*`}
        disabled={uploading}
        onChange={uploadFile}
      />
      {message && <p className="media-upload-status" role="status">{message}</p>}
    </div>
  );
}
