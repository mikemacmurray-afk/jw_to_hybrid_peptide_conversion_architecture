interface DownloadButtonProps {
  text: string;
  presetName: string;
  disabled: boolean;
}

export function DownloadButton({ text, presetName, disabled }: DownloadButtonProps) {
  const handleDownload = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${presetName}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      className="btn-download"
      onClick={handleDownload}
      disabled={disabled}
    >
      Download Preset (.txt)
    </button>
  );
}
