import { useCallback, useState, useRef } from 'react';

interface FileUploadProps {
  onFileLoaded: (content: string) => void;
  hasFile: boolean;
  fileName?: string;
}

export function FileUpload({ onFileLoaded, hasFile }: FileUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [loadedName, setLoadedName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onFileLoaded(content);
        setLoadedName(file.name);
      };
      reader.readAsText(file);
    },
    [onFileLoaded]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <div
      className={`file-upload ${dragOver ? 'drag-over' : ''} ${hasFile ? 'has-file' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".txt"
        onChange={handleChange}
        style={{ display: 'none' }}
      />
      {hasFile ? (
        <div className="file-loaded">
          <span className="file-icon">&#10003;</span>
          <span>{loadedName}</span>
          <small>Click or drop to replace</small>
        </div>
      ) : (
        <div className="file-prompt">
          <span className="file-icon">&#8593;</span>
          <span>Drop JW preset file here or click to browse</span>
          <small>.txt Spooky2 preset file</small>
        </div>
      )}
    </div>
  );
}
