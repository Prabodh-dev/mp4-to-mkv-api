const form = document.getElementById('convertForm');
const statusDiv = document.getElementById('status');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  statusDiv.textContent = '';
  const fileInput = document.getElementById('videoInput');
  if (!fileInput.files.length) {
    statusDiv.textContent = 'Please select an MP4 file.';
    return;
  }
  const file = fileInput.files[0];
  if (file.type !== 'video/mp4') {
    statusDiv.textContent = 'Only MP4 files are allowed.';
    return;
  }
  const formData = new FormData();
  formData.append('video', file);
  statusDiv.textContent = 'Uploading and converting...';
  try {
    const response = await fetch('/convert', {
      method: 'POST',
      body: formData
    });
    if (!response.ok) {
      throw new Error('Conversion failed.');
    }
    const blob = await response.blob();
    // Try to get filename from Content-Disposition header
    let filename = 'converted.mkv';
    const disposition = response.headers.get('Content-Disposition');
    if (disposition && disposition.indexOf('filename=') !== -1) {
      filename = disposition.split('filename=')[1].replace(/"/g, '');
    }
    // Create a link and trigger download
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
    statusDiv.textContent = 'Download should start automatically.';
  } catch (err) {
    statusDiv.textContent = err.message || 'An error occurred.';
  }
}); 