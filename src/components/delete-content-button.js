"use client";

import { Button } from "./ui/button";

export default function DeleteContentButton() {
  return (
    <Button
      type="submit"
      variant="destructive"
      onClick={(event) => {
        if (!window.confirm("Delete this content permanently? This cannot be undone.")) {
          event.preventDefault();
        }
      }}
    >
      Delete permanently
    </Button>
  );
}
