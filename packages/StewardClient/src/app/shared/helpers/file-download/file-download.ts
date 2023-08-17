/** Given a file name and text content, download a file. */
export function downloadJsonFile(fileName: string, fileContent: string): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(fileContent);
  const link = document.createElement('a');
  link.href = dataStr;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
}
