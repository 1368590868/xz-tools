export function downloadBlobFile(
  data: BlobPart,
  filename: string,
  mimeType = 'application/vnd.ms-excel',
) {
  const blob = new Blob([data], { type: mimeType });
  const url = window.URL.createObjectURL(blob);

  const tempLink = document.createElement('a');
  tempLink.style.display = 'none';
  tempLink.href = url;
  tempLink.setAttribute('download', filename);
  if (typeof tempLink.download === 'undefined') {
    tempLink.setAttribute('target', '_blank');
  }
  document.body.appendChild(tempLink);
  tempLink.click();
  document.body.removeChild(tempLink);
  window.URL.revokeObjectURL(url);
}

export function parseFileNameParams(contentDisposition: string) {
  const filenameMatch = contentDisposition.match(/filename=([^;]+)/i);
  if (!filenameMatch) return null;

  const filenameEncoded = filenameMatch[1].replace(/^["']|["']$/g, '');
  const filenameDecoded = decodeURIComponent(filenameEncoded);
  const paramPart = filenameDecoded.replace(/\.\w+$/, '');

  const params = Object.fromEntries(paramPart.split('&').map((kv) => kv.split('=')));

  return {
    filename: filenameDecoded,
    params,
  };
}
