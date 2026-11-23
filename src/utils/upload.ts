const MIME: Record<string, string> = {
  png: 'image/png',
  webp: 'image/webp',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  mp4: 'video/mp4',
  mov: 'video/quicktime',
  m4v: 'video/x-m4v',
};

export function fileFromUri(uri: string) {
  const name = uri.split('/').pop() ?? 'file.jpg';
  const ext = name.split('.').pop()?.toLowerCase() ?? 'jpg';
  return { uri, name, type: MIME[ext] ?? 'application/octet-stream' } as any;
}