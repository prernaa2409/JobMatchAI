import { useState } from 'react';
import FileUpload from '../FileUpload';

export default function FileUploadExample() {
  const [text, setText] = useState("");

  return (
    <div className="p-6 space-y-4">
      <FileUpload onFileSelect={setText} />
      {text && (
        <div className="p-4 bg-card rounded-lg">
          <p className="text-sm text-muted-foreground">Extracted text: {text.substring(0, 100)}...</p>
        </div>
      )}
    </div>
  );
}
